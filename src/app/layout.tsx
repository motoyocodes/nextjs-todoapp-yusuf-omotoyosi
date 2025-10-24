import "./globals.css";
import QueryProvider from "./providers/QueryProvider";

export const metadata = {
  title: "My Next App",
  description: "Example with TanStack Query",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
