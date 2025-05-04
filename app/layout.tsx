import { Metadata } from "next";
import "./global.css";
import NavBar from "../components/navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "ChunkyCloud",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
