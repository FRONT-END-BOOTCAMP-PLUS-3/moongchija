import { CreateAppointmentProvider } from "@/context/CreateAppointmentContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CreateAppointmentProvider>{children}</CreateAppointmentProvider>;
}
