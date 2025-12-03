import { Outlet } from "react-router";
import { Navbar } from "./Navbar";

export const PageContainer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <Outlet />
      </main>
      <footer className="bg-gray-800 dark:bg-gray-950 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-300">
            Built with React, TypeScript, Tailwind CSS, and Tauri
          </p>
        </div>
      </footer>
    </div>
  );
};
