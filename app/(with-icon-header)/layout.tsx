import IconHeader from "@/components/header/IconHeader";

export default function IconHeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <IconHeader />
      {children}
    </>
  );
}
