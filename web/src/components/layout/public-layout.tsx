import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { AttendanceBanner } from "./attendance-banner";

interface PublicLayoutProps {
  children: React.ReactNode;
  isLoggedIn?: boolean;
  userName?: string;
  hasActiveEvent?: boolean;
  openForms?: { id: string; title: string }[];
  attendanceEvent?: {
    name: string;
    deadline: string;
  } | null;
}

export function PublicLayout({
  children,
  isLoggedIn = false,
  userName,
  hasActiveEvent = false,
  openForms = [],
  attendanceEvent = null,
}: PublicLayoutProps) {
  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        userName={userName}
        hasActiveEvent={hasActiveEvent}
        openForms={openForms}
      />
      {isLoggedIn && attendanceEvent && (
        <AttendanceBanner
          eventName={attendanceEvent.name}
          deadline={attendanceEvent.deadline}
        />
      )}
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
