// =============================================================
// HoneypotField.tsx
// Invisible spam trap. Real visitors never see or fill it; simple
// bots fill every field, and such messages are dropped by Formspree.
// =============================================================

interface HoneypotFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

export function HoneypotField({ id, value, onChange }: HoneypotFieldProps) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={id}>Website</label>
      <input id={id} tabIndex={-1} autoComplete="off" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
