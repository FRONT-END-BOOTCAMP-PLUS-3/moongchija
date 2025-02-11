import { TimeVoteProvider } from "@/context/TimeVoteContext";
import "./globals.css";

export const metadata = {
  title: "Moongchija",
  description: "Meeting Management Service",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>뭉치자</title>
      </head>
      <body>
        <TimeVoteProvider>
          <div className="container">{children}</div>
        </TimeVoteProvider>
      </body>
    </html>
  );
}
