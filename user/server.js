const http = require('http');
const app = require('./app'); // Import app

const port = 3001; // Set port
const server = http.createServer(app); // Create server


server.listen(port , ()=>{
    console.log("user serverice is running on port 3001");
}); // Listen on port