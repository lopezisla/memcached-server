const Memcached = require("../classes/Memcached");
const memcached = new Memcached();
const { LINE_FEED } = require("../config/constants");
const {
  CAS,
  GET,
  GETS,
  SET,
  ADD,
  REPLACE,
  APPEND,
  PREPEND,
} = require("../config/commands");
const {
  STORED,
  END,
  NOT_STORED,
  EXISTS,
  NOT_FOUND,
} = require("../config/serverMessages");

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
      case PREPEND:
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

  set(command, value, replaceOrCas = false) {
    const [, key, flags, exptime, bytes] = command;
    if (!replaceOrCas) {
      if (memcached.keyExists(key)) return EXISTS;
    }
    if (exptime < 0) return STORED;
    return memcached.createData(key, flags, exptime, bytes, value);
  }

  add(command, value) {
    const key = command[1];
    if (memcached.keyExists(key)) return NOT_STORED;
    return this.set(command, value);
  }

  replace(command, value) {
    const key = command[1];
    if (!memcached.keyExists(key)) return NOT_STORED;
    const timerId = memcached.getTimer(key);
    if (timerId) clearTimeout(timerId);
    return this.set(command, value, true);
  }

  append(command, value) {
    const [commandName, key, , , bytes] = command;
    if (!memcached.keyExists(key)) return NOT_STORED;
    return memcached.updateData(commandName, key, bytes, value);
  }

  prepend(command, value) {
    return this.append(command, value);
  }

  cas(command, value) {
    const key = command[1];
    if (!memcached.keyExists(key)) return NOT_FOUND;
    const requestedCas = Number(command[5]);
    const currentCas = memcached.getCas(key);
    if (currentCas !== requestedCas) return EXISTS;
    const timerId = memcached.getTimer(key);
    if (timerId) clearTimeout(timerId);
    return this.set(command, value, true);
  }

  get(command, cas = false) {
    command.shift();
    let message = "";
    command.forEach((key) => {
      const result = memcached.readData(key, cas);
      if (result) message += `${result}${LINE_FEED}`;
    });
    return `${message}${END}`;
  }

  gets(command) {
    return this.get(command, true);
  }
}

module.exports = Executor;
