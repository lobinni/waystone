import type { Metadata } from "next";
import Pools from "../../views/Pools";

export const metadata: Metadata = { title: "Pools" };

export default function Page() {
  return <Pools />;
}
