const { LINE_FEED } = require("../config/constants.js");
const Parser = require("../classes/Parser");
const parser = new Parser();
const PORT = process.env.PORT || 11211;

const socketConnection = (socket) => {
  socket.setEncoding("utf8");
  console.log(`${socket.remoteAddress}:${socket.remotePort} connected`);
  socket.write(
    `Welcome ${socket.remoteAddress}:${socket.remotePort} to Memcached Server${LINE_FEED}`
  );
  //c.on("data", (chunk) => c.write(chunk));
  socket.on("data", (data) => {
    const response = parser.readStream(data);
    if (response) socket.write(response);
  });
  socket.on("end", () =>
    console.log(`${socket.remoteAddress}:${socket.remotePort} disconnected`)
  );
  //c.pipe(c);
};

module.exports = { PORT, socketConnection };
