import React from "react";

interface DestinationProps {
  destination: string;
}

const GoogleMapButton: React.FC<DestinationProps> = ({ destination }) => {
  const handleOpenGoogleMap = () => {
    const googleMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
      destination
    )}`;
    window.open(googleMapUrl, "_blank");
  };

  return (
    <button
      onClick={handleOpenGoogleMap}
      style={{
        margin: "5px",
        top: "0",
        right: "0",
        padding: "5px 10px",
        fontSize: "12px",
        backgroundColor: "#4285F4",
        color: "#fff",
        border: "none",
        borderRadius: "3px",
        cursor: "pointer",
        height: "30px",
        lineHeight: "normal",
      }}
    >
      Googleマップで確認
    </button>
  );
};

export default GoogleMapButton;
