const net = require("net");
const PORT = process.env.PORT || 11211;

const server = net.createServer((c) => {
  //console.log(c);
  c.setEncoding("utf8");
  console.log(`${c.remoteAddress}:${c.remotePort} connected`);
  c.write(`Welcome ${c.remoteAddress}:${c.remotePort} to Memcached Server\r\n`);
  c.on("data", (chunk) => c.write(chunk));
  c.on("end", () =>
    console.log(`${c.remoteAddress}:${c.remotePort} disconnected`)
  );
  //c.pipe(c);
});

server.listen(PORT,"0.0.0.0");
server.on("listening", () => console.log(`Server Memcached active on ${PORT}`));
