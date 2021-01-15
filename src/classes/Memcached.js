const { STORED } = require("../config/serverMessages");
const { LINE_FEED, SECOND } = require("../config/constants");
const { APPEND } = require("../config/commands");

class Memcached {
  constructor() {
    this.cache = {};
    this.casUnique = 1;

    //check if a memcached instance has already been created - Singleton Pattern
    if (typeof Memcached.instance === "object") return Memcached.instance;
    Memcached.instance = this;
    return this;
  }

  createData(key, flags, exptime, bytes, value) {
    if (exptime > 0) exptime = this.setTimer(key, exptime);
    const data = [key, flags, this.setCas(), bytes, exptime, value];
    this.cache[key] = data;
    return STORED;
  }

  readData(key, cas) {
    if (!this.keyExists(key)) return false;
    const dataArray = Array.from(this.cache[key]);
    const valueDataArray = dataArray.pop();
    dataArray.pop();
    dataArray.pop();
    if (!cas) dataArray.pop();
    const message = dataArray.join(" ");
    return `VALUE ${message}${LINE_FEED}${valueDataArray}`;
  }

  updateData(commandName, key, bytes, value) {
    this.cache[key][2] = this.setCas();
    this.cache[key][3] = Number(this.cache[key][3]) + Number(bytes);
    if (commandName === APPEND) {
      this.cache[key][5] = `${this.cache[key][5]}${value}`;
    } else {
      this.cache[key][5] = `${value}${this.cache[key][5]}`;
    }
    return STORED;
  }

  deleteData(key) {
    delete this.cache[key];
  }

  setCas() {
    const casUnique = this.casUnique;
    this.casUnique++;
    return casUnique;
  }

  getCas(key) {
    return this.cache[key][2];
  }

  keyExists(key) {
    return Boolean(this.cache[key]);
  }

  setTimer(key, exptime) {
    return setTimeout(() => {
        this.deleteData(key);
      }, exptime * SECOND);
  }

  getTimer(key){
    return this.cache[key][4];
  }

}

module.exports = Memcached;
