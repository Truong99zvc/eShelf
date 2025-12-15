import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Heart, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services";

const Favorites = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await userService.getFavorites();
        if (response.success) {
          setBooks(response.data);
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [isAuthenticated, navigate]);

  const handleRemove = async (isbn) => {
    setRemoving(isbn);
    try {
      await userService.removeFavorite(isbn);
      setBooks(books.filter((book) => book.isbn !== isbn));
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
    setRemoving(null);
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
        <Heart className="h-8 w-8 text-red-500" fill="#ef4444" />
        <h1 className="text-2xl font-bold text-gray-800">Sách Yêu Thích</h1>
      </div>

      {books.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white py-16 text-center">
          <Heart className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <p className="text-gray-500">Bạn chưa có sách yêu thích nào</p>
          <Link
            to="/"
            className="mt-4 inline-block text-sky-500 hover:underline"
          >
            Khám phá sách ngay →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <div
              key={book.isbn}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <Link to={`/book/${book.isbn}`}>
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="mb-1 font-medium text-gray-800 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {book.author?.join(", ")}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => handleRemove(book.isbn)}
                disabled={removing === book.isbn}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-red-500 opacity-0 transition-opacity hover:bg-red-50 group-hover:opacity-100"
                title="Xóa khỏi yêu thích"
              >
                {removing === book.isbn ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;










