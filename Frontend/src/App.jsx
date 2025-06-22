import { useState, useEffect } from "react";
import RegisterForm from "./components/auth/RegisterForm";
import LoginForm from "./components/auth/LoginForm";
import Dashboard from "./components/dashboard/Dashboard";
import EditProfile from "./components/auth/EditProfile";
import ProjectDetail from "./components/project/ProjectDetail";
import EditProject from "./components/project/EditProject";
import CreateProject from "./components/project/CreateProject";
import FileDetail from "./components/file/FileDetail";
import CreateFile from "./components/file/CreateFile";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import ChangePassword from "./components/auth/ChangePassword";

const App = () => {
  const [page, setPage] = useState("login");
  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectFiles, setProjectFiles] = useState([]);
  const [loadingProjectFiles, setLoadingProjectFiles] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [creatingProject, setCreatingProject] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [creatingFile, setCreatingFile] = useState(false);

  useEffect(() => {
    if (window.location.pathname === "/reset-password") {
      setPage("reset-password");
    }
  }, []);

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

  // Handler for clicking a project in dashboard
  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    setLoadingProjectFiles(true);
    setProjectFiles([]);
    const access = localStorage.getItem("access_token");
    try {
      const res = await fetch(`/api/files/?project=${project.id}`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const files = await res.json();
      setProjectFiles(files);
    } catch (err) {
      setProjectFiles([]);
    }
    setLoadingProjectFiles(false);
    setPage("project-detail");
  };

  // Handler for going back to dashboard from project detail
  const handleBackToDashboard = () => {
    setSelectedProject(null);
    setProjectFiles([]);
    setPage("dashboard");
  };

  // Handler for opening edit project form
  const handleEditProject = () => {
    setEditingProject(selectedProject);
    setPage("edit-project");
  };

  // Handler for saving project changes
  const handleSaveProject = (updatedProject) => {
    // Update dashboardData.projects and selectedProject
    setDashboardData((prev) => {
      if (!prev) return prev;
      const projects = prev.projects.map((p) =>
        p.id === updatedProject.id ? updatedProject : p
      );
      return { ...prev, projects };
    });
    setSelectedProject(updatedProject);
    setEditingProject(null);
    setPage("project-detail");
  };

  // Handler for deleting a project
  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    if (!window.confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    const access = localStorage.getItem("access_token");
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${access}` },
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) {
        alert("Failed to delete project.");
        return;
      }
      // Remove project from dashboardData
      setDashboardData(prev => {
        if (!prev) return prev;
        const projects = prev.projects.filter(p => p.id !== selectedProject.id);
        return { ...prev, projects };
      });
      // Fetch updated files after project deletion
      const filesRes = await fetch("/api/files/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      const files = filesRes.ok ? await filesRes.json() : [];
      setDashboardData(prev => prev ? { ...prev, files } : prev);
      setSelectedProject(null);
      setProjectFiles([]);
      setPage("dashboard");
    } catch (err) {
      alert("Network error while deleting project.");
    }
  };

  // Handler for creating a project
  const handleCreateProject = () => {
    setCreatingProject(true);
    setPage("create-project");
  };

  // Handler for after project is created
  const handleProjectCreated = (newProject) => {
    setDashboardData(prev => {
      if (!prev) return prev;
      return { ...prev, projects: [newProject, ...prev.projects] };
    });
    setCreatingProject(false);
    setPage("dashboard");
  };

  // Handler for clicking a file icon
  const handleFileClick = async (file) => {
    setSelectedFile(null);
    const access = localStorage.getItem("access_token");
    try {
      const res = await fetch(`/api/files/${file.id}/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const fileData = await res.json();
      setSelectedFile(fileData);
      setPage("file-detail");
    } catch (err) {
      setSelectedFile(null);
      alert("Failed to load file details.");
    }
  };

  // Handler for going back from file detail
  const handleBackToProjectOrDashboard = () => {
    setSelectedFile(null);
    if (selectedProject) setPage("project-detail");
    else setPage("dashboard");
  };

  // Handler for creating a file in a project
  const handleCreateFile = () => {
    setCreatingFile(true);
    setPage("create-file");
  };

  // Handler for after file is created
  const handleFileCreated = (newFile) => {
    // Add to projectFiles and dashboardData.files
    setProjectFiles(prev => [newFile, ...prev]);
    setDashboardData(prev => {
      if (!prev) return prev;
      return { ...prev, files: [newFile, ...prev.files] };
    });
    setCreatingFile(false);
    setPage("project-detail");
  };

  // Handler for deleting a file
  const handleDeleteFile = async () => {
    if (!selectedFile) return;
    if (!window.confirm("Are you sure you want to delete this file? This cannot be undone.")) return;
    const access = localStorage.getItem("access_token");
    try {
      const res = await fetch(`/api/files/${selectedFile.id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${access}` },
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) {
        alert("Failed to delete file.");
        return;
      }
      // After deletion, refresh files for dashboard
      const filesRes = await fetch("/api/files/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      const files = filesRes.ok ? await filesRes.json() : [];
      setDashboardData(prev => prev ? { ...prev, files } : prev);
      setSelectedFile(null);
      setPage("dashboard");
    } catch (err) {
      alert("Network error while deleting file.");
    }
  };

  // Handler for opening edit file form
  const handleEditFile = () => {
    setEditingFile(selectedFile);
    setPage("edit-file");
  };

  // Handler for after file is edited
  const handleFileEdited = (updatedFile) => {
    // Update dashboardData.files and projectFiles
    setDashboardData(prev => {
      if (!prev) return prev;
      const files = prev.files.map(f => f.id === updatedFile.id ? updatedFile : f);
      return { ...prev, files };
    });
    setProjectFiles(prev => prev.map(f => f.id === updatedFile.id ? updatedFile : f));
    setSelectedFile(updatedFile);
    setEditingFile(null);
    setPage("file-detail");
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

  if (page === "edit-project" && editingProject) {
    return (
      <EditProject
        project={editingProject}
        onBack={() => setPage("project-detail")}
        onSave={handleSaveProject}
      />
    );
  }

  if (page === "create-project" && creatingProject) {
    return (
      <CreateProject
        onBack={() => { setCreatingProject(false); setPage("dashboard"); }}
        onCreate={handleProjectCreated}
      />
    );
  }

  if (page === "create-file" && creatingFile && selectedProject) {
    return (
      <CreateFile
        onBack={() => { setCreatingFile(false); setPage("project-detail"); }}
        onCreate={handleFileCreated}
        projectId={selectedProject.id}
      />
    );
  }

  if (page === "project-detail" && selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        files={projectFiles}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
        onBack={handleBackToDashboard}
        onCreateFile={handleCreateFile}
        onFileClick={handleFileClick}
      />
    );
  }

  if (page === "file-detail" && selectedFile) {
    return (
      <FileDetail
        file={selectedFile}
        onEdit={handleEditFile}
        onDelete={handleDeleteFile}
        onBack={handleBackToProjectOrDashboard}
      />
    );
  }

  if (page === "change-password") {
    return <ChangePassword onBack={() => setPage("dashboard")} />;
  }

  if (page === "dashboard" && dashboardData) {
    return (
      <Dashboard
        projects={dashboardData.projects}
        files={dashboardData.files}
        onLogout={handleLogout}
        onMenu={() => {}}
        onChangePassword={() => setPage("change-password")}
        onEditProfile={handleEditProfile}
        onCreateProject={handleCreateProject}
        onProjectClick={handleProjectClick}
        onFileClick={handleFileClick}
      />
    );
  }

  if (page === "register") {
    return <RegisterForm onSwitchToLogin={() => setPage("login")} />;
  }

  if (page === "forgot-password") {
    return <ForgotPassword onSwitchToLogin={() => setPage("login")} />;
  }

  if (page === "reset-password") {
    return <ResetPassword onBackToLogin={() => setPage("login")} />;
  }

  // Login page
  return (
    <LoginForm
      onSwitchToRegister={() => setPage("register")}
      onSwitchToForgot={() => setPage("forgot-password")}
      onLoginSuccess={handleLoginSuccess}
      onSwitchToResetPassword={() => setPage("reset-password")}
    />
  );
};

export default App;
