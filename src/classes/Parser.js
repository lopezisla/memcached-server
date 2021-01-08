const Executor = require('../classes/Executor');

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
                const executor = new Executor();
                const command = this.commandToRun.filter((c) => c !== undefined);
                console.log(command);
                this.commandToRun = [];
                console.log(`check is this is empty: ${this.commandToRun}`);
                console.log(`execute ${command}`);
                return executor.execute(command);
              }
            } else {
              return `${ERROR}${LINE_FEED}`;
            }
          } else {
            return `${CLIENT_ERROR} missing parameters${LINE_FEED}`;
          }
        } else {
          const valueChunkSplit = this.dataChunk.replace(LINE_FEED, "");
          const executor = new Executor();
          const command = this.commandToRun.filter((c) => c !== undefined);
          this.commandToRun = [];
          console.log(`check is this is empty: ${this.commandToRun}`);
          this.dataChunk = "";
          console.log(`check is this.data is empty: ${this.dataChunk}`);
          console.log(`execute ${command} with value ${valueChunkSplit}`);
          return executor.execute(command, valueChunkSplit);
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
    if (STORAGE_COMMANDS.includes(fullCommand[0])) {
      const isValidKey = this.parseKey(fullCommand[1]);
      const areValidFlags = this.parseFlags(fullCommand[2]);
      const isValidExptime = this.parseExptime(fullCommand[3]);
      const areValidBytes = this.parseBytes(fullCommand[4]);
      if (
        isValidKey &&
        areValidFlags[0] &&
        isValidExptime[0] &&
        areValidBytes[0]
      ) {
        if (fullCommand[0] === CAS) {
          this.setCommand(
            fullCommand[0],
            isValidKey,
            areValidFlags[1],
            isValidExptime[1],
            areValidBytes[1],
            fullCommand[5]
          );
          return true;
        } else {
          this.setCommand(
            fullCommand[0],
            isValidKey,
            areValidFlags[1],
            isValidExptime[1],
            areValidBytes[1]
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

  parseFlags(flags) {
    const validFlags = parseInt(flags);
    return Number.isInteger(validFlags)
      ? validFlags >= 0 && validFlags <= A_16BIT_UNSIGNED_MAX_VALUE
        ? [true, validFlags]
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

  setCommand(command, key, flags, exptime, bytes, casUnique) {
    return (this.commandToRun = [
      command,
      key,
      flags,
      exptime,
      bytes,
      casUnique,
    ]);
  }
}

module.exports = Parser;
