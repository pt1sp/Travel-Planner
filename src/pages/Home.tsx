import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Plan {
  id: number;
  name: string;
  period: string;
}

const Home: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("ユーザーがログインしていません。");
      return;
    }

    fetch(
      `http://localhost/project/travel-planner/backend/get_plans.php?user_id=${userId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPlans(data);
        }
      })
      .catch((error) => {
        setError("データの取得に失敗しました。");
        console.error("エラー:", error);
      });
  }, []);

  const handlePlanClick = (id: number) => {
    navigate(`/plan-details/${id}`);
  };

  const handleNewPlanClick = () => {
    navigate("/new-plan");
  };

  return (
    <div>
      <main className="main-content">
        {error && <p>{error}</p>}

        {!error && plans.length === 0 ? (
          <p>登録されている旅行計画はありません。</p>
        ) : (
          <div className="plan-list">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="plan-item"
                onClick={() => handlePlanClick(plan.id)}
              >
                <h3>{plan.name}</h3>
                <p>期間: {plan.period}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <button className="new-plan-button" onClick={handleNewPlanClick}>
        +
      </button>
    </div>
  );
};

export default Home;
