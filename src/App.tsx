import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/Auth/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Hello! This is root page</h1>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<h1>Welcome Home!</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
