import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, History, Play, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services";

const ReadingHistory = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await userService.getReadingHistory();
        if (response.success) {
          setHistory(response.data);
        }
      } catch (err) {
        console.error("Error fetching reading history:", err);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [isAuthenticated, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="mx-4 py-8 md:mx-20 lg:mx-32">
      <div className="mb-6 flex items-center gap-3">
        <History className="h-8 w-8 text-sky-500" />
        <h1 className="text-2xl font-bold text-gray-800">Lịch Sử Đọc</h1>
      </div>

      {history.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white py-16 text-center">
          <History className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <p className="text-gray-500">Bạn chưa đọc sách nào</p>
          <Link
            to="/"
            className="mt-4 inline-block text-sky-500 hover:underline"
          >
            Khám phá sách ngay →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <div
              key={item.book?.isbn || index}
              className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <Link to={`/book/${item.book?.isbn}`}>
                <img
                  src={item.book?.coverUrl || "/images/default-book-cover.jpg"}
                  alt={item.book?.title}
                  className="h-24 w-16 rounded object-cover"
                />
              </Link>
              <div className="flex-1">
                <Link
                  to={`/book/${item.book?.isbn}`}
                  className="font-medium text-gray-800 hover:text-sky-500"
                >
                  {item.book?.title || "Sách không còn tồn tại"}
                </Link>
                <p className="text-sm text-gray-500">
                  {item.book?.author?.join(", ")}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Đọc lần cuối: {formatDate(item.lastRead)}
                </p>
                {item.progress > 0 && (
                  <div className="mt-2">
                    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-sky-500"
                        style={{ width: `${Math.min(item.progress, 100)}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Tiến độ: {item.progress}%
                    </p>
                  </div>
                )}
              </div>
              <Link
                to={`/reading/${item.book?.isbn}`}
                state={item.book?.pdfUrl}
                className="flex items-center gap-2 rounded bg-sky-500 px-4 py-2 text-white hover:bg-sky-400"
              >
                <Play size={16} />
                Đọc tiếp
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadingHistory;










