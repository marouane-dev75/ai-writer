import { Link, useLocation } from "react-router";
import { DarkModeToggle } from "../components";
import { useTheme } from "../theme";

export const Navbar = () => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Editor
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              A Tauri-powered application
            </p>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                isActive("/")
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Home
            </Link>
            <Link
              to="/settings"
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                isActive("/settings")
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Settings
            </Link>
            <DarkModeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </nav>
        </div>
      </div>
    </header>
  );
};
