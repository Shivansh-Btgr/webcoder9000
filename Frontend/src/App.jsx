import { useState } from "react";
import RegisterForm from "./components/auth/RegisterForm";
import LoginForm from "./components/auth/LoginForm";
import Dashboard from "./components/dashboard/Dashboard";
import EditProfile from "./components/auth/EditProfile";

const App = () => {
  const [page, setPage] = useState("login");
  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);

  // Handler for successful login: fetch dashboard data
  const handleLoginSuccess = async (accessToken) => {
    try {
      const [projectsRes, filesRes] = await Promise.all([
        fetch("/api/projects/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        fetch("/api/files/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);
      if (projectsRes.status === 401 || filesRes.status === 401) {
        // Token invalid, redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setDashboardData(null);
        setPage("login");
        return;
      }
      const projects = await projectsRes.json();
      const files = await filesRes.json();
      setDashboardData({ projects, files });
      setPage("dashboard");
    } catch (err) {
      setDashboardData(null);
      setPage("login");
    }
  };

  // Handler for logout or token invalidation
  const handleLogout = async () => {
    const access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    if (access && refresh) {
      try {
        await fetch("/api/users/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify({ refresh }),
        });
      } catch (err) {
        // Ignore errors, just clear tokens
      }
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setDashboardData(null);
    setPage("login");
  };

  // Handler for Edit Profile button
  const handleEditProfile = async () => {
    const access = localStorage.getItem("access_token");
    if (!access) {
      setPage("login");
      return;
    }
    try {
      const res = await fetch("/api/users/me/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const userData = await res.json();
      setUser(userData);
      setPage("edit-profile");
    } catch (err) {
      setUser(null);
      setPage("dashboard");
    }
  };

  if (page === "edit-profile" && user) {
    return (
      <EditProfile
        user={user}
        onSave={(updatedUser) => {
          setUser(updatedUser);
          setPage("dashboard");
        }}
        onCancel={() => setPage("dashboard")}
      />
    );
  }

  if (page === "dashboard" && dashboardData) {
    return (
      <Dashboard
        projects={dashboardData.projects}
        files={dashboardData.files}
        onLogout={handleLogout}
        onMenu={() => {}}
        onChangePassword={() => alert("Change Password")}
        onEditProfile={handleEditProfile}
        onCreateProject={() => alert("Create Project")}
        onCreateFile={() => alert("Create File")}
      />
    );
  }

  if (page === "register") {
    return <RegisterForm onSwitchToLogin={() => setPage("login")} />;
  }

  // Login page
  return (
    <LoginForm
      onSwitchToRegister={() => setPage("register")}
      onSwitchToForgot={() => alert("Forgot Password")}
      onLoginSuccess={handleLoginSuccess}
    />
  );
};

export default App;
