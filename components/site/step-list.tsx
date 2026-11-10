/** Numbered steps for processes (loan application, new connection, membership…). */
export function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="grid gap-3">
      {steps.map((step, i) => (
        <li
          key={i}
          className="flex items-center gap-4 rounded-xl border bg-card p-4"
        >
          <span
            aria-hidden="true"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-lg font-bold text-primary-foreground"
          >
            {i + 1}
          </span>
          <span className="text-lg">
            <span className="sr-only">{i + 1}. </span>
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}
