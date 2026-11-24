"use client";

/**
 * AMBIENT AUDIO
 * - Plays /audio/oud.mp3 if present (drop your licensed oud track there).
 * - Otherwise falls back to a generated, royalty-free ambience: plucked
 *   strings in maqam Hijaz over a soft drone, synthesised in the browser.
 * - Never starts without a user gesture; remembers the preference;
 *   pauses when the tab is hidden and resumes on return.
 */

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const TRACK = "/audio/oud.mp3";
/** Set true once a licensed track is placed at public/audio/oud.mp3. */
const HAS_LICENSED_TRACK = false;
const PREF_KEY = "hp_sound";
const TARGET_VOLUME = 0.22;

type Ctx = { playing: boolean; start: () => void; toggle: () => void };
const AudioCtx = createContext<Ctx | null>(null);

export function useAmbientAudio() {
  const c = useContext(AudioCtx);
  if (!c) throw new Error("useAmbientAudio outside AudioProvider");
  return c;
}

function readPref() {
  try {
    return localStorage.getItem(PREF_KEY);
  } catch {
    return null;
  }
}
function writePref(v: "on" | "off") {
  try {
    localStorage.setItem(PREF_KEY, v);
  } catch {}
}

/* ── Generative engine ─────────────────────────────────────────── */
class Ambience {
  ctx: AudioContext;
  master: GainNode;
  private timer: number | null = null;
  private buffers: AudioBuffer[] = [];
  private reverb: ConvolverNode;

  constructor() {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);

    // simple generated reverb impulse — a warm courtyard
    this.reverb = this.ctx.createConvolver();
    const len = this.ctx.sampleRate * 3.2;
    const imp = this.ctx.createBuffer(2, len, this.ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = imp.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    this.reverb.buffer = imp;
    const wet = this.ctx.createGain();
    wet.gain.value = 0.45;
    this.reverb.connect(wet).connect(this.master);

    // maqam Hijaz on D: D Eb F# G A Bb C D (+ low A)
    const freqs = [110, 146.83, 155.56, 185.0, 196.0, 220.0, 233.08, 261.63, 293.66];
    this.buffers = freqs.map((f) => this.pluck(f));
    this.drone();
  }

  /** Karplus–Strong plucked string, gently low-passed for an oud-like body */
  private pluck(freq: number) {
    const sr = this.ctx.sampleRate;
    const dur = 2.6;
    const buf = this.ctx.createBuffer(1, Math.floor(sr * dur), sr);
    const out = buf.getChannelData(0);
    const period = Math.round(sr / freq);
    const ring = new Float32Array(period);
    for (let i = 0; i < period; i++) ring[i] = Math.random() * 2 - 1;
    let idx = 0;
    for (let i = 0; i < out.length; i++) {
      const next = (idx + 1) % period;
      const v = 0.4985 * (ring[idx] + ring[next]);
      out[i] = ring[idx];
      ring[idx] = v;
      idx = next;
    }
    return buf;
  }

  private drone() {
    const lp = this.ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 420;
    const g = this.ctx.createGain();
    g.gain.value = 0.05;
    [73.42, 110].forEach((f, i) => {
      const o = this.ctx.createOscillator();
      o.type = i ? "triangle" : "sine";
      o.frequency.value = f;
      o.connect(lp);
      o.start();
    });
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 0.05;
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain).connect(g.gain);
    lfo.start();
    lp.connect(g);
    g.connect(this.master);
    g.connect(this.reverb);
  }

  private note(i: number, when: number, vel: number) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.buffers[i];
    const tone = this.ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 1800;
    const g = this.ctx.createGain();
    g.gain.value = vel;
    src.connect(tone).connect(g);
    g.connect(this.master);
    g.connect(this.reverb);
    src.start(when);
  }

  /** a slow taqsim-like phrase generator, stepwise motion around the tonic */
  private phrase() {
    const t0 = this.ctx.currentTime + 0.05;
    let deg = 1 + Math.floor(Math.random() * 4);
    let t = t0;
    const len = 3 + Math.floor(Math.random() * 5);
    for (let n = 0; n < len; n++) {
      this.note(deg, t, 0.18 + Math.random() * 0.12);
      if (Math.random() < 0.25) this.note(deg, t + 0.11, 0.08); // tremolo pick
      t += 0.35 + Math.random() * 0.7;
      deg = Math.max(0, Math.min(8, deg + (Math.random() < 0.5 ? -1 : 1) * (Math.random() < 0.8 ? 1 : 2)));
    }
    this.note(Math.random() < 0.5 ? 1 : 0, t + 0.3, 0.2); // resolve
    return (t - t0 + 2.5 + Math.random() * 3) * 1000;
  }

  start() {
    this.ctx.resume();
    const loop = () => {
      const wait = this.phrase();
      this.timer = window.setTimeout(loop, wait);
    };
    if (this.timer == null) loop();
  }
  stop() {
    if (this.timer != null) clearTimeout(this.timer);
    this.timer = null;
  }
}

/* ── Provider ──────────────────────────────────────────────────── */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const el = useRef<HTMLAudioElement | null>(null);
  const gen = useRef<Ambience | null>(null);
  const hasTrack = useRef<boolean | null>(null);
  const fadeRaf = useRef<number | null>(null);
  const wasPlayingBeforeHide = useRef(false);

  useEffect(() => {
    hasTrack.current = HAS_LICENSED_TRACK;
  }, []);

  const fadeTo = useCallback((target: number, ms: number, done?: () => void) => {
    if (fadeRaf.current) cancelAnimationFrame(fadeRaf.current);
    const getV = () => (el.current ? el.current.volume : gen.current ? gen.current.master.gain.value : 0);
    const setV = (v: number) => {
      if (el.current) el.current.volume = v;
      if (gen.current) gen.current.master.gain.setValueAtTime(v, gen.current.ctx.currentTime);
    };
    const from = getV();
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      setV(from + (target - from) * p);
      if (p < 1) fadeRaf.current = requestAnimationFrame(step);
      else done?.();
    };
    fadeRaf.current = requestAnimationFrame(step);
  }, []);

  const play = useCallback(() => {
    if (hasTrack.current) {
      if (!el.current) {
        el.current = new Audio(TRACK);
        el.current.loop = true;
        el.current.volume = 0;
      }
      el.current.play().catch(() => {});
    } else {
      if (!gen.current) gen.current = new Ambience();
      gen.current.start();
    }
    setPlaying(true);
    fadeTo(TARGET_VOLUME, 2500);
  }, [fadeTo]);

  const pause = useCallback(
    (remember = true) => {
      setPlaying(false);
      if (remember) writePref("off");
      fadeTo(0, 700, () => {
        el.current?.pause();
        gen.current?.stop();
        gen.current?.ctx.suspend();
      });
    },
    [fadeTo],
  );

  const start = useCallback(() => {
    writePref("on");
    play();
  }, [play]);

  const toggle = useCallback(() => (playing ? pause() : start()), [playing, pause, start]);

  // returning visitor with sound "on": resume on their first interaction (browsers forbid autoplay)
  useEffect(() => {
    if (readPref() !== "on") return;
    const onFirst = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-sound-toggle],[data-intro-enter]")) return; // those handle themselves
      play();
      cleanup();
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
    };
    window.addEventListener("pointerdown", onFirst, { once: true });
    window.addEventListener("keydown", onFirst, { once: true });
    return cleanup;
  }, [play]);

  // pause on hidden tab, resume on return
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        wasPlayingBeforeHide.current = playing;
        if (playing) pause(false);
      } else if (wasPlayingBeforeHide.current && readPref() === "on") {
        gen.current?.ctx.resume();
        play();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [playing, pause, play]);

  return <AudioCtx.Provider value={{ playing, start, toggle }}>{children}</AudioCtx.Provider>;
}

export function SoundToggle({ className = "", floating = false }: { className?: string; floating?: boolean }) {
  const { playing, toggle } = useAmbientAudio();
  return (
    <button
      type="button"
      data-sound-toggle
      onClick={toggle}
      className={`sound-toggle ${floating ? "sound-toggle--floating" : ""} ${playing ? "is-playing" : ""} ${className}`}
      aria-pressed={playing}
      aria-label={playing ? "Mute ambient music" : "Play ambient oud music"}
      title={playing ? "Sound on" : "Sound off"}
    >
      <span className="sound-bars" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
