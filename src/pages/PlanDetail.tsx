import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GoogleMapButton from "./GoogleMapButton";

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

const PlanDetail: React.FC = () => {
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
          console.error("詳細情報の取得エラー:", error);
        });
    }
  }, [id]);

  if (!planDetail) {
    return <p>読み込み中...</p>;
  }

  const groupedActivities = planDetail.activities.reduce<
    Record<string, Activity[]>
  >((acc, activity) => {
    if (!acc[activity.date]) {
      acc[activity.date] = [];
    }
    acc[activity.date].push(activity);
    return acc;
  }, {});

  return (
    <div
      className="plan-detail"
      style={{ padding: "20px", boxSizing: "border-box" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>{planDetail.name} の詳細</h2>
        <button
          onClick={() => navigate(`/plan-edit/${planDetail.id}`)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          編集
        </button>
      </div>
      <p>
        期間: {planDetail.start_date} 〜 {planDetail.end_date}
      </p>

      <h3>活動一覧</h3>
      {Object.keys(groupedActivities).length > 0 ? (
        <div>
          {Object.entries(groupedActivities).map(([date, activities]) => (
            <div
              key={date}
              style={{
                marginBottom: "20px",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <h4
                style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}
              >
                {date}
              </h4>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {activities.map((activity, index) => (
                  <li
                    key={index}
                    style={{
                      marginBottom: "10px",
                      backgroundColor: "#f9f9f9",
                      padding: "10px",
                      borderRadius: "4px",
                      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <p>
                      <strong>時間:</strong> {activity.time}
                    </p>
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "0",
                      }}
                    >
                      <strong>目的地: {activity.destination}</strong>
                      <GoogleMapButton destination={activity.destination} />
                    </p>
                    <p>
                      <strong>メモ:</strong> {activity.notes}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>活動はありません。</p>
      )}
    </div>
  );
};

export default PlanDetail;
