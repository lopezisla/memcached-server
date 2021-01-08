const {
  LINE_FEED,
  BACKSPACE,
  REGEX,
  A_16BIT_UNSIGNED_MAX_VALUE,
} = require("../config/constants.js");
const { ERROR, CLIENT_ERROR } = require("../config/serverMessages.js");
const {
  ALL_COMMANDS,
  STORAGE_COMMANDS,
  CAS,
  RETRIEVAL_COMMANDS,
} = require("../config/commands.js");

class Parser {
  constructor() {
    this.dataChunk = "";
    this.commandToRun = [];
  }

  readStream(chunk) {
    this.dataChunk += chunk;
    if (this.wasEnterPressed()) {
      if (this.wasBackspacePressed()) {
        this.dataChunk = "";
        this.commandToRun = [];
        return `${CLIENT_ERROR} control characters are not allowed${LINE_FEED}`;
      } else {
        if (!this.commandToRun.length) {
          const commandChunkSplit = this.splitCommandChunk();
          this.dataChunk = "";
          if (commandChunkSplit.length > 1) {
            const isValidCommand = this.parseFullCommand(commandChunkSplit);
            console.log(this.commandToRun);
            if (isValidCommand) {
              if (RETRIEVAL_COMMANDS.includes(this.commandToRun[0])) {
                console.log(`execute ${this.commandToRun}`);
                this.commandToRun = [];
                console.log(`check is this is empty: ${this.commandToRun}`);
              }
            } else {
              return `${ERROR}${LINE_FEED}`;
            }
          } else {
            return `${CLIENT_ERROR} missing parameters${LINE_FEED}`;
          }
        } else {
          console.log("entre a value");
          const valueChunkSplit = this.dataChunk.replace(LINE_FEED, "");

          console.log(`execute ${this.commandToRun}`);
          console.log(`data entry: ${this.dataChunk}`);
          console.log(`split data entry: ${valueChunkSplit}`);
          this.commandToRun = [];
          console.log(`check is this.command is empty: ${this.commandToRun}`);
          this.dataChunk = "";
          console.log(`check is this.data is empty: ${this.dataChunk}`);
          
          const result = `this var s going to be the result of exec: ${LINE_FEED}`;
          console.log(result);
          console.log(`length of this.command ${this.commandToRun.length}`);
        }
      }
    }
  }

  wasEnterPressed() {
    return this.dataChunk.includes(LINE_FEED);
  }

  wasBackspacePressed() {
    return this.dataChunk.includes(BACKSPACE);
  }

  splitCommandChunk() {
    return this.dataChunk
      .replace(LINE_FEED, "")
      .split(" ")
      .filter((c) => c !== "");
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
  }

  parseCommand(commandName) {
    return ALL_COMMANDS.includes(commandName) ? true : false;
  }

  parseParams(fullCommand) {
    if (STORAGE_COMMANDS.includes(fullCommand[0])) {
      const isValidKey = this.parseKey(fullCommand[1]);
      const isValidFlag = this.parseFlag(fullCommand[2]);
      const isValidExptime = this.parseExptime(fullCommand[3]);
      const isValidBytes = this.parseBytes(fullCommand[4]);
      if (
        isValidKey &&
        isValidFlag[0] &&
        isValidExptime[0] &&
        isValidBytes[0]
      ) {
        if (fullCommand[0] === CAS) {
          this.setCommand(
            fullCommand[0],
            isValidKey,
            isValidFlag[1],
            isValidExptime[1],
            isValidBytes[1],
            fullCommand[5]
          );
          return true;
        } else {
          this.setCommand(
            fullCommand[0],
            isValidKey,
            isValidFlag[1],
            isValidExptime[1],
            isValidBytes[1]
          );
          return true;
        }
      } else {
        return false;
      }
    } else {
      this.setCommand(fullCommand[0], fullCommand[1], fullCommand[2]);
      return true;
    }
  }

  parseKey(key) {
    const validKey = key.match(REGEX);
    return validKey[0] !== "" ? validKey[0] : false;
  }

  parseFlag(flag) {
    const validFlag = parseInt(flag);
    return Number.isInteger(validFlag)
      ? validFlag >= 0 && validFlag <= A_16BIT_UNSIGNED_MAX_VALUE
        ? [true, validFlag]
        : false
      : false;
  }

  parseExptime(exptime) {
    const validExptime = parseInt(exptime);
    return Number.isInteger(validExptime) ? [true, validExptime] : false;
  }

  parseBytes(bytes) {
    const validBytes = parseInt(bytes);
    return Number.isInteger(validBytes)
      ? validBytes >= 0
        ? [true, validBytes]
        : false
      : false;
  }

  setCommand(command, key, flag, exptime, bytes, casUnique) {
    return (this.commandToRun = [
      command,
      key,
      flag,
      exptime,
      bytes,
      casUnique,
    ]);
  }
}

module.exports = Parser;
