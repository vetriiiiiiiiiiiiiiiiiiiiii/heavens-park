"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { bookingConfig, occasions, type Seating } from "@/content/restaurant";

type R = { id: string; ref: string; name: string; phone: string; email: string | null; date: string; time: string; guests: number; seating: string; occasion: string | null; notes: string | null; status: string; createdAt: string };
type E = { id: string; name: string; phone: string; email: string | null; eventType: string; date: string | null; guests: number | null; message: string | null; status: string; createdAt: string };

const STATUSES = ["confirmed", "seated", "completed", "cancelled", "no_show"];

export function AdminLogin() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="admin-login admin">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setErr("");
          const r = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: pw }) });
          if (r.ok) router.refresh();
          else setErr((await r.json()).error || "Error");
        }}
      >
        <p className="eyebrow">Heavens Park · Staff</p>
        <h1 className="display text-5xl">Sign in</h1>
        <div className="field">
          <label htmlFor="pw">Password</label>
          <input id="pw" type="password" autoComplete="current-password" required value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>
        <button className="btn-arch justify-center">Enter</button>
        <p className="form-msg is-err" role="alert">{err}</p>
      </form>
    </div>
  );
}

export function AdminDashboard({ today }: { today: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<"bookings" | "enquiries">("bookings");
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [q, setQ] = useState("");
  const [seat, setSeat] = useState("");
  const [items, setItems] = useState<R[]>([]);
  const [enq, setEnq] = useState<{ items: E[]; subscribers: number }>({ items: [], subscribers: 0 });
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams(q ? { q } : { from, to });
    const r = await fetch(`/api/admin/reservations?${p}`);
    if (r.status === 401) return router.refresh();
    setItems((await r.json()).items || []);
    setLoading(false);
  }, [from, to, q, router]);

  const loadEnq = useCallback(async () => {
    const r = await fetch("/api/admin/enquiries");
    if (r.ok) setEnq(await r.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    loadEnq();
    const t = setInterval(() => {
      load();
      loadEnq();
    }, 60_000);
    return () => clearInterval(t);
  }, [load, loadEnq]);

  const shown = useMemo(() => items.filter((i) => !seat || i.seating === seat), [items, seat]);
  const active = shown.filter((i) => i.status !== "cancelled" && i.status !== "no_show");
  const covers = active.reduce((a, b) => a + b.guests, 0);

  async function setStatus(ref: string, status: string) {
    if (status === "cancelled" && !confirm(`Cancel ${ref}? The guest will be notified if messaging is configured.`)) return load();
    await fetch("/api/admin/reservations", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ ref, status }) });
    load();
  }

  function exportCsv() {
    const head = ["ref", "date", "time", "guests", "seating", "name", "phone", "email", "occasion", "notes", "status"];
    const rows = shown.map((r) => head.map((h) => `"${String((r as unknown as Record<string, unknown>)[h] ?? "").replace(/"/g, '""')}"`).join(","));
    const url = URL.createObjectURL(new Blob([[head.join(","), ...rows].join("\n")], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `bookings-${from}-${to}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  }

  const occ = (id: string | null) => occasions.find((o) => o.id === id)?.label.en || "";

  return (
    <div className="admin">
      <div className="admin-top">
        <div>
          <p className="eyebrow">Heavens Park · Staff</p>
          <h1 className="display text-4xl mt-1">Reservations desk</h1>
        </div>
        <div className="admin-tabs">
          <button className={tab === "bookings" ? "is-on" : ""} onClick={() => setTab("bookings")}>Bookings</button>
          <button className={tab === "enquiries" ? "is-on" : ""} onClick={() => setTab("enquiries")}>
            Enquiries {enq.items.filter((e) => e.status === "new").length ? `(${enq.items.filter((e) => e.status === "new").length})` : ""}
          </button>
          <button
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              router.refresh();
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {tab === "bookings" ? (
        <>
          <div className="admin-bar">
            <label>From <input type="date" value={from} onChange={(e) => { setFrom(e.target.value); if (e.target.value > to) setTo(e.target.value); }} /></label>
            <label>To <input type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} /></label>
            <select value={seat} onChange={(e) => setSeat(e.target.value)} aria-label="Seating filter">
              <option value="">All seating</option>
              {Object.entries(bookingConfig.seating).map(([k, v]) => (
                <option key={k} value={k}>{v.label.en}</option>
              ))}
            </select>
            <input type="search" placeholder="Search ref, name, phone" value={q} onChange={(e) => setQ(e.target.value)} />
            <button className="link-line" onClick={load}>Refresh</button>
            <button className="link-line" onClick={exportCsv}>Export CSV</button>
          </div>
          <div className="admin-stats">
            <div><b>{active.length}</b><span>Bookings</span></div>
            <div><b>{covers}</b><span>Covers</span></div>
            {(Object.keys(bookingConfig.seating) as Seating[]).map((s) => (
              <div key={s}>
                <b>{active.filter((a) => a.seating === s).reduce((x, y) => x + (bookingConfig.seating[s].unit === "rooms" ? 1 : y.guests), 0)}</b>
                <span>{bookingConfig.seating[s].label.en} ({bookingConfig.seating[s].unit})</span>
              </div>
            ))}
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Date</th><th>Time</th><th>Ref</th><th>Guest</th><th>Pax</th><th>Seating</th><th>Notes</th><th>Status</th></tr>
              </thead>
              <tbody>
                {shown.length === 0 && (
                  <tr><td colSpan={8} className="opacity-60">{loading ? "Loading…" : "No bookings for this selection."}</td></tr>
                )}
                {shown.map((r) => (
                  <tr key={r.id} className={r.status === "cancelled" ? "is-cancelled" : ""}>
                    <td>{r.date}</td>
                    <td><b>{r.time}</b></td>
                    <td className="text-gold">{r.ref}</td>
                    <td>
                      {r.name}
                      <br />
                      <a href={`tel:${r.phone}`} className="opacity-70">{r.phone}</a>{" "}
                      <a href={`https://wa.me/${r.phone.replace("+", "")}`} target="_blank" rel="noopener" className="text-gold text-xs">WA</a>
                      {r.email && <><br /><span className="opacity-60 text-xs">{r.email}</span></>}
                    </td>
                    <td>{r.guests}</td>
                    <td>{bookingConfig.seating[r.seating as Seating]?.label.en || r.seating}</td>
                    <td className="max-w-[260px] text-sm">
                      {occ(r.occasion) && <span className="text-gold">{occ(r.occasion)}. </span>}
                      {r.notes}
                    </td>
                    <td>
                      <select value={r.status} onChange={(e) => setStatus(r.ref, e.target.value)} aria-label={`Status for ${r.ref}`}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", "-")}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="admin-stats mt-6">
            <div><b>{enq.items.length}</b><span>Enquiries</span></div>
            <div><b>{enq.subscribers}</b><span>Newsletter subscribers</span></div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Received</th><th>Name</th><th>Event</th><th>Date</th><th>Guests</th><th>Message</th><th>Status</th></tr></thead>
              <tbody>
                {enq.items.length === 0 && <tr><td colSpan={7} className="opacity-60">No enquiries yet.</td></tr>}
                {enq.items.map((e) => (
                  <tr key={e.id}>
                    <td className="text-sm">{new Date(e.createdAt).toLocaleString()}</td>
                    <td>{e.name}<br /><a href={`tel:${e.phone}`} className="opacity-70">{e.phone}</a>{e.email && <><br /><span className="opacity-60 text-xs">{e.email}</span></>}</td>
                    <td>{e.eventType}</td>
                    <td>{e.date || "—"}</td>
                    <td>{e.guests ?? "—"}</td>
                    <td className="max-w-[320px] text-sm">{e.message}</td>
                    <td>
                      <select
                        value={e.status}
                        onChange={async (ev) => {
                          await fetch("/api/admin/enquiries", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: e.id, status: ev.target.value }) });
                          loadEnq();
                        }}
                      >
                        {["new", "contacted", "closed"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
