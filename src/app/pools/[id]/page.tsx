import type { Metadata } from "next";
import { Suspense } from "react";
import PoolDetail from "../../../views/PoolDetail";
import { PageLoader } from "../../../components/Spinner";

export const metadata: Metadata = { title: "Pool" };

export default function Page() {
  return (
    <Suspense fallback={<PageLoader label="Loading the pool…" />}>
      <PoolDetail />
    </Suspense>
  );
}
