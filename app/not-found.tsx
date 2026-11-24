import Link from "next/link";

export default function NotFound() {
  return (
    <section className="nf">
      <p className="font-ruqaa nf-ar" lang="ar">ضللتَ الطريق</p>
      <h1 className="display nf-title">This path leads <em>nowhere.</em></h1>
      <Link href="/" className="link-line mt-10">Return to the courtyard</Link>
    </section>
  );
}
