import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ClubLeaderActivitiesPage from '../pages/ClubLeader/ClubLeaderActivitiesPage';
import ClubLeaderDashboardPage from '../pages/ClubLeader/ClubLeaderDashboardPage';
import ClubLeaderFinancePage from '../pages/ClubLeader/ClubLeaderFinancePage';
import ClubLeaderInfoPage from '../pages/ClubLeader/ClubLeaderInfoPage';
import ClubLeaderMembersPage from '../pages/ClubLeader/ClubLeaderMembersPage';
import ClubLeaderReportsPage from '../pages/ClubLeader/ClubLeaderReportsPage';
import ClubDetailPage from '../pages/Student/ClubDetailPage';
import StudentActivitiesPage from '../pages/Student/StudentActivitiesPage';
import StudentMyActivitiesPage from '../pages/Student/StudentMyActivitiesPage';
import StudentClubsPage from '../pages/Student/StudentClubsPage';
import StudentDashboardPage from '../pages/Student/StudentDashboardPage';
import StudentExplorePage from '../pages/Student/StudentExplorePage';
import StudentFeesPage from '../pages/Student/StudentFeesPage';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/student" element={<StudentDashboardPage />} />
        <Route path="/student/clubs" element={<StudentClubsPage />} />
        <Route path="/student/explore" element={<StudentExplorePage />} />
        <Route path="/student/activities" element={<StudentActivitiesPage />} />
        <Route path="/student/my-activities" element={<StudentMyActivitiesPage />} />
        <Route path="/student/fees" element={<StudentFeesPage />} />
        <Route path="/student/clubs/:clubId" element={<ClubDetailPage />} />
        <Route path="/leader" element={<ClubLeaderDashboardPage />} />
        <Route path="/leader/club-info" element={<ClubLeaderInfoPage />} />
        <Route path="/leader/members" element={<ClubLeaderMembersPage />} />
        <Route path="/leader/activities" element={<ClubLeaderActivitiesPage />} />
        <Route path="/leader/finance" element={<ClubLeaderFinancePage />} />
        <Route path="/leader/reports" element={<ClubLeaderReportsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
