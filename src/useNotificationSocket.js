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

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    let wsBase = window.location.host;
    // Only use the override in development mode to avoid breaking production
    // if the production .env has a raw IP but the site uses a domain.
    if (import.meta.env.DEV && WS_HOST) {
      wsBase = WS_HOST;
    }
    const wsUrl = `${protocol}://${wsBase}/ws/notifications/?token=${token}`;

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
