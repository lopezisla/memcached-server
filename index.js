const net = require("net");
const { PORT, socketConnection } = require("./src/config/connection");

const server = net.createServer(socketConnection);
server.listen(PORT, "0.0.0.0");
server.on("listening", () => console.log(`Server Memcached active on ${PORT}`));
