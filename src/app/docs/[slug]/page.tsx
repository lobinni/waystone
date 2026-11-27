import type { Metadata } from "next";
import { Suspense } from "react";
import Docs from "../../../views/Docs";
import { PageLoader } from "../../../components/Spinner";

export const metadata: Metadata = { title: "Documentation" };

export default function Page() {
  return (
    <Suspense fallback={<PageLoader label="Loading the page…" />}>
      <Docs />
    </Suspense>
  );
}
