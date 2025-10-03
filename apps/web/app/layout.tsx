import type { ReactNode } from "react";
import "./globals.css";
import Providers from "./providers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const ogImage = process.env.NEXT_PUBLIC_OG_IMAGE || "";

export const metadata = {
  title: "OmniAgents",
  description: "AI agents for voice, chat, SMS",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "OmniAgents",
    description: "AI agents for voice, chat, SMS",
    type: "website",
    images: ogImage ? [ogImage] : undefined
  },
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const phKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || "";
  const phHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
  const statusUrl = process.env.NEXT_PUBLIC_STATUS_URL || "";
  const clerkPk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const inline = `
    (function(){
      try {
        window.__PH_API_KEY = ${JSON.stringify(phKey)};
        window.__PH_HOST = ${JSON.stringify(phHost)};
        if (${JSON.stringify(ogImage)}) window.__OG_IMAGE = ${JSON.stringify(ogImage)};
        if (${JSON.stringify(statusUrl)}) window.__STATUS_URL = ${JSON.stringify(statusUrl)};
      } catch(_) {}
    })();
  `;

  const content = (
    <>
      {children}
    </>
  );

  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: inline }} />
      </head>
      <body>
        <Providers>{content}</Providers>
      </body>
    </html>
  );
}
