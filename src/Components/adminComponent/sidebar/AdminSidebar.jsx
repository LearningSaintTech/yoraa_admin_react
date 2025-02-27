import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-50 border-r border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
ADMIN PANNEL        </h1>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-3">
        <ul className="space-y-1">
          {[
            { path: "/adminHome/dashboard", label: "Dashboard" },
            { path: "/adminHome/category", label: "Category" },
            { path: "/adminHome/subcategory", label: "Subcategory" },
            { path: "/adminHome/items", label: "Items" },
            { path: "/adminHome/itemDetails", label: "Item Details" },
            { path: "/adminHome/users", label: "Users" },
            { path: "/adminHome/order", label: "Orders" },
            { path: "/adminHome/notifications", label: "Notifications" },
          ].map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;