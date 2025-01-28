import ArrowHeader from "@/components/header/ArrowHeader";

export default function ArrowHeaderLayout({
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
