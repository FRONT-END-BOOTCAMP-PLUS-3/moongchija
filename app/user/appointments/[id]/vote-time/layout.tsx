import ArrowHeader from "@/components/header/ArrowHeader";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ArrowHeader />
      {children}
    </>
  );
};

export default Layout;
