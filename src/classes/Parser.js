const { LINE_FEED, BACKSPACE } = require("../config/constants.js");

class Parser {
  constructor() {
    this.chunk = "";
  }

  readStream(data) {
    this.chunk += data;
    if (this.chunk.includes(LINE_FEED)) {
      if (this.chunk.includes(BACKSPACE)) {
        return "ERROR MESSAGE: BACKSPACE IS NOT ALLOWED" + LINE_FEED;
      } else {
        const chunkParsed = this.parseChunk();
        this.chunk = "";
        console.log(chunkParsed);
        
        return chunkParsed[0] + LINE_FEED;
      }
    } else {
      return "ERROR MESSAGE: YOU MUST PRESS ENTER" + LINE_FEED;
    }
  }

  parseChunk() {
    return this.chunk.replace(LINE_FEED, "").toLowerCase().split(" ");
  }
}

module.exports = Parser;
