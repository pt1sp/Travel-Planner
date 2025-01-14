import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PlanDetail from "./pages/PlanDetail";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import NewPlan from "./pages/NewPlan";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PlanEdit from "./pages/PlanEdit";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-plan" element={<NewPlan />} />
        <Route path="/plan-details/:id" element={<PlanDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/plan-edit/:id" element={<PlanEdit />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
