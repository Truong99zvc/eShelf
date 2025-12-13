import { useState } from "react";
import Logo from "../components/common/Logo.jsx";
import Login from "../components/auth/Login.jsx";
import Register from "../components/auth/Register.jsx";
import ForgotPassword from "../components/auth/ForgotPassword.jsx";

const LoginRegister = () => {
  const [authProcess, setAuthProcess] = useState("login");
  return (
    <div className="flex h-screen items-center justify-center bg-[url('images/background-login-register.jpg')] bg-cover bg-center">
      <div className="flex w-96 flex-col gap-3 rounded bg-white p-4">
        <Logo />
        {authProcess === "login" ? (
          <Login setAuthProcess={setAuthProcess} />
        ) : authProcess === "register" ? (
          <Register setAuthProcess={setAuthProcess} />
        ) : (
          <ForgotPassword setAuthProcess={setAuthProcess} />
        )}
      </div>
    </div>
  );
};

export default LoginRegister;
