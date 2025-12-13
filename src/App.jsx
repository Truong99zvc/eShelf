import Header from "./components/layout/header/Header.jsx";
import Footer from "./components/layout/footer/Footer.jsx";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

/*
.load-more:before {
pointer-events: none;
    content: '';
    position: absolute;
    bottom: 100%;
    height: 90px;
    width: 100%;
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%);
    border-bottom: 1px solid var(--gray-1);}
    

    .load-more-text:before {
    background: linear-gradient(90deg, var(--primary-color) 2%, #00000000 100%);
    left: 100%;
    }
    .load-more-text:before, .load-more-text:after {
    content: '';
    position: absolute;
    height: 1px;
    max-width: 220px;
    width: 140%;
    }
    .load-more-text:after {
    background: linear-gradient(270deg, var(--primary-color) 2%, #00000000 100%);
    right: 100%;
    }
    */
export default App;
