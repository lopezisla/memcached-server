const Parser = require("../classes/Parser");
const parser = new Parser();
const { LINE_FEED } = require("../config/constants.js");
const PORT = process.env.PORT || 11211;

const socketConnection = (socket) => {
  socket.setEncoding("utf8");
  console.log(`${socket.remoteAddress}:${socket.remotePort} connected`);
  socket.write(
    `Welcome ${socket.remoteAddress}:${socket.remotePort} to Memcached Server${LINE_FEED}`
  );
  socket.on("data", (data) => {
    const response = parser.readStream(data);
    if (response) socket.write(`${response}${LINE_FEED}`);
  });
  socket.on("end", () =>
    console.log(`${socket.remoteAddress}:${socket.remotePort} disconnected`)
  );
  socket.on("error", function (error) {
    //console.log(error);
  });
};

module.exports = { PORT, socketConnection };
