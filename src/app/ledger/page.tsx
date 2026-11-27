import type { Metadata } from "next";
import Ledger from "../../views/Ledger";

export const metadata: Metadata = { title: "Ledger" };

export default function Page() {
  return <Ledger />;
}
