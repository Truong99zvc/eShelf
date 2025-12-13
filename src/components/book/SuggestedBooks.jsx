import { useMemo } from "react";
import { Link } from "react-router-dom";

const SuggestedBooks = ({
  heading,
  totalDisplayedBooks = 6,
  bookDetails = [],
  chosenBookIsbn = null,
}) => {
  // Memoize the book selection to prevent re-shuffling on every render
  const displayedBooks = useMemo(() => {
    if (!bookDetails || bookDetails.length === 0) {
      return [];
    }

    // Filter out the chosen book if provided
    let filteredBooks = chosenBookIsbn
      ? bookDetails.filter(
          (book) => book.isbn?.trim() !== chosenBookIsbn?.trim()
        )
      : [...bookDetails];

    // Get the chosen book for genre matching
    const chosenBook = chosenBookIsbn
      ? bookDetails.find(
          (book) => book.isbn?.trim() === chosenBookIsbn?.trim()
        )
      : null;

    // Separate related books (same genre) and other books
    const relatedBooks = [];
    const otherBooks = [];

    filteredBooks.forEach((book) => {
      if (
        chosenBook &&
        chosenBook.genres &&
        book.genres &&
        chosenBook.genres.some((genre) => book.genres.includes(genre))
      ) {
        relatedBooks.push(book);
      } else {
        otherBooks.push(book);
      }
    });

    // Shuffle other books
    const shuffled = [...otherBooks].sort(() => Math.random() - 0.5);

    // Combine: related books first, then shuffled others
    const combined = [...relatedBooks, ...shuffled];

    // Return only the requested number of books
    return combined.slice(0, totalDisplayedBooks);
  }, [bookDetails, chosenBookIsbn, totalDisplayedBooks]);

  return (
    <>
      <p className="mb-5 border-b-2 border-b-sky-400 pb-2 text-xl text-sky-400">
        {heading}
      </p>
      <div className="mb-10 flex flex-wrap justify-around gap-y-3 md:justify-between">
        {displayedBooks.map((book) => (
          <Link
            to={`/book/${book.isbn}`}
            key={book.isbn || book._id}
            className="transition-transform hover:scale-105"
          >
            <img
              src={book.coverUrl}
              className="aspect-[5/7] w-48 rounded-sm object-cover drop-shadow-[0_0.2rem_0.2rem_rgba(0,0,0,0.5)] 2xl:w-52"
              title={book.title}
              alt={"Bìa " + book.title}
              loading="lazy"
            />
          </Link>
        ))}
      </div>
    </>
  );
};

export default SuggestedBooks;
