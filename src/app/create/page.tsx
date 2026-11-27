import type { Metadata } from "next";
import Create from "../../views/Create";

export const metadata: Metadata = { title: "Create a pool" };

export default function Page() {
  return <Create />;
}
