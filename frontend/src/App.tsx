import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import CandidateDirectory from './pages/CandidateDirectory';
import CandidateProfile from './pages/CandidateProfile';
import NewScreening from './pages/NewScreening';
import AssessmentHistory from './pages/AssessmentHistory';
import PlacementRules from './pages/PlacementRules';
import About from './pages/About';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/candidates" element={<CandidateDirectory />} />
        <Route path="/candidates/:id" element={<CandidateProfile />} />
        <Route path="/screening" element={<NewScreening />} />
        <Route path="/screening/:candidateId" element={<NewScreening />} />
        <Route path="/history" element={<AssessmentHistory />} />
        <Route path="/history/:assessmentId" element={<AssessmentHistory />} />
        <Route path="/rules" element={<PlacementRules />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
