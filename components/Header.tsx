
import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentIcon, PlusIcon } from './IconComponents';

const Header = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <DocumentIcon className="h-8 w-8" />
              <span className="text-xl font-bold">Signature Portal</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link 
              to="/new" 
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              New Request
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
