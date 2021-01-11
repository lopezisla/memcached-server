const Executor = require("../classes/Executor");
const {
  LINE_FEED,
  BACKSPACE,
  REGEX,
  A_16BIT_UNSIGNED_MAX_VALUE,
  SECONDS_MAX_VALUE,
} = require("../config/constants.js");
const { ERROR, CLIENT_ERROR } = require("../config/serverMessages.js");
const {
  ALL_COMMANDS,
  STORAGE_COMMANDS,
  CAS,
  RETRIEVAL_COMMANDS,
  GETS,
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
        return `${CLIENT_ERROR} control characters are not allowed`;
      } else {
        //check if there was a previous data entry
        if (!this.commandToRun.length) {
          const commandChunkSplit = this.splitCommandChunk();
          this.dataChunk = "";
          if (commandChunkSplit.length <= 1)
            return `${CLIENT_ERROR} wrong command`;
          const isValidCommand = this.parseFullCommand(commandChunkSplit);
          console.log("valid command: ");
          console.log(isValidCommand);
          if (!isValidCommand) return ERROR;
          if (RETRIEVAL_COMMANDS.includes(this.commandToRun[0])) {
            const commandToRun = this.commandToRun.filter(
              (c) => c !== undefined
            );
            const executor = new Executor();
            this.commandToRun = [];
            return executor.execute(commandToRun);
          }
        } else {
          const valueChunkSplit = this.dataChunk.replace(LINE_FEED, "");
          this.dataChunk = "";
          const commandToRun = this.cleanCommand();
          this.commandToRun = [];
          const commandBytes = parseInt(commandToRun[4])
          //checks if value length is equal to command parameter bytes
          if (valueChunkSplit.length !== commandBytes) return "lencth";
          const executor = new Executor();
          const result = executor.execute(commandToRun, valueChunkSplit);
          const checkNoReply = commandToRun.pop();
          return checkNoReply === "noreply" ? "" : result;
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
      return areValidParams ? true : false;
    } else {
      return false;
    }
  }

  parseCommand(commandName) {
    return ALL_COMMANDS.includes(commandName) ? true : false;
  }

  parseParams(fullCommand) {
      const a = fullCommand
      console.log(a);
    if (STORAGE_COMMANDS.includes(fullCommand[0])) {
      this.setFullCommand(fullCommand[0]);
      const isValidKey = this.parseKey(fullCommand[1]);
      const areValidFlags = this.parseFlags(fullCommand[2]);
      const isValidExptime = this.parseExptime(fullCommand[3]);
      const areValidBytes = this.parseBytes(fullCommand[4]);
      if (isValidKey && areValidFlags && isValidExptime && areValidBytes) {
        if (fullCommand[0] === CAS) {
          this.setFullCommand(fullCommand[5]);
        }
        if (this.checkNoReply(fullCommand)) {
          this.setFullCommand("noreply");
        }
        return true;
      } else {
        return false;
      }
    } else {
      for (let element of fullCommand) {
        this.setFullCommand(element);
      }
      return true;
    }
  }

  parseKey(key) {
    const validKey = key.match(REGEX);
    if (validKey[0] !== "") {
      this.setFullCommand(validKey[0]);
      return true;
    } else {
      return false;
    }
    //return validKey[0] !== "" ? validKey[0] : false;
  }

  parseFlags(flags) {
    const validFlags = parseInt(flags);
    if (Number.isInteger(validFlags)) {
      if (validFlags >= 0 && validFlags <= A_16BIT_UNSIGNED_MAX_VALUE) {
        this.setFullCommand(validFlags);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

    // return Number.isInteger(validFlags)
    //   ? validFlags >= 0 && validFlags <= A_16BIT_UNSIGNED_MAX_VALUE
    //     ? [true, validFlags]
    //     : false
    //   : false;
  }

  parseExptime(exptime) {
    const validExptime = parseInt(exptime);
    if (Number.isInteger(validExptime)) {
      if (validExptime < SECONDS_MAX_VALUE) {
        this.setFullCommand(validExptime);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  parseBytes(bytes) {
      console.log(bytes);
      const validBytes = parseInt(bytes);
      console.log(validBytes);
    if (Number.isInteger(validBytes)) {
      if (validBytes >= 0) {
          console.log(validBytes);
        this.setFullCommand(validBytes);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
    // return Number.isInteger(validBytes)
    //   ? validBytes >= 0
    //     ? [true, validBytes]
    //     : false
    //   : false;
  }

  setFullCommand(param) {
    this.commandToRun.push(param);
  }

  checkNoReply(params) {
    return params.includes("noreply");
    //return true;
  }

  cleanCommand() {
    return this.commandToRun.filter((c) => c !== undefined);
  }

}

module.exports = Parser;
