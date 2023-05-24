import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { api } from "~/utils/api";
import { dark } from "@clerk/themes";

import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <>
      <ClerkProvider {...pageProps}>
        <main className={`${inter.variable} font-inter`}>
          <Component {...pageProps} />
          <ToastProvider />
        </main>
      </ClerkProvider>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
    </>
  );
};

export default api.withTRPC(MyApp);
