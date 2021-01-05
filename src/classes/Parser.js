const { LINE_FEED } = require("../config/constants.js");

class Parser {
  constructor() {
    this.chunk = "";
  }

  readStream(data) {
    this.chunk += data;
    if (this.chunk.includes(LINE_FEED)) {
      let result = this.chunk;
      this.chunk = "";
      return result;
    }
  }
}

module.exports = Parser;