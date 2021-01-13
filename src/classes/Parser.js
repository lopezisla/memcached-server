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
} = require("../config/commands.js");

class Parser {
  constructor() {
    this.dataChunk = "";
    this.commandToRun = [];
    this.noReply = "";
  }

  readStream(chunk) {
    this.dataChunk += chunk;
    if (this.wasEnterPressed()) {
      if (this.wasBackspacePressed()) {
        this.dataChunk = "";
        this.commandToRun = [];
        return `${CLIENT_ERROR} control characters are not allowed.`;
      } else {
        //it checks if there was a previous data entry for a storage command, if there was not, it will execute the if statement, if there was it means that the current data entry is a datablock and it will execute the else statement
        if (!this.commandToRun.length) {
          const commandChunkSplit = this.splitCommandChunk();
          this.dataChunk = "";
          if (commandChunkSplit.length <= 1)
            return `${CLIENT_ERROR} wrong command.`;
          if (commandChunkSplit.includes("noreply"))
            this.noReply = commandChunkSplit.pop();
          const isValidCommand = this.parseFullCommand(commandChunkSplit);
          if (!isValidCommand) return ERROR;
          if (RETRIEVAL_COMMANDS.includes(this.commandToRun[0])) {
            const commandToRun = this.cleanCommand();
            const executor = new Executor();
            this.commandToRun = [];
            this.noReply = "";
            return executor.execute(commandToRun);
          }
        } else {
          const valueChunkSplit = this.dataChunk.replace(LINE_FEED, "");
          this.dataChunk = "";
          const commandToRun = this.cleanCommand();
          this.commandToRun = [];
          const commandBytes = Number(commandToRun[4]);
          if (valueChunkSplit.length !== commandBytes) return ERROR;
          const executor = new Executor();
          const result = executor.execute(commandToRun, valueChunkSplit);
          const noReply = this.noReply;
          this.noReply = "";
          return noReply === "noreply" ? "" : result;
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
      const isValidLength = this.checkFullCommandLength(fullCommand);
      if (isValidLength) {
        const areValidParams = this.parseParams(fullCommand);
        return areValidParams ? true : false;
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

  checkFullCommandLength(fullCommand) {
    if (fullCommand[0] === CAS) {
      return fullCommand.length === 6 ? true : false;
    } else if (STORAGE_COMMANDS.includes(fullCommand[0])) {
      return fullCommand.length === 5 ? true : false;
    } else {
      return true;
    }
  }

  parseParams(fullCommand) {
    if (STORAGE_COMMANDS.includes(fullCommand[0])) {
      this.setFullCommand(fullCommand[0]);
      const isValidKey = this.parseKey(fullCommand[1]);
      const areValidFlags = this.parseFlags(fullCommand[2]);
      const isValidExptime = this.parseExptime(fullCommand[3]);
      const areValidBytes = this.parseBytes(fullCommand[4]);
      if (isValidKey && areValidFlags && isValidExptime && areValidBytes) {
        if (fullCommand[0] === CAS) this.setFullCommand(fullCommand[5]);
        if (this.checkNoReply(fullCommand)) this.setFullCommand("noreply");
        return true;
      } else {
        this.commandToRun = [];
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
    if (validKey === null) {
      return false;
    } else if (validKey[0] === "") {
      return false;
    } else {
      this.setFullCommand(validKey[0]);
      return true;
    }
  }

  parseFlags(flags) {
    const validFlags = Number(flags);
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
  }

  parseExptime(exptime) {
    const validExptime = Number(exptime);
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
    const validBytes = Number(bytes);
    if (Number.isInteger(validBytes)) {
      if (validBytes >= 0) {
        this.setFullCommand(validBytes);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  setFullCommand(param) {
    this.commandToRun.push(param);
  }

  checkNoReply(params) {
    return params.includes("noreply");
  }

  cleanCommand() {
    return this.commandToRun.filter((c) => c !== undefined);
  }
}

module.exports = Parser;
