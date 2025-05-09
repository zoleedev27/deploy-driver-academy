import { Header } from "./header";
import { Footer } from "./footer";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col text-black dark:text-white">
      <Header />
      <main className="flex-1 w-full mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
