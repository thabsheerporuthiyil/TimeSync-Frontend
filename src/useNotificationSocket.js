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

    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    
    // In local, use raw IP/Port. In prod, use the sslip domain.
    const host = isLocal ? "127.0.0.1:8001" : `${WS_HOST}.sslip.io`;
    const wsUrl = `${protocol}://${host}/ws/notifications/?token=${token}`;

    console.log("Connecting to WebSocket:", wsUrl); // Debugging line

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
