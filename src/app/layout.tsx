import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Shell from "../components/Layout";
import "./globals.css";

const THEME_BOOT = `(function(){try{var t=localStorage.getItem("waystone.theme");if(t!=="light"&&t!=="dim"){t=(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)?"dim":"light";}var e=document.documentElement;e.setAttribute("data-theme",t);e.style.colorScheme=t==="dim"?"dark":"light";}catch(e){}})();`;

export const metadata: Metadata = {
  title: {
    default: "Waystone — commitment pools judged by an AI brake",
    template: "%s · Waystone",
  },
  description:
    "Waystone is an intelligent contract where a group stakes on keeping a promise, round after round. An AI judge reads the evidence and can only be as generous as the pool allows.",
  openGraph: {
    title: "Waystone — commitment pools judged by an AI brake",
    description: "Stake on your word. Let the evidence decide.",
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f3f5f0",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
