import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import RoleSelectionPage from '../pages/RoleSelectionPage';
import ProtectedRoute from '../components/ProtectedRoute';
import ClubLeaderActivitiesPage from '../pages/ClubLeader/ClubLeaderActivitiesPage';
import ClubLeaderDashboardPage from '../pages/ClubLeader/ClubLeaderDashboardPage';
import ClubLeaderInfoPage from '../pages/ClubLeader/ClubLeaderInfoPage';
import ClubLeaderMembersPage from '../pages/ClubLeader/ClubLeaderMembersPage';
import StudentActivitiesPage from '../pages/Student/StudentActivitiesPage';
import StudentMyActivitiesPage from '../pages/Student/StudentMyActivitiesPage';
import StudentClubsPage from '../pages/Student/StudentClubsPage';
import StudentDashboardPage from '../pages/Student/StudentDashboardPage';
import StudentExplorePage from '../pages/Student/StudentExplorePage';
import StudentExploreDetailPage from '../pages/Student/StudentExploreDetailPage';
import StudentBecomeLeaderPage from '../pages/Student/StudentBecomeLeaderPage';
import StudentMembershipRequestsPage from '../pages/Student/StudentMembershipRequestsPage';
import StudentProfilePage from '../pages/Student/StudentProfilePage';

function AppRoutes() {
  return (
    <BrowserRouter>
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
              <StudentDashboardPage />
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
          path="/leader/activities" 
          element={
            <ProtectedRoute requiredRole="clubleader">
              <ClubLeaderActivitiesPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
