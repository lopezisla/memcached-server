const { LINE_FEED, BACKSPACE, REGEX } = require("../config/constants.js");
const { ERROR, CLIENT_ERROR } = require("../config/serverMessages.js");
const {
  ALL_COMMANDS,
  STORAGE_COMMANDS,
  RETRIEVAL_COMMANDS,
} = require("../config/commands.js");

class Parser {
  constructor() {
    this.chunk = "";
  }

  readStream(data) {
    this.chunk += data;
    if (this.wasEnterPressed()) {
      if (this.wasBackspacePressed()) {
        this.chunk = "";
        return `${CLIENT_ERROR} control characters are not allowed${LINE_FEED}`;
      } else {
        const chunkSplit = this.splitChunk();
        this.chunk = "";
        console.log(chunkSplit);
        const isValidCommand = this.parseFullCommand(chunkSplit);
        if (isValidCommand) {
          return `${chunkSplit[0]}${LINE_FEED}`;
        } else {
          return `${ERROR}${LINE_FEED}`;
        }
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

  parseFullCommand(fullCommand) {
    const commandNameExists = this.parseCommand(fullCommand[0]);
    if (commandNameExists) {
      const areValidParams = this.parseParams(fullCommand);
      if (areValidParams) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
    // const [command, key, flag, exptime, bytes, noreply] = fullCommand;
    // console.log([command, key, flag, exptime, bytes, noreply]);
    // return command;
  }

  parseCommand(commandName) {
    return ALL_COMMANDS.includes(commandName) ? true : false;
  }

  parseParams(fullCommand) {
    if (STORAGE_COMMANDS.includes(fullCommand[0])) {
      const isValidKey = fullCommand[1].match(REGEX);
      if (isValidKey[0] !== "") {
        
      } else {
        return false;
      }
    } else {

    }

    // let [_, key, flag, exptime, bytes, noreply] = fullCommand;
    // flag = parseInt(flag);
    // exptime = parseInt(exptime);
    // bytes = parseInt(bytes);
    // noreply = parseInt(noreply);
    // return [key, flag, exptime, bytes, noreply];
  }
}

module.exports = Parser;
