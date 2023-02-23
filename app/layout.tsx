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
      <body className={`${inter.variable} h-screen bg-[#050505] font-sans`}>
        <div className="before:[calc(100vh+3.5rem)] h-screen overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:-top-64 before:bg-grid-pattern before:bg-top before:bg-no-repeat before:opacity-70 ">
          <div className="relative z-10 flex h-screen flex-grow flex-col overflow-clip">
            <div className="absolute bottom-[-6.25vw] flex w-screen select-none items-center justify-center bg-gradient-to-r from-neutral-500 to-white bg-clip-text text-[12.5vw] font-extrabold opacity-5 [-webkit-text-stroke:4px_transparent]">
              always learning
            </div>
            <div className="flex h-full w-full flex-grow items-center justify-center">
              {children}
            </div>
            <Nav />
          </div>
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
