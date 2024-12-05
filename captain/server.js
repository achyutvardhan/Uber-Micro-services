const http = require("http");
const app = require("./app"); // Import app

const port = 3002; // Set port
const server = http.createServer(app); // Create server

server.listen(port, () => {
  console.log("Captain serverice is running on port 3002");
}); // Listen on port
