"use client";
/* eslint-disable @next/next/no-sync-scripts */
import "./globals.css";
import { Inter } from "next/font/google";
import "@fortawesome/fontawesome-free/css/all.min.css";
import store from "../app/redux/store.js";
import { Provider } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import { CookiesProvider } from "react-cookie";
import { QueryClientProvider, QueryClient } from "react-query";

import InnerLayout from "../app/innerLayout";
import Fallback from "app/components/fallback/fallback";
import { AuthDataProvider } from "../context/authContext";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  /* Error Boundary Callback */
  const logError = (error, info) => {
    console.log("error: ", error);
    console.log("info: ", info);
  };

  return (
    <html lang="en">
      <head>
        <title id="app-title">Centra Remakes</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css"
        />
      </head>
      <body className={`${inter.className} overflow-y-hidden`}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <ErrorBoundary FallbackComponent={Fallback} onError={logError}>
              <CookiesProvider>
                <AuthDataProvider>
                  <InnerLayout>{children}</InnerLayout>
                </AuthDataProvider>
              </CookiesProvider>
            </ErrorBoundary>
          </Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
