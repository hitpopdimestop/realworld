import app from "./app";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle process termination signals
process.on("SIGTERM", function () {
  console.log(`SIGTERM signal received: closing HTTP server.`);
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", function () {
  console.log(`SIGINT signal received: closing HTTP server.`);
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
 