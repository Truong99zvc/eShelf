import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Download,
  Heart,
  Bookmark,
  MessageSquareMore,
  Play,
  Loader2,
  Star,
  Send,
} from "lucide-react";
import SuggestedBooks from "../components/book/SuggestedBooks";
import { useAuth } from "../context/AuthContext";
import { bookService, userService, reviewService } from "../services";

const BookDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isHeartClicked, setIsHeartClicked] = useState(false);
  const [isBookmarkClicked, setIsBookmarkClicked] = useState(false);
  const [heartLoading, setHeartLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Fetch book data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [bookRes, relatedRes] = await Promise.all([
          bookService.getBookByIsbn(id),
          bookService.getRelatedBooks(id, 12),
        ]);

        if (bookRes.success) {
          setBook(bookRes.data);
          setReviews(bookRes.data.reviews || []);
        }

        if (relatedRes.success) {
          setRelatedBooks(relatedRes.data);
        }

        // Check if user has favorited/bookmarked this book
        if (isAuthenticated && user) {
          setIsHeartClicked(user.favorites?.includes(id) || false);
          setIsBookmarkClicked(user.bookmarks?.includes(id) || false);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải thông tin sách");
      }
      setLoading(false);
    };

    fetchData();
  }, [id, isAuthenticated, user]);

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    setHeartLoading(true);
    try {
      if (isHeartClicked) {
        await userService.removeFavorite(id);
        setIsHeartClicked(false);
      } else {
        await userService.addFavorite(id);
        setIsHeartClicked(true);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
    setHeartLoading(false);
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    setBookmarkLoading(true);
    try {
      if (isBookmarkClicked) {
        await userService.removeBookmark(id);
        setIsBookmarkClicked(false);
      } else {
        await userService.addBookmark(id);
        setIsBookmarkClicked(true);
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
    setBookmarkLoading(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    if (!reviewText.trim()) {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setReviewLoading(true);
    try {
      const response = await reviewService.createReview({
        bookIsbn: id,
        rating: reviewRating,
        comment: reviewText,
      });

      if (response.success) {
        setReviews([response.data, ...reviews]);
        setReviewText("");
        setReviewRating(5);
        setShowReviewForm(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Không thể gửi đánh giá");
    }
    setReviewLoading(false);
  };

  const handleDownload = async () => {
    if (book?.pdfUrl) {
      await bookService.incrementDownload(id);
      window.open(book.pdfUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-xl text-red-500">{error || "Không tìm thấy sách"}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sky-500 hover:underline"
        >
          <ArrowLeft size={20} /> Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="px-8 md:px-20 lg:px-24">
      <p
        className="mb-4 flex cursor-pointer gap-1 text-gray-700 hover:text-sky-500"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft /> <span className="hover:underline">Quay Lại</span>
      </p>

      <div className="mb-20">
        <img
          className="float-left mr-8 h-96 w-64 rounded-sm object-cover drop-shadow-[0_0.2rem_0.2rem_rgba(0,0,0,0.5)]"
          src={book.coverUrl}
          alt={book.title}
        />
        <p className="mb-1 text-2xl text-gray-800">{book.title}</p>
        <p className="mb-5 cursor-pointer text-sm text-sky-400">
          {book.author?.map((au, index) => (
            <span key={index}>
              <a className="underline hover:text-sky-600">{au}</a>
              {index !== book.author.length - 1 && ", "}
            </span>
          ))}
        </p>

        <div className="mb-5 flex gap-4">
          <p
            className="flex cursor-pointer gap-1 text-gray-500 hover:text-gray-600 hover:underline"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            <MessageSquareMore />
            {`${reviews.length} bình luận`}
          </p>
          <button
            onClick={handleFavorite}
            disabled={heartLoading}
            className={`cursor-pointer ${isHeartClicked ? "text-sky-400" : "text-gray-400 hover:text-gray-500"}`}
          >
            {heartLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Heart fill={isHeartClicked ? "#38bdf8" : "#f9fafb"} />
            )}
          </button>
          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className={`cursor-pointer ${isBookmarkClicked ? "text-amber-400" : "text-gray-400 hover:text-gray-500"}`}
          >
            {bookmarkLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Bookmark fill={isBookmarkClicked ? "#fbbf24" : "#f9fafb"} />
            )}
          </button>
        </div>

        {book.description && (
          <p className="mb-5 text-sm text-gray-700">
            <span className="text-gray-500">Giới thiệu:</span> {book.description}
          </p>
        )}

        <div className="mb-5 grid grid-cols-2 gap-x-12 gap-y-2 text-sm text-gray-700">
          {book.genres?.length > 0 && (
            <p className="cursor-pointer">
              <span className="text-gray-500">Thể loại:</span>{" "}
              {book.genres.join(", ")}
            </p>
          )}
          {book.bookLanguage && (
            <p>
              <span className="text-gray-500">Ngôn ngữ:</span> {book.bookLanguage}
            </p>
          )}
          {book.year && (
            <p>
              <span className="text-gray-500">Năm:</span> {book.year}
            </p>
          )}
          {book.publisher && (
            <p>
              <span className="text-gray-500">Nhà xuất bản:</span> {book.publisher}
            </p>
          )}
          {book.translator?.length > 0 && (
            <p>
              <span className="text-gray-500">Người dịch:</span>{" "}
              {book.translator.join(", ")}
            </p>
          )}
          {book.isbn && (
            <p>
              <span className="text-gray-500">Mã:</span> {book.isbn}
            </p>
          )}
          {book.extension && book.size && (
            <p>
              <span className="text-gray-500">File:</span> {book.extension},{" "}
              {book.size}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            className="flex gap-1 rounded bg-sky-400 px-5 py-2 text-white hover:bg-sky-300"
            onClick={() => navigate(`/reading/${book.isbn}`, { state: book.pdfUrl })}
          >
            <Play />
            Đọc sách
          </button>
          <button
            className="flex gap-1 rounded border border-gray-300 px-5 py-2 text-gray-600 hover:border-sky-400"
            onClick={handleDownload}
          >
            <Download />
            Tải xuống
          </button>
          <p
            className="cursor-pointer py-2 text-amber-400 underline hover:text-amber-500"
            onClick={() => navigate("/feedback")}
          >
            Báo cáo lỗi?
          </p>
        </div>
      </div>

      {/* Review Section */}
      <div className="mb-10">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Đánh giá & Bình luận
        </h3>

        {/* Review Form */}
        {showReviewForm && (
          <form
            onSubmit={handleSubmitReview}
            className="mb-6 rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="text-gray-600">Đánh giá:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={24}
                    className={
                      star <= reviewRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Viết đánh giá của bạn..."
              className="mb-3 w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={reviewLoading}
                className="flex items-center gap-2 rounded bg-sky-500 px-4 py-2 text-white hover:bg-sky-400 disabled:bg-sky-300"
              >
                {reviewLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                Gửi đánh giá
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="rounded border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div
                key={review._id || index}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                    {review.user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {review.user?.username || "Người dùng"}
                    </p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={
                            star <= (review.rating || 5)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            Chưa có đánh giá nào.{" "}
            <button
              onClick={() => setShowReviewForm(true)}
              className="text-sky-500 underline hover:text-sky-400"
            >
              Hãy là người đầu tiên đánh giá!
            </button>
          </p>
        )}
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <SuggestedBooks
          heading="Bạn có thể sẽ thích"
          bookDetails={relatedBooks}
          totalDisplayedBooks={12}
          chosenBookIsbn={id}
        />
      )}
    </div>
  );
};

export default BookDetail;
