import ArrowHeader from "@/components/header/ArrowHeader";

export default function IconHeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ArrowHeader />
      {children}
    </>
  );
}
