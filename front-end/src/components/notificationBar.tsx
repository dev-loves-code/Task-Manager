import React, { useEffect, useState } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { Box, Typography } from "@mui/material";

const NotificationBar = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;

    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5207/notificationHub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR with JWT");

          connection.on("ReceiveMessage", (message: string) => {
            setNotifications((prev) => [...prev, message]);
          });
        })
        .catch((err) => console.error("SignalR connection error: ", err));
    }
  }, [connection]);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "80px",
        bgcolor: "#2C3E50",
        color: "white",
        px: 2,
        py: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.3)",
      }}
    >
      {notifications.length === 0 ? (
        <Typography variant="body2">No new notifications</Typography>
      ) : (
        notifications.map((msg, index) => (
          <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
            {msg}
          </Typography>
        ))
      )}
    </Box>
  );
};

export default NotificationBar;
