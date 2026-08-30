import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../utils/cn";

/** Shimmering placeholder. Always give it an explicit height/width. */
export function Skeleton({ className, ...rest }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-primary-100/70 dark:bg-white/8", className)}
      {...rest}
    />
  );
}

/**
 * Shown when a request fails. Never surfaces the raw error to the visitor —
 * `detail` is for a short, human sentence only.
 */
export function ErrorState({ title, description, onRetry, retryLabel = "Try again", className }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 rounded-card border border-line bg-surface px-6 py-12 text-center",
        className
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-danger-50 text-danger-600 dark:bg-danger-500/12">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="text-h4 text-fg">{title}</h3>
      {description && <p className="max-w-sm text-body-sm text-fg-muted">{description}</p>}
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-1">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

/** Shown when a collection is legitimately empty. */
export function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-card border border-dashed border-line-strong bg-surface-2 px-6 py-12 text-center",
        className
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-500 dark:bg-white/8 dark:text-primary-200">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="text-h4 text-fg">{title}</h3>
      {description && <p className="max-w-sm text-body-sm text-fg-muted">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
