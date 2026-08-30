import { useId } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

const controlBase =
  "w-full rounded-control border bg-surface px-4 text-body-sm text-fg transition-[border-color,box-shadow] duration-200 " +
  "placeholder:text-fg-subtle focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60";

const controlState = (invalid) =>
  invalid
    ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/15"
    : "border-line-strong hover:border-primary-300 focus:border-accent-600 focus:ring-accent-600/15";

/**
 * Label + control + inline error, wired together for screen readers.
 * `as` selects the control: "input" (default), "textarea" or "select".
 */
export function Field({
  as = "input",
  label,
  error,
  hint,
  optionalLabel,
  required,
  className,
  children,
  id: idProp,
  ...control
}) {
  const reactId = useId();
  const id = idProp ?? `field-${reactId}`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ");

  const controlProps = {
    id,
    required,
    "aria-required": required || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
    className: cn(
      controlBase,
      controlState(Boolean(error)),
      as === "textarea" ? "resize-y py-3" : "h-12",
      as === "select" && "cursor-pointer appearance-none pr-10"
    ),
    ...control,
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-body-sm font-medium text-fg">
        {label}
        {required && (
          <span className="ml-0.5 text-danger-500" aria-hidden="true">
            *
          </span>
        )}
        {optionalLabel && <span className="ml-1 font-normal text-fg-subtle">{optionalLabel}</span>}
      </label>

      {as === "select" ? (
        <div className="relative">
          <select {...controlProps}>{children}</select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle"
            aria-hidden="true"
          />
        </div>
      ) : as === "textarea" ? (
        <textarea {...controlProps} />
      ) : (
        <input {...controlProps} />
      )}

      {hint && !error && (
        <p id={hintId} className="text-caption text-fg-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-caption text-danger-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
