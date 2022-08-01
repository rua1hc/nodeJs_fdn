const EventEmitter = require("events");
// const emitter = new EventEmitter();

const Logger = require("./logger");
const logger = new Logger();

logger.on("MsgLogged", (arg) => console.log("onListener: ", arg));

logger.log("msg1 coming");

// emitter.on("msgLogged", (arg) => console.log("Logged: ", arg));
// emitter.emit("msgLogged", { id: 1, url: "http:/" });

// ***************
const http = require("http");
const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.write("hello threr!");
        res.end();
    }
    if (req.url === "/api/courses") {
        res.write(JSON.stringify([1, 2, 3]));
        res.end();
    }
});

// server.on("connection", (socket) => console.log("new connection.."));

server.listen(3000);
console.log("listening on port 3000...");
