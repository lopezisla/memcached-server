const Memcached = require("../classes/Memcached");
const memcached = new Memcached();

const {
  CAS,
  GET,
  GETS,
  SET,
  ADD,
  REPLACE,
  APPEND,
  PREPREND,
} = require("../config/commands");

const { LINE_FEED } = require("../config/constants.js");

class Executor {
  constructor() {
    
  }

  execute(command, value) {
    const commandName = command[0];
    switch (commandName) {
      case SET:
        return this.set(command, value);
      case ADD:
        return this.add(command, value);
      case REPLACE:
        return this.replace(command, value);
      case APPEND:
        return this.append(command, value);
      case PREPREND:
        return this.prepend(command, value);
      case CAS:
        return this.cas(command, value);
      case GET:
        return this.get(command);
      case GETS:
        return this.gets(command);
      default:
        break;
    }
  }

  set(command, value) {
      console.log(command);
    return `this a ${command} command with value: ${value}${LINE_FEED}`;
  }

  add(command, value) {
    return `this a ${command} command with value: ${value}${LINE_FEED}`;
  }

  replace(command, value) {
    return `this a ${command} command with value: ${value}${LINE_FEED}`;
  }

  append(command, value) {
    return `this a ${command} command with value: ${value}${LINE_FEED}`;
  }

  prepend(command, value) {
    return `this a ${command} command with value: ${value}${LINE_FEED}`;
  }

  cas(command, value) {
    return `this a ${command} command with value: ${value}${LINE_FEED}`;
  }

  get(command) {
    console.log(command);
    return `this a ${command} command${LINE_FEED}`;
  }

  gets(command) {
    return `this a ${command} command${LINE_FEED}`;
  }
}
module.exports = Executor;
