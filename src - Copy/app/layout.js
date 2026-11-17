import "./globals.css";

export const metadata = {
  title: "MeowWallet — Save • Plan • Grow ♡",
  description: "Personal Finance & Savings Management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-cream text-dark-brown antialiased">{children}</body>
    </html>
  );
}