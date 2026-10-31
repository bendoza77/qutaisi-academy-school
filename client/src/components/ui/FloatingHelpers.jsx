import { lazy, Suspense } from "react";
import { DeferUntilIdle } from "./DeferUntilIdle";
import { WebiEdgeTab } from "./WebiCredit";
import { WhatsAppButton } from "./WhatsAppButton";

/* The assistant carries its own chunk and is never needed on first paint. */
const AIChatWidget = lazy(() =>
  import("./AIChatWidget").then((m) => ({ default: m.AIChatWidget }))
);

/**
 * The persistent floating elements. All of them mount once the browser goes
 * idle, so they cost nothing during the initial render.
 */
export function FloatingHelpers() {
  return (
    <DeferUntilIdle>
      <WebiEdgeTab />
      <WhatsAppButton />
      <Suspense fallback={null}>
        <AIChatWidget />
      </Suspense>
    </DeferUntilIdle>
  );
}
