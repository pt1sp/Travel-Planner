import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface PlanDay {
  date: string;
  activities: { time: string; destination: string; notes: string }[];
}

const NewPlan: React.FC = () => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [planDays, setPlanDays] = useState<PlanDay[]>([]);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayList: PlanDay[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dayList.push({
        date: d.toISOString().split("T")[0],
        activities: [],
      });
    }

    setPlanDays(dayList);
  }, [startDate, endDate]);

  const addActivity = (dayIndex: number) => {
    const updatedPlanDays = [...planDays];
    updatedPlanDays[dayIndex].activities.push({
      time: "",
      destination: "",
      notes: "",
    });
    setPlanDays(updatedPlanDays);
  };

  const handleActivityChange = (
    dayIndex: number,
    activityIndex: number,
    field: string,
    value: string
  ) => {
    const updatedPlanDays = [...planDays];
    updatedPlanDays[dayIndex].activities[activityIndex] = {
      ...updatedPlanDays[dayIndex].activities[activityIndex],
      [field]: value,
    };
    setPlanDays(updatedPlanDays);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("ユーザーIDが見つかりません");
      setMessage("ユーザーIDが見つかりません。再度ログインしてください。");
      return;
    }

    const newPlan = {
      name,
      startDate,
      endDate,
      planDays,
      userId,
    };

    console.log("新規プラン:", newPlan);

    fetch("http://localhost/project/travel-planner/backend/save_plan.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlan),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("保存しました:", data);
        if (data.status === "success") {
          setIsSuccess(true);
          setMessage("予定の追加に成功しました。");
          window.alert(
            "予定の追加に成功しました。\n完了ボタンを押すとホームに遷移します。"
          );
          navigate("/");
        } else {
          setIsSuccess(false);
          setMessage("予定の追加に失敗しました。再度お試しください。");
          window.alert("予定の追加に失敗しました。再度お試しください。");
        }
      })
      .catch((error) => {
        console.error("保存エラー:", error);
        setIsSuccess(false);
        setMessage("エラーが発生しました。もう一度お試しください。");
        window.alert("エラーが発生しました。もう一度お試しください。");
      });
  };

  return (
    <div className="new-plan-container">
      <h2>新規旅行プランを作成</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>旅行プラン名:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="旅行プラン名を入力"
          />
        </div>

        <div className="form-group">
          <label>開始日:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>終了日:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        {planDays.length > 0 && (
          <div className="plan-days">
            {planDays.map((day, dayIndex) => (
              <div key={dayIndex} className="day-plan">
                <h3>{day.date} のプラン</h3>
                {day.activities.map((activity, activityIndex) => (
                  <div key={activityIndex} className="activity">
                    <input
                      type="time"
                      value={activity.time}
                      onChange={(e) =>
                        handleActivityChange(
                          dayIndex,
                          activityIndex,
                          "time",
                          e.target.value
                        )
                      }
                      placeholder="時間"
                    />
                    <input
                      type="text"
                      value={activity.destination}
                      onChange={(e) =>
                        handleActivityChange(
                          dayIndex,
                          activityIndex,
                          "destination",
                          e.target.value
                        )
                      }
                      placeholder="目的地"
                    />
                    <textarea
                      value={activity.notes}
                      onChange={(e) =>
                        handleActivityChange(
                          dayIndex,
                          activityIndex,
                          "notes",
                          e.target.value
                        )
                      }
                      placeholder="メモ"
                      rows={3}
                      style={{ width: "100%", resize: "vertical" }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addActivity(dayIndex)}
                  className="add-activity-button"
                >
                  + 活動を追加
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="submit-button">
          プランを追加
        </button>
      </form>
    </div>
  );
};

export default NewPlan;
