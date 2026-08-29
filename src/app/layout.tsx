import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { getProfile } from "@/lib/supabase";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: "Portofolio",
    description:
      "Experienced Frontend Developer portfolio showcasing professional projects, technical skills, work experience.",
    icons: {
      icon: profile?.favicon_url ?? "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@4.9.0/fonts/remixicon.css"
        />
      </head>
      <body className="font-sans antialiased text-[15px] sm:text-base">
        {children}
      </body>
    </html>
  );
}
