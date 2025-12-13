import { useState, useEffect } from "react";
import SearchForm from "../components/book/SearchForm.jsx";
import SuggestedBooks from "../components/book/SuggestedBooks.jsx";
import Logo from "../components/common/Logo.jsx";
import Quote from "../components/common/Quote.jsx";
import { bookService } from "../services";
import { Loader2 } from "lucide-react";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <>
      <div className="mt-12 md:mt-20 lg:mt-24">
        <Logo fontSize="text-7xl" />
        <Quote />
      </div>
      <SearchForm />
      <div className="mx-4 mt-16 md:mx-24 lg:mx-44">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
          </div>
        ) : error ? (
          <p className="py-12 text-center text-red-500">{error}</p>
        ) : (
          <SuggestedBooks
            heading="Tủ sách gợi ý"
            bookDetails={books}
            totalDisplayedBooks={180}
          />
        )}
      </div>
    </>
  );
};

export default HomePage;
