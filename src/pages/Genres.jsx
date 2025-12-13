import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { bookService } from "../services";

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [filteredGenres, setFilteredGenres] = useState([]);
  const [searchGenre, setSearchGenre] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await bookService.getGenres();
        if (response.success) {
          setGenres(response.data);
          setFilteredGenres(response.data);
        }
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
      setLoading(false);
    };

    fetchGenres();
  }, []);

  const handleTypeSearchGenre = (term) => {
    setSearchGenre(term);
    const normalized = term
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .trim();

    setFilteredGenres(
      genres.filter((genre) =>
        genre.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .includes(normalized)
      )
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="px-8 py-8 md:px-28">
      <p className="mb-8 cursor-default text-sm text-gray-400">
        <Link className="cursor-pointer text-sky-400 hover:underline" to="/">
          Trang Chính
        </Link>
        {" > "} <span className="cursor-pointer">Thể Loại</span>
      </p>
      <div className="mb-3 flex flex-wrap justify-between">
        <h1
          className="text-2xl font-bold text-gray-700"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          Tất Cả Thể Loại
        </h1>
        <input
          type="text"
          value={searchGenre}
          onChange={(e) => handleTypeSearchGenre(e.target.value)}
          className="mt-3 w-64 rounded-sm border border-gray-300 px-3 py-1 text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 md:mt-0"
          placeholder="Tìm kiếm thể loại"
        />
      </div>
      <div className="grid grid-cols-1 gap-y-1.5 md:grid-cols-3">
        {filteredGenres.map((genre) => (
          <Link
            to={`/search/&-&${encodeURIComponent(genre.name)}`}
            className="text-gray-600 hover:text-sky-400"
            key={genre._id || genre.slug || genre.name}
          >
            {genre.name}{" "}
            <span className="text-sm italic text-gray-400">
              ({genre.bookCount || 0})
            </span>
          </Link>
        ))}
      </div>
      {filteredGenres.length === 0 && (
        <p className="mt-4 text-gray-500">Không tìm thấy thể loại nào.</p>
      )}
    </div>
  );
};

export default Genres;
