const { STORED } = require("../config/serverMessages");
const { SECOND } = require("../config/constants");

class Memcached {
  constructor() {
    this.cache = {};
    this.casUnique = 1;
    //check if a memcached instance has already been created - Singleton Pattern
    if (typeof Memcached.instance === "object") {
      return Memcached.instance;
    }
    Memcached.instance = this;
    return this;
  }

  saveData(key, flags, exptime, value) {
    let data = [key, flags, this.getCas(), value];
    console.log(data);
    this.cache[key] = data;
    console.log(this.cache[key]);
    console.log(this.cache);
    if (exptime > 0) {
      setTimeout(() => {
        this.deleteData(key);
        console.log(this.cache);
      }, exptime * SECOND);
    }
    return STORED;
  }

  getCas() {
    const casUnique = this.casUnique;
    this.casUnique++;
    return casUnique;
  }

  deleteData(key) {
    delete this.cache[key];
  }

  readData(key, cas = false) {
    const dataArray = this.cache[key];
    if (!dataArray) return false;
    const valueDataArray = dataArray.pop();
    return cas
      ? `VALUE ${dataArray}${LINE_FEED}${valueDataArray}`
      : `VALUE ${dataArray.pop()}${LINE_FEED}${valueDataArray}`;
  }
}
module.exports = Memcached;
