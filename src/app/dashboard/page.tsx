"use client";

import React from 'react';
import Dashboard from '../components/tableau/Dashboard';
import Navbar from '../components/tableau/NavigationBar';

const DashboardPage = () => {
  return (
    <div className="flex">
      {/* Side Navigation Bar */}
      <Navbar />
      {/* Main component on basis of selected navigation from nav bar */}
      <main className="grow">
        <Dashboard />
      </main>
    </div>
  );
};

export default DashboardPage;
