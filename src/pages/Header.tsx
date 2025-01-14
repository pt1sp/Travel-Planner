// Header.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
    }
  }, []);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLoginClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      setIsLoggedIn(false);
      setUserName(null);
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  const handleSignUpClick = () => {
    navigate("/sign-up");
  };

  return (
    <header className="header">
      <div className="logo" onClick={handleLogoClick}>
        Travel Planner
      </div>
      <div className="buttons">
        {isLoggedIn ? (
          <>
            <span className="user-name">{userName}</span>
            <button className="logout-button" onClick={handleLoginClick}>
              ログアウト
            </button>
          </>
        ) : (
          <>
            <button className="login-button" onClick={handleLoginClick}>
              ログイン
            </button>
            <button className="sign-up-button" onClick={handleSignUpClick}>
              新規登録
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
