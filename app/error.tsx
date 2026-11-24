"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="nf">
      <h1 className="display nf-title">Something went <em>astray.</em></h1>
      <p className="mt-6 opacity-80">Please try again, or call us to book.</p>
      <button onClick={reset} className="btn-arch mt-10">Try again</button>
    </section>
  );
}
