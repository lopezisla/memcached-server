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
const { ERROR, STORED } = require("../config/serverMessages");

class Executor {
  constructor() {}

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
    const [, key, flags, exptime] = command;
    if (exptime < 0) return STORED;
    return memcached.saveData(key, flags, exptime, value);
  }

  add(command, value) {
    return `this a ${command} command with value: ${value}`;
  }

  replace(command, value) {
    return `this a ${command} command with value: ${value}`;
  }

  append(command, value) {
    return `this a ${command} command with value: ${value}`;
  }

  prepend(command, value) {
    return `this a ${command} command with value: ${value}`;
  }

  cas(command, value) {
    return `this a ${command} command with value: ${value}`;
  }

  get(command) {
    command.shift();
    let message = "";
    command.forEach(key => {
        result = memcached.readData(key);
        if (result){
            message += `${result}${LINE_FEED}`;
        }
    })
    return message;
  }

  gets(command) {
    command.shift();
    cas = command.pop();
    let message = "";
    command.forEach(key => {
        result = memcached.readData(key, cas);
        if (result){
            message += `${result}${LINE_FEED}`;
        }
    })
    return message;
  }
}

module.exports = Executor;
