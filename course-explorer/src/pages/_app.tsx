import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { api } from "~/utils/api";

import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../utils/theme";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          font-family: var(--font-inter);
        }
      `}</style>
      <ClerkProvider {...pageProps}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
