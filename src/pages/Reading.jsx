import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services";

const Reading = () => {
  const { id } = useParams(); // ISBN from URL
  const location = useLocation();
  const { state } = location;
  const { isAuthenticated } = useAuth();

  // Update reading history when user opens a book
  useEffect(() => {
    const updateHistory = async () => {
      if (isAuthenticated && id) {
        try {
          await userService.updateReadingHistory(id, 0);
          console.log("Reading history updated for:", id);
        } catch (err) {
          console.error("Error updating reading history:", err);
        }
      }
    };

    updateHistory();
  }, [id, isAuthenticated]);

  return (
    <div className="h-screen w-screen">
      <iframe
        src={state ? state : "/pdfs/lorem-ipsum.pdf"}
        frameBorder="0"
        className="h-full w-full"
        title="PDF Reader"
      />
    </div>
  );
};

export default Reading;
