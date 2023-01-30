import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "@next/font/google";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "block",
  variable: "--font-inter",
});

const Reece = ({ Component, pageProps, router }: AppProps) => {
  return (
    <main className={`${inter.variable} font-sans bg-[#050505] h-screen`}>
      <Layout>
        <AnimatePresence mode="wait">
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </Layout>
    </main>
  );
};

export default Reece;
