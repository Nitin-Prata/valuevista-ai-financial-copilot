import "../styles/globals.css";

export const metadata = {
  title: "ValueVista - AI Financial Copilot",
  description: "Understand real-world money value with PPP insights.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
