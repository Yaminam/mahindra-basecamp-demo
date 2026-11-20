import { Suspense, lazy } from "react";

const Configurator = lazy(() => import("../components/Configurator"));

export default function Build() {
  return (
    <div className="px-3 pt-3 sm:px-4">
      <Suspense fallback={<div className="h-[calc(100dvh-6rem)] animate-pulse rounded-[28px] bg-slab" />}>
        <div className="overflow-hidden rounded-[28px]">
          <Configurator full />
        </div>
      </Suspense>
    </div>
  );
}
