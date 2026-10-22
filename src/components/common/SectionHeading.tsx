import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">{eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl leading-[1.05] md:text-5xl">{title}</h2>
      </div>
      {href && linkLabel && (
        <a
          href={href}
          className="group text-sm font-medium underline decoration-line underline-offset-4 transition-colors hover:text-accent"
        >
          {linkLabel}
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1"> →</span>
        </a>
      )}
    </Reveal>
  );
}
