import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const RoleSelectionPage = lazy(() => import('../pages/RoleSelectionPage'));
const ClubLeaderActivitiesPage = lazy(() => import('../pages/ClubLeader/ClubLeaderActivitiesPage'));
const ClubLeaderDashboardPage = lazy(() => import('../pages/ClubLeader/ClubLeaderDashboardPage'));
const ClubLeaderInfoPage = lazy(() => import('../pages/ClubLeader/ClubLeaderInfoPage'));
const ClubLeaderMembersPage = lazy(() => import('../pages/ClubLeader/ClubLeaderMembersPage'));
const ClubLeaderRequestsPage = lazy(() => import('../pages/ClubLeader/ClubLeaderRequestsPage'));
const ClubLeaderReportsPage = lazy(() => import('../pages/ClubLeader/ClubLeaderReportsPage'));
const StudentActivitiesPage = lazy(() => import('../pages/Student/StudentActivitiesPage'));
const StudentMyActivitiesPage = lazy(() => import('../pages/Student/StudentMyActivitiesPage'));
const StudentClubsPage = lazy(() => import('../pages/Student/StudentClubsPage'));
const StudentExplorePage = lazy(() => import('../pages/Student/StudentExplorePage'));
const StudentExploreDetailPage = lazy(() => import('../pages/Student/StudentExploreDetailPage'));
const StudentBecomeLeaderPage = lazy(() => import('../pages/Student/StudentBecomeLeaderPage'));
const StudentMembershipRequestsPage = lazy(() => import('../pages/Student/StudentMembershipRequestsPage'));
const StudentProfilePage = lazy(() => import('../pages/Student/StudentProfilePage'));

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Role Selection Route */}
        <Route 
          path="/select-role" 
          element={
            <ProtectedRoute>
              <RoleSelectionPage />
            </ProtectedRoute>
          } 
        />

        {/* Student Routes - Protected */}
        <Route 
          path="/student" 
          element={
            <ProtectedRoute requiredRole="student">
              <Navigate to="/student/clubs" replace />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/clubs" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentClubsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/explore" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentExplorePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/explore/:clubId" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentExploreDetailPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/activities" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentActivitiesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/my-activities" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentMyActivitiesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/become-leader" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentBecomeLeaderPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/membership-requests" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentMembershipRequestsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/profile" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentProfilePage />
            </ProtectedRoute>
          } 
        />

        {/* Club Leader Routes - Protected */}
        <Route 
          path="/leader" 
          element={
            <ProtectedRoute requiredRole="clubleader">
              <ClubLeaderDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/leader/club-info" 
          element={
            <ProtectedRoute requiredRole="clubleader">
              <ClubLeaderInfoPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/leader/members" 
          element={
            <ProtectedRoute requiredRole="clubleader">
              <ClubLeaderMembersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/leader/requests" 
          element={
            <ProtectedRoute requiredRole="clubleader">
              <ClubLeaderRequestsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/leader/activities" 
          element={
            <ProtectedRoute requiredRole="clubleader">
              <ClubLeaderActivitiesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/leader/reports" 
          element={
            <ProtectedRoute requiredRole="clubleader">
              <ClubLeaderReportsPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
