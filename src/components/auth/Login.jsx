import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = (props) => {
  const { setAuthProcess } = props;
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isPwVisible, SetIsPwVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEyeClick = () => {
    SetIsPwVisible(!isPwVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    const result = await login({ username, password });
    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <p className="text-2xl opacity-90">Đăng Nhập</p>

      {error && (
        <div className="rounded bg-red-100 p-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <input
        type="text"
        className="w-full border border-gray-300 p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
        placeholder="Tên tài khoản hoặc email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
      />
      <div className="relative">
        <input
          type={isPwVisible ? "text" : "password"}
          className="w-full border border-gray-300 p-2 pr-9 focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        {isPwVisible ? (
          <Eye
            className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer text-gray-800"
            onClick={handleEyeClick}
          />
        ) : (
          <EyeOff
            className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer text-gray-500"
            onClick={handleEyeClick}
          />
        )}
      </div>
      <Link
        className="w-32 text-sm text-gray-600 underline hover:text-sky-500"
        onClick={() => setAuthProcess("forgot-password")}
        to="#"
      >
        Quên mật khẩu?
      </Link>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 bg-sky-500 py-2 text-white hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-sky-300"
        disabled={loading}
      >
        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
      <div className="flex gap-2">
        <p className="text-gray-600">Bạn chưa có tài khoản?</p>
        <div
          onClick={() => setAuthProcess("register")}
          className="flex flex-grow cursor-pointer justify-center rounded-sm border border-gray-300 hover:border-sky-400 hover:text-sky-500"
        >
          <p>Đăng Ký</p>
        </div>
      </div>
    </form>
  );
};

export default Login;
