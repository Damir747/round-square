import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/login";
import RoundPage from "./pages/round";
import Rounds from "./pages/rounds";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rounds" element={<Rounds />} />
        <Route path="/round/:id" element={<RoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
