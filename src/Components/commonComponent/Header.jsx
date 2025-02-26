import React from "react";
import { useSelector } from "react-redux";
import { useLogout } from "../../Components/authComponent/Logout";

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const handleLogout = useLogout();

  if (!user) return null;

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-950 text-white shadow-lg z-50">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a
          href="/"
          className="text-2xl font-bold tracking-tight hover:text-indigo-400 transition-colors duration-200"
        >
          YORA
        </a>

        {/* Nav Links */}
        <ul className="flex items-center gap-8">
          <li>
            <a
              href="/profile"
              className="text-sm font-medium text-gray-200 hover:text-indigo-400 transition-colors duration-200"
            >
              Profile
            </a>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-950 transition-colors duration-200"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;