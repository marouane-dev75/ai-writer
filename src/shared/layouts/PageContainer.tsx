import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const PageContainer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
