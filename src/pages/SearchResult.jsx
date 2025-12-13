import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import SearchForm from "../components/book/SearchForm";
import SearchResultItem from "../components/book/SearchResultItem";
import Logo from "../components/common/Logo.jsx";
import { bookService } from "../services";

const SearchResult = () => {
  const { searchvalues } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Parse search values
  const searchValues = searchvalues ? searchvalues.split("&") : [];
  const keyword = searchValues[0] || "";
  const times = searchValues[1] ? searchValues[1].split("-") : [];
  const searchGenres = searchValues[2] ? searchValues[2].split("+") : [];

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {};
        
        if (keyword) {
          params.q = keyword;
        }
        if (times[0]) {
          params.yearFrom = times[0];
        }
        if (times[1]) {
          params.yearTo = times[1];
        }
        if (searchGenres.length > 0 && searchGenres[0]) {
          params.genre = searchGenres.join("+");
        }

        const response = await bookService.searchBooks({
          ...params,
          limit: 100,
        });

        if (response.success) {
          setBooks(response.data);
        }
      } catch (err) {
        setError("Không thể tìm kiếm. Vui lòng thử lại.");
        console.error("Search error:", err);
      }
      setLoading(false);
    };

    if (searchValues.length > 0) {
      fetchSearchResults();
    } else {
      setLoading(false);
    }
  }, [searchvalues]);

  return (
    <div className="mt-8 md:mt-12 lg:mt-16">
      <Logo fontSize="text-7xl" />
      <SearchForm isSearchResultPage={true} />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
        </div>
      ) : error ? (
        <div className="mx-4 mt-10 md:mx-24 lg:mx-44">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <p
            className={`relative top-[1px] ml-4 mt-10 inline-block border border-b-0 border-gray-400 bg-white px-4 py-1 text-lg text-teal-800 md:ml-24 lg:mx-44 ${books.length === 0 ? "mb-60 border-b-[1px]" : ""}`}
          >
            Tìm thấy {books.length} cuốn sách
          </p>
          {books.length > 0 && (
            <div className="mx-4 mb-6 border border-b-0 border-gray-400 bg-white md:mx-24 lg:mx-44">
              {books.map((book) => (
                <div
                  className="border-b border-gray-400"
                  key={book.isbn || book._id}
                >
                  <SearchResultItem bookDetail={book} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResult;
