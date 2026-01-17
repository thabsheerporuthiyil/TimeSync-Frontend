import { useEffect, useRef } from "react";

const WS_HOST = import.meta.env.VITE_WS_BASE_URL;

export default function useNotificationSocket(addNotification, user) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    const token = localStorage.getItem("access");
    if (!token || !user) return;

    const wsUrl = `wss://${WS_HOST}.sslip.io/ws/notifications/?token=${token}`;
    const socket = new WebSocket(wsUrl);


    socketRef.current = socket;

    socket.onopen = () => {
      console.log("🔔 Notification socket connected");
    };

    socket.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      addNotification(notification);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    socket.onclose = () => {
      console.log("🔕 Notification socket closed");
    };

    return () => socket.close();
  }, [addNotification, user]);
}
