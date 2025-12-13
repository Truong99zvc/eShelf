import { useState } from "react";
import { Loader2 } from "lucide-react";
import { authService } from "../../services";

const ForgotPassword = ({ setAuthProcess }) => {
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        setSuccess("Đã gửi mã xác thực đến email của bạn");
        setStep(2);
        // In development, token is returned directly
        if (response.resetToken) {
          setResetToken(response.resetToken);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    }
    setLoading(false);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");

    if (!resetToken) {
      setError("Vui lòng nhập mã xác thực");
      return;
    }

    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
    if (!passwordRegex.test(newPassword)) {
      setError("Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt. Độ dài từ 8-15 ký tự.");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.resetPassword(resetToken, newPassword);
      if (response.success) {
        setSuccess("Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập...");
        setTimeout(() => {
          setAuthProcess("login");
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {step === 1 && (
        <form onSubmit={handleSendEmail} className="flex flex-col gap-4">
          <p className="text-xl opacity-90">Nhập email để nhận mã xác thực</p>

          {error && (
            <div className="rounded bg-red-100 p-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <input
            type="email"
            className="w-full border border-gray-300 p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-sky-500 py-2 text-white hover:bg-sky-400 disabled:bg-sky-300"
            disabled={loading}
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
          <p className="text-center text-xl opacity-90">
            Vui lòng nhập mã xác thực
          </p>

          {success && (
            <div className="rounded bg-green-100 p-2 text-sm text-green-600">
              {success}
            </div>
          )}

          {error && (
            <div className="rounded bg-red-100 p-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <input
            type="text"
            className="w-full border border-gray-300 p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Mã xác thực"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-sky-500 py-2 text-white hover:bg-sky-400"
          >
            Tiếp tục
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <p className="text-xl opacity-90">Nhập mật khẩu mới</p>

          {success && (
            <div className="rounded bg-green-100 p-2 text-sm text-green-600">
              {success}
            </div>
          )}

          {error && (
            <div className="rounded bg-red-100 p-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <input
            type="password"
            className="w-full border border-gray-300 p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            className="w-full border border-gray-300 p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-sky-500 py-2 text-white hover:bg-sky-400 disabled:bg-sky-300"
            disabled={loading}
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </button>
        </form>
      )}

      <div className="flex gap-2">
        <p className="text-gray-600">Quay lại</p>
        <div
          onClick={() => setAuthProcess("login")}
          className="flex flex-grow cursor-pointer justify-center rounded-sm border border-gray-300 hover:border-sky-400 hover:text-sky-500"
        >
          <p>Đăng Nhập</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
