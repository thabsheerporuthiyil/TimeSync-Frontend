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

    // 1. Determine the correct protocol (ws for local, wss for production)
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const protocol = isLocal ? "ws" : "wss";

    // 2. Determine the correct host
    // If local, use localhost:8001. If production, use the sslip.io domain.
    const host = isLocal ? "127.0.0.1:8001" : `${WS_HOST}.sslip.io`;

    // 3. Construct the final URL without double-appending .sslip.io
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
