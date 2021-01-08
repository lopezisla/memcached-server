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

class Executor {
  constructor(command, value) {
    this.command = command;
    this.value = value;
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
    return `this a ${command} command with value: ${value}`;
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

  get(command, value) {
    return `this a ${command} command`;
  }

  gets(command, value) {
    return `this a ${command} command`;
  }
}
module.exports = Executor;
