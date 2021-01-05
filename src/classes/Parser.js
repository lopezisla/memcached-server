const { LINE_FEED, BACKSPACE } = require("../config/constants.js");
const { CLIENT_ERROR } = require("../config/serverMessages.js");
const { ALL_COMMANDS } = require("../config/commands.js");

class Parser {
  constructor() {
    this.chunk = "";
  }

  readStream(data) {
    this.chunk += data;
    if (this.wasEnterPressed()) {
      if (this.wasBackspacePressed()) {
        this.chunk = "";
        return `${CLIENT_ERROR} BACKSPACE IS NOT ALLOWED${LINE_FEED}`;
      } else {
        const chunkSplit = this.splitChunk();
        this.chunk = "";
        console.log(chunkSplit);
        this.parseFullCommand(chunkSplit)
        return chunkSplit[0] + LINE_FEED;
      }
    } 
  }

  wasEnterPressed() {
    return this.chunk.includes(LINE_FEED);
  }

  wasBackspacePressed() {
    return this.chunk.includes(BACKSPACE);
  }

  splitChunk() {
    return this.chunk.replace(LINE_FEED, "").split(" ");
  }

  parseFullCommand(fullCommand){
    //const command = fullCommand[0];
    const [command, key, flag, exptime, bytes, noreply] = fullCommand;
    console.log([command, key, flag, exptime, bytes, noreply]);
    return command;
  }

//   parseCommandParams(fullCommand) {
//     let [_, key, flag, exptime, bytes, noreply] = fullCommand;
//     flag = parseInt(flag);
//     exptime = parseInt(exptime);
//     bytes = parseInt(bytes);
//     noreply = parseInt(noreply);
//     return [key, flag, exptime, bytes, noreply];
//   }
}

module.exports = Parser;
