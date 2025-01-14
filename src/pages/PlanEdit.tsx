import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Activity {
  time: string;
  destination: string;
  notes: string;
  date: string;
}

interface PlanDetail {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  activities: Activity[];
}

const PlanEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [planDetail, setPlanDetail] = useState<PlanDetail | null>(null);

  useEffect(() => {
    if (id) {
      fetch(
        `http://localhost/project/travel-planner/backend/get_plan_detail.php?id=${id}`
      )
        .then((response) => response.json())
        .then((data) => {
          setPlanDetail(data);
        })
        .catch((error) => {
          console.error("編集情報の取得エラー:", error);
        });
    }
  }, [id]);

  const handleActivityChange = (
    index: number,
    field: string,
    value: string
  ) => {
    if (!planDetail) return;

    const updatedActivities = [...planDetail.activities];
    updatedActivities[index] = {
      ...updatedActivities[index],
      [field]: value,
    };
    setPlanDetail({ ...planDetail, activities: updatedActivities });
  };

  const handleDelete = () => {
    if (!id || !window.confirm("この旅行計画を削除してもよろしいですか？")) {
      return;
    }

    fetch(`http://localhost/project/travel-planner/backend/delete_plan.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          alert("旅行計画を削除しました。");
          navigate("/");
        } else {
          alert("旅行計画の削除に失敗しました。再試行してください。");
        }
      })
      .catch((error) => {
        console.error("削除エラー:", error);
        alert("エラーが発生しました。もう一度お試しください。");
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!planDetail) return;

    fetch("http://localhost/project/travel-planner/backend/update_plan.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planDetail),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          alert("プランが更新されました！");
          navigate(`/plan-details/${id}`);
        } else {
          alert("プランの更新に失敗しました。再試行してください。");
        }
      })
      .catch((error) => {
        console.error("プラン更新エラー:", error);
        alert("エラーが発生しました。もう一度お試しください。");
      });
  };

  if (!planDetail) {
    return <p>読み込み中...</p>;
  }

  return (
    <div
      className="plan-edit"
      style={{ padding: "20px", boxSizing: "border-box" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>{planDetail.name} を編集</h2>
        <button
          onClick={handleDelete}
          style={{
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          削除
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>プラン名:</label>
          <input
            type="text"
            value={planDetail.name}
            onChange={(e) =>
              setPlanDetail({ ...planDetail, name: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>開始日:</label>
          <input
            type="date"
            value={planDetail.start_date}
            onChange={(e) =>
              setPlanDetail({ ...planDetail, start_date: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>終了日:</label>
          <input
            type="date"
            value={planDetail.end_date}
            onChange={(e) =>
              setPlanDetail({ ...planDetail, end_date: e.target.value })
            }
            required
          />
        </div>

        <h3>活動の編集</h3>
        {planDetail.activities.map((activity, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <h4>{activity.date}</h4>
            <div className="form-group">
              <label>時間:</label>
              <input
                type="time"
                value={activity.time}
                onChange={(e) =>
                  handleActivityChange(index, "time", e.target.value)
                }
                required
              />
            </div>
            <div className="form-group">
              <label>目的地:</label>
              <input
                type="text"
                value={activity.destination}
                onChange={(e) =>
                  handleActivityChange(index, "destination", e.target.value)
                }
                required
              />
            </div>
            <div className="form-group">
              <label>メモ:</label>
              <textarea
                value={activity.notes}
                onChange={(e) =>
                  handleActivityChange(index, "notes", e.target.value)
                }
                rows={3}
                style={{ width: "100%", resize: "vertical" }}
              />
            </div>
          </div>
        ))}

        <button type="submit" className="save-button">
          保存
        </button>
      </form>
    </div>
  );
};

export default PlanEdit;
