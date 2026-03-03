import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import Docs from "./pages/Docs";
import Leaderboard from "./pages/Leaderboard";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import DashboardMissions from "./pages/DashboardMissions";
import DashboardLeaderboard from "./pages/DashboardLeaderboard";
import DashboardAchievements from "./pages/DashboardAchievements";
import DashboardProfile from "./pages/DashboardProfile";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Missions from "./pages/Missions";
import Rankings from "./pages/Rankings";
import Community from "./pages/Community";
import Projects from "./pages/Projects";
import ActiveRepo from "./pages/ActiveRepo";
import PullRequests from "./pages/PullRequests";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

<Route path="/active-repo" element={<MainLayout><ActiveRepo /></MainLayout>} />

        <Route
          path="/events"
          element={
            <MainLayout>
              <Events />
            </MainLayout>
          }
        />
        <Route
          path="/docs"
          element={
            <MainLayout>
              <Docs />
            </MainLayout>
          }
        />
        <Route
          path="/missions"
          element={
            <MainLayout>
              <Missions />
            </MainLayout>
          }
        />
        <Route
          path="/rankings"
          element={
            <MainLayout>
              <Rankings />
            </MainLayout>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <MainLayout>
              <Leaderboard />
            </MainLayout>
          }
        />
        <Route
          path="/community"
          element={
            <MainLayout>
              <Community />
            </MainLayout>
          }
        />
        <Route
          path="/my-space"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardLayout />
              </MainLayout>
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="missions" element={<DashboardMissions />} />
          <Route path="leaderboard" element={<DashboardLeaderboard />} />
          <Route path="achievements" element={<DashboardAchievements />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="projects" element={<ProtectedRoute requiredRole="admin"><Projects /></ProtectedRoute>} />
          <Route path="pull-requests" element={<PullRequests />} />
          <Route path="*" element={<DashboardHome />} />
        </Route>
        <Route
          path="/login"
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />
        <Route
          path="/register"
          element={
            <MainLayout>
              <Register />
            </MainLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;