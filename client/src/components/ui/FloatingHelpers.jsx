import { lazy, Suspense } from "react";
import { DeferUntilIdle } from "./DeferUntilIdle";
import { WhatsAppButton } from "./WhatsAppButton";

/* The assistant carries its own chunk and is never needed on first paint. */
const AIChatWidget = lazy(() =>
  import("./AIChatWidget").then((m) => ({ default: m.AIChatWidget }))
);

/**
 * The two persistent floating actions. Both mount once the browser goes idle,
 * so they cost nothing during the initial render.
 */
export function FloatingHelpers() {
  return (
    <DeferUntilIdle>
      <WhatsAppButton />
      <Suspense fallback={null}>
        <AIChatWidget />
      </Suspense>
    </DeferUntilIdle>
  );
}
