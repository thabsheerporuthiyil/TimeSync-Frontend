// useNotificationSocket.js
import { useEffect, useRef } from "react";

export default function useNotificationSocket(addNotification, user) {
  const socketRef = useRef(null);

  useEffect(() => {
    // If we already have a socket, we need to check if we should close it (e.g. user logged out)
    // or if we need to reconnect (user logged in).
    // For simplicity, let's close existing specific user sockets if the user changed or logged out.
    if (socketRef.current) {
      // If we are just re-running but nothing changed that requires restart, we might want to skip,
      // but since we are adding 'user' to dependency, we want to ensure we have the RIGHT socket.
      // Simplest strategy: Close old, open new if valid.
      socketRef.current.close();
      socketRef.current = null;
    }

    const token = localStorage.getItem("access");
    if (!token) return;

    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/notifications/?token=${token}`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("🔔 Notification socket connected (ready to receive)");
    };

    socket.onmessage = (event) => {
      console.log("📩 Notification received:", event.data);
      const notification = JSON.parse(event.data);
      addNotification(notification);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    socket.onclose = () => {
      console.log("🔕 Notification socket closed");
    };

    return () => {
      if (socket.readyState === 1) { // OPEN
        socket.close();
      }
    }
  }, [addNotification, user]); // Added user dependency
}
