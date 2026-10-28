import type { MomentId } from "@/lib/schedule";
import { MomentIcon } from "../Icons";

/** Seletor de horário de um momento: ícone fino, nome e campo de hora. */
export function TimeRow({
  moment,
  label,
  value,
  onChange,
  invalid,
}: {
  moment: MomentId;
  label: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  return (
    <label className="row" htmlFor={`t-${moment}`}>
      <span className="row-icon" aria-hidden="true">
        <MomentIcon moment={moment} />
      </span>
      <span className="row-main row-title">{label}</span>
      <input id={`t-${moment}`} name={moment} type="time" step={60} required value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid || undefined} />
    </label>
  );
}
