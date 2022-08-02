const EventEmitter = require("events");

class Logger extends EventEmitter {
    log(msg) {
        console.log(msg);
        this.emit("MsgLogged", { id: 1, url: "http" });
    }
}

module.exports = Logger;

// *****
const _ = require("underscore");

console.log(_.contains([1, 2, 3], 2));
