import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: "TimeTracker Pro",
  description: "Professional time tracking application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: "#f9fafb",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
      }}>
        <AuthProvider>
          <Header />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}