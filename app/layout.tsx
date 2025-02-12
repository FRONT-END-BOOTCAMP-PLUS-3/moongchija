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
        <link rel="manifest" href="/manifest.json" />

        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>뭉치자</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="친구들과 손쉽게 약속을 만들고, 관리하는 서비스"
        />
        <meta
          name="keywords"
          content="약속 관리, 뭉치자, 일정 조율, 모임 관리"
        />
        <meta name="author" content="뭉치자 팀" />
        {/* Open Graph 메타 태그 (페이스북, 카카오, 디스코드 등) */}
        <meta property="og:title" content="뭉치자 - 약속 관리 서비스" />
        <meta
          property="og:description"
          content="쉽고 편리한 약속 관리 서비스! 지금 함께 사용해보세요."
        />
        <meta
          property="og:image"
          content="https://moongchija.vercel.app/og-image.png"
        />
        <meta property="og:url" content="https://moongchija.vercel.app/" />
        <meta property="og:type" content="website" />
        {/* Twitter Card 메타 태그 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="뭉치자 - 약속 관리 서비스" />
        <meta
          name="twitter:description"
          content="쉽고 편리한 약속 관리 서비스! 지금 함께 사용해보세요."
        />
        <meta
          name="twitter:image"
          content="https://moongchija.vercel.app/og-image.png"
        />
      </head>
      <body>
        <TimeVoteProvider>
          <div className="container">{children}</div>
        </TimeVoteProvider>
      </body>
    </html>
  );
}
