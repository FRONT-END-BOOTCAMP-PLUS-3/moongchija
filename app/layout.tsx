import "./globals.css";

export const metadata = {
  title: "Moongchija",
  description: "React Apps",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
