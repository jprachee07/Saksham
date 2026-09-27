import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import LandingPage from './pages/LandingPage.jsx';
import ExpertLogin from './pages/ExpertLogin.jsx';
import CandidateJoin from './pages/CandidateJoin.jsx';
import ExpertDashboard from './pages/ExpertDashboard.jsx';
import InterviewSetup from './pages/InterviewSetup.jsx';
import SessionCreated from './pages/SessionCreated.jsx';
import ReportView from './pages/ReportView.jsx';
import InterviewRoomExpertPlaceholder from './pages/InterviewRoomExpertPlaceholder.jsx';
import InterviewRoomCandidatePlaceholder from './pages/InterviewRoomCandidatePlaceholder.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="page-wrapper">
        <Navbar />

        <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/expert/login" element={<ExpertLogin />} />
            <Route path="/candidate/join" element={<CandidateJoin />} />

            {/* Protected Expert Assessment Routes */}
            <Route
              path="/expert/dashboard"
              element={
                <ProtectedRoute>
                  <ExpertDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expert/setup"
              element={
                <ProtectedRoute>
                  <InterviewSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expert/session/:sessionId"
              element={
                <ProtectedRoute>
                  <SessionCreated />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expert/report/:sessionId"
              element={
                <ProtectedRoute>
                  <ReportView />
                </ProtectedRoute>
              }
            />

            {/* Person 2 Interview Room Routes (Placeholders / Navigation Integration) */}
            <Route
              path="/interview/expert/:sessionId"
              element={<InterviewRoomExpertPlaceholder />}
            />
            <Route
              path="/interview/candidate/:sessionId"
              element={<InterviewRoomCandidatePlaceholder />}
            />

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
