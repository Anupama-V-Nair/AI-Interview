// frontend/src/pages/Dashboard.js
import React from 'react';
import MetricsGrid from '../components/MetricsGrid';
import PrepHub from '../components/PrepHub';


const Dashboard = () => {
  return (
        <div className="lg:col-span-1">
          <PrepHub />
        </div>
  );
};

export default Dashboard;