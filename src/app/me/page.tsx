import type { Metadata } from "next";
import MyPools from "../../views/MyPools";

export const metadata: Metadata = { title: "My pools" };

export default function Page() {
  return <MyPools />;
}
