import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
//import RiskPage from './pages/Risk';
//import ScoringPage from './pages/Scoring';
//import IncomePage from './pages/Income';
//import IdentityPage from './pages/Identity';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
    );
};

export default App;
