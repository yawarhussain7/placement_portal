import React from 'react';
import { FiSearch, FiBell } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="flex items-center justify-between px-8 py-5 bg-white shadow-md shadow-gray-200/50 rounded-b-1xl">
      
      {/* LEFT SECTION */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Dashboard
        </h2>
        <p className="text-xs font-medium text-gray-400 mt-0.5">
          Welcome back, Admin — here's what's happening today
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">

        {/* SEARCH */}
        <div className="relative w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FiSearch className="w-4 h-4" />
          </span>

          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-50 pl-9 pr-4 py-2 rounded-xl text-sm text-gray-800 placeholder-gray-400
            border border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white
            shadow-sm transition-all"
          />
        </div>

        {/* NOTIFICATION */}
        <button className="relative p-2.5 bg-gray-50 rounded-full text-gray-500 hover:text-gray-900 hover:shadow-md transition-all">
          <FiBell className="w-5 h-5" />

          {/* DOT */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></span>
        </button>

      </div>
    </header>
  );
};

export default Header;