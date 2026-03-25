import { Outlet } from "react-router-dom";
import Navbar from "@/components/anagram/Navbar";
import Sidebar from "@/components/anagram/Sidebar";

const MainLayout = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <Sidebar />
    <main className="pb-16 pt-14 lg:pb-0 lg:pl-[72px] lg:pt-0 xl:pl-[244px]">
      <Outlet />
    </main>
  </div>
);

export default MainLayout;
