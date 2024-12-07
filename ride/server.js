const http = require('http');
const app = require('./app');

const port = 3003; 
const server = http.createServer(app); 


server.listen(port , ()=>{
    console.log("ride serverice is running on port 3003");
}); 