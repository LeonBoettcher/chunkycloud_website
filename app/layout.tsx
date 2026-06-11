import { Metadata } from "next";
import { cookies } from "next/headers";
import Footer from "../components/Footer";
import NavBar from "../components/navbar/navbar";
import SessionProvider from "./auth/components/SessionProvider";
import "./global.css";

export const metadata: Metadata = {
  title: "ChunkyCloud",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  return (
    <html lang="en" data-theme="dark">
      <body className="flex flex-col min-h-screen">
        <SessionProvider
          initialAccessToken={cookieStore.get("access_token")?.value}
        >
          <NavBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
