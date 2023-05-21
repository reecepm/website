import "./globals.css";
import React from "react";
import { Inter } from "@next/font/google";
import Nav from "../components/nav";
import { Metadata } from "next";

interface Props {
  children: React.ReactNode;
}

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "block",
  variable: "--font-inter",
  subsets: ["latin"],
});

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </head>
      <body className={`${inter.variable} bg-[#050505] font-sans`}>
        <Nav />
        <div className="pointer-events-none fixed h-screen w-screen overflow-clip">
          <div className="absolute bottom-[-6.25vw] mx-auto w-screen select-none bg-gradient-to-r from-neutral-500 to-white bg-clip-text text-[12.5vw] font-extrabold opacity-5 [-webkit-text-stroke:4px_transparent]">
            always learning
          </div>
        </div>
        <div className="flex min-h-screen w-screen items-center justify-center before:pointer-events-none before:fixed before:inset-0 before:-top-64 before:bg-grid-pattern before:bg-top before:bg-no-repeat before:opacity-70">
          {children}
        </div>
      </body>
    </html>
  );
};

export default Layout;

export const metadata: Metadata = {
  title: {
    default: "Reece Martin",
    template: "%s - Reece Martin",
  },
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    site: "@reece_pm",
    creator: "@reece_pm",
    title: "Reece Martin",
    description:
      "A full stack web, mobile and desktop developer from Bristol United Kingdom.",
  },
};
