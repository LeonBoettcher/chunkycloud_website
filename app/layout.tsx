import { Metadata } from "next";
import "./global.css";
import NavBar from "../components/navbar/navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "ChunkyCloud",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
