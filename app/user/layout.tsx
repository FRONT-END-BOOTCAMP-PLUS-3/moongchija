import { UserProvider } from "@/context/UserContext";

export default function UserPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
