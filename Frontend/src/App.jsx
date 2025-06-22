import { useState } from "react";
import RegisterForm from "./components/auth/RegisterForm";
import LoginForm from "./components/auth/LoginForm";

const App = () => {
  const [page, setPage] = useState("register");

  return page === "register" ? (
    <RegisterForm onSwitchToLogin={() => setPage("login")} />
  ) : (
    <LoginForm onSwitchToRegister={() => setPage("register")} onSwitchToForgot={() => alert("Forgot Password")}/>
  );
};

export default App;
