import React, {useEffect, useState} from "react";
import "./Notification.css";

const Notification = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) {
          onClose(); // Callback when notification is about to hide
        }
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message, duration, onClose]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`notification notification-${type} ${visible ? "notification-visible" : ""}`}
    >
      {message}
    </div>
  );
};

export default Notification;
