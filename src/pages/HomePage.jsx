import { useState, useEffect } from "react";
import SearchForm from "../components/book/SearchForm.jsx";
import SuggestedBooks from "../components/book/SuggestedBooks.jsx";
import Logo from "../components/common/Logo.jsx";
import Quote from "../components/common/Quote.jsx";
import { bookService, mlService, authService } from "../services";
import { Loader2 } from "lucide-react";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mlLoading, setMlLoading] = useState(true);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [mlRawItems, setMlRawItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookService.getBooks({ limit: 100 });
        if (response.success) {
          setBooks(response.data);
        }
      } catch (err) {
        setError("Không thể tải danh sách sách");
        console.error("Error fetching books:", err);
      }
      setLoading(false);
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const user = authService.getStoredUser();
        const userId = user?._id || "anonymous";
        const recRes = await mlService.getRecommendations(userId);
        if (recRes.success && Array.isArray(recRes.items)) {
          setMlRawItems(recRes.items);

          // Thử map ISBN sang sách trong DB (nếu trùng)
          const isbnSet = new Set(recRes.items.map((i) => i.isbn));
          const allBooksRes = await bookService.getBooks({ limit: 200 });
          if (allBooksRes.success && Array.isArray(allBooksRes.data)) {
            const recBooks = allBooksRes.data.filter((b) => isbnSet.has(b.isbn));
            setRecommendedBooks(recBooks);
          }
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setMlLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <>
      <div className="mt-12 md:mt-20 lg:mt-24">
        <Logo fontSize="text-7xl" />
        <Quote />
      </div>
      <SearchForm />
      <div className="mx-4 mt-16 md:mx-24 lg:mx-44 space-y-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
          </div>
        ) : error ? (
          <p className="py-12 text-center text-red-500">{error}</p>
        ) : (
          <>
            <SuggestedBooks
              heading="Tủ sách gợi ý"
              bookDetails={books}
              totalDisplayedBooks={180}
            />

            {!mlLoading && mlRawItems.length > 0 && (
              <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-6">
                <h2 className="mb-4 text-xl font-semibold text-sky-700">
                  Gợi ý riêng cho bạn (AI)
                </h2>

                {recommendedBooks.length > 0 ? (
                  <SuggestedBooks
                    heading=""
                    bookDetails={recommendedBooks}
                    totalDisplayedBooks={recommendedBooks.length}
                  />
                ) : (
                  <ul className="space-y-2 text-sm text-sky-900">
                    {mlRawItems.map((item) => (
                      <li
                        key={item.isbn}
                        className="flex items-center justify-between rounded-md bg-white/70 px-3 py-2 shadow-sm"
                      >
                        <span className="font-medium">
                          ISBN: {item.isbn}
                        </span>
                        <span className="text-xs text-sky-600">
                          Score: {Math.round(item.score * 100)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
