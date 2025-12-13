import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = ({ setAuthProcess }) => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [isPwVisible, SetIsPwVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEyeClick = () => {
    SetIsPwVisible(!isPwVisible);
  };

  const validateAccount = () => {
    if (!username) {
      setError("Tên tài khoản không được trống.");
      return false;
    }
    if (!email) {
      setError("Email không được trống.");
      return false;
    }
    if (!password) {
      setError("Mật khẩu không được trống.");
      return false;
    }

    let warnings = [];
    if (!/^[a-zA-Z0-9_]{3,15}$/.test(username)) {
      warnings.push(
        "Tên tài khoản chỉ chứa [A-Z], [a-z], [0-9] và ký tự _. Độ dài phải từ 3-15 ký tự."
      );
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      warnings.push("Định dạng email không hợp lệ.");
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/.test(
        password
      )
    ) {
      warnings.push(
        "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số và 1 ký tự đặc biệt. Độ dài phải từ 8-15 ký tự."
      );
    }
    if (password !== passwordAgain) {
      warnings.push("Nhập lại mật khẩu không khớp.");
    }
    if (warnings.length > 0) {
      setError(warnings.join(" "));
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateAccount()) {
      return;
    }

    setLoading(true);
    const result = await register({ username, email, password });
    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4">
      <p className="text-2xl opacity-90">Đăng Ký</p>

      {error && (
        <div className="rounded bg-red-100 p-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <input
        type="text"
        className="w-full border border-gray-300 p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
        placeholder="Tên tài khoản"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
      />
      <input
        type="email"
        className="w-full border border-gray-300 p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
      <div className="relative">
        <input
          type={isPwVisible ? "text" : "password"}
          className="w-full border border-gray-300 p-2 pr-9 focus:outline-none focus:ring-2 focus:ring-sky-400"
          placeholder="Nhập lại mật khẩu"
          value={passwordAgain}
          onChange={(e) => setPasswordAgain(e.target.value)}
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
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 bg-sky-500 py-2 text-white hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-sky-300"
        disabled={loading}
      >
        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
        {loading ? "Đang đăng ký..." : "Đăng ký"}
      </button>
      <div className="flex gap-2">
        <p className="text-gray-600">Bạn đã có tài khoản?</p>
        <div
          onClick={() => setAuthProcess("login")}
          className="flex flex-grow cursor-pointer justify-center rounded-sm border border-gray-300 hover:border-sky-400 hover:text-sky-500"
        >
          <p>Đăng Nhập</p>
        </div>
      </div>
    </form>
  );
};

export default Register;
