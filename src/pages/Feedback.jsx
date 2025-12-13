import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { feedbackService } from "../services";

const Feedback = () => {
  const [errorType, setErrorType] = useState("book");
  const [errorSubType, setErrorSubType] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    
    if (!content.trim()) {
      setError("Vui lòng nhập nội dung chi tiết.");
      return;
    }

    const confirmed = confirm("Bạn có chắc chắn muốn gửi phản hồi?");
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await feedbackService.submitFeedback({
        errorType,
        errorSubType,
        content,
      });

      if (response.success) {
        setSuccess(true);
        setContent("");
        setErrorType("book");
        setErrorSubType("");
        
        // Reset success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    }
    setLoading(false);
  };

  const getSubTypeOptions = () => {
    switch (errorType) {
      case "book":
        return [
          { value: "not_viewable", label: "Sách không xem được" },
          { value: "wrong_format", label: "Sách sai định dạng" },
          { value: "wrong_description", label: "Không đúng với lời giới thiệu" },
          { value: "inappropriate", label: "Nội dung không phù hợp" },
          { value: "other", label: "Khác" },
        ];
      case "account":
        return [
          { value: "locked", label: "Tài khoản bị khoá" },
          { value: "data_loss", label: "Mất dữ liệu cá nhân" },
          { value: "other", label: "Khác" },
        ];
      case "donate":
        return [
          { value: "wrong_amount", label: "Thanh toán không đúng số tiền" },
          { value: "not_recognized", label: "Chưa được hệ thống công nhận" },
          { value: "other", label: "Khác" },
        ];
      default:
        return [];
    }
  };

  return (
    <>
      <div className="mx-4 my-12 flex flex-col justify-center gap-4 rounded border-2 border-sky-400 p-4 text-gray-800 md:mx-20">
        <p className="text-center text-2xl font-semibold text-sky-400 md:text-3xl">
          GỬI PHẢN HỒI CHO CHÚNG TÔI
        </p>

        {success && (
          <div className="flex items-center gap-2 rounded bg-green-100 p-3 text-green-700">
            <CheckCircle size={20} />
            <span>Đã gửi phản hồi thành công. Cảm ơn bạn!</span>
          </div>
        )}

        {error && (
          <div className="rounded bg-red-100 p-3 text-red-600">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 md:flex-row">
          <label className="w-full px-4 py-2 text-left md:w-44 md:text-right">
            Loại lỗi:
          </label>
          <select
            value={errorType}
            onChange={(e) => {
              setErrorType(e.target.value);
              setErrorSubType("");
            }}
            className="w-full rounded-sm border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-sky-400 md:mr-4 md:w-[28rem]"
            disabled={loading}
          >
            <option value="book">Lỗi sách</option>
            <option value="account">Lỗi tài khoản</option>
            <option value="donate">Lỗi donate - ủng hộ</option>
            <option value="other">Khác</option>
          </select>

          {errorType !== "other" && (
            <select
              value={errorSubType}
              onChange={(e) => setErrorSubType(e.target.value)}
              className="w-full rounded-sm border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-sky-400 md:w-[28rem]"
              disabled={loading}
            >
              <option value="">Chọn loại cụ thể...</option>
              {getSubTypeOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <label className="w-full px-4 py-2 text-left md:w-44 md:text-right">
            <span className="text-red-600">* </span>Nội dung chi tiết:
          </label>
          <textarea
            className="h-36 w-full rounded-sm border border-gray-400 p-2 focus:outline-none focus:ring-2 focus:ring-sky-400 md:w-[56.75rem]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
          />
        </div>

        <button
          className="flex w-24 items-center justify-center gap-2 self-center rounded bg-teal-500 py-2 text-xl text-white hover:bg-teal-400 disabled:cursor-not-allowed disabled:bg-teal-300"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          {loading ? "..." : "Gửi"}
        </button>
      </div>

      <div className="mx-4 mb-5 leading-8 text-gray-800 md:mx-20">
        <p className="text-bold text-xl">Thông tin liên hệ:</p>
        <p>
          <span className="text-gray-500">Địa chỉ:</span> Toà nhà Chọc Trời,
          TP.HCM, Việt Nam
        </p>
        <p>
          <span className="text-gray-500">Số điện thoại:</span> 0123456789
        </p>
        <p className="text-gray-500">
          Email:{" "}
          <a
            href="mailto:support@eshelf.com"
            className="cursor-pointer text-sky-400 hover:underline"
          >
            support@eshelf.com
          </a>
        </p>
      </div>
    </>
  );
};

export default Feedback;
