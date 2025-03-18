import { BrowserRouter, Route, Routes } from "react-router-dom";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import PasswordChangePage from "./pages/PasswordChangePage";
import MainPage from "./pages/MainPage";
import SignupSuccessPage from "./pages/SignupSuccessPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SigninPage />} />
        <Route path="/sign-up" element={<SignupPage />}/>
        <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
        <Route path="/change-password" element={<PasswordChangePage />}/>
        <Route path="/main" element={<MainPage />}/>
        <Route path="/signup-success" element={<SignupSuccessPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
