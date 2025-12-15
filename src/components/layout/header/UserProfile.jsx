import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Heart, Bookmark, History, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../../context/AuthContext.jsx";

const UserProfile = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1.5 text-sky-700 transition-colors hover:bg-sky-200"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <User size={16} />
          )}
        </div>
        <span className="max-w-[100px] truncate font-medium">
          {user.username}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
          <div className="border-b border-gray-100 px-4 py-2">
            <p className="font-medium text-gray-800">{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <div className="py-1">
            <Link
              to="/favorites"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Heart size={18} className="text-red-500" />
              <span>Sách yêu thích</span>
            </Link>

            <Link
              to="/bookmarks"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Bookmark size={18} className="text-amber-500" />
              <span>Sách đã đánh dấu</span>
            </Link>

            <Link
              to="/reading-history"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <History size={18} className="text-sky-500" />
              <span>Lịch sử đọc</span>
            </Link>
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2 text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut size={18} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;










