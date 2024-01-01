import React from "react";

const Notification = ({ notification, setShowNotification }) => {
  return (
    <div className="notification">
      {notification.status ? (
        <div className="notification-content">
          <h1 style={{ color: "#37CA8C" }}>Success</h1>
          <div style={{ textAlign: "left", padding: "10px 0px" }}>
            <p>Đã thêm thành công</p>
            <p className="notification-reason">
              Thêm thành công số : {notification.number} vào lúc :{" "}
              {new Date(notification.time).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => {
              setShowNotification(false);
            }}
            className="notification-button"
          >
            Ok
          </button>
        </div>
      ) : (
        <div className="notification-content">
          <h1 style={{ color: "#E76464" }}>Failed</h1>
          <div style={{ textAlign: "left", padding: "10px 0px" }}>
            <p>Không thể thêm thành công</p>
            <p className="notification-reason">Lý do : {notification.reason}</p>
          </div>
          <button
            onClick={() => {
              setShowNotification(false);
            }}
            className="notification-button"
          >
            Ok
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;
