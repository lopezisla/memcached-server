const { STORED } = require("../config/serverMessages");
const { LINE_FEED, SECOND } = require("../config/constants");

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

  saveData(key, flags, exptime, bytes, value) {
    let data = [key, flags, bytes, this.getCas(), value];
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

  readData(key, cas) {
      if (!this.cache[key]) return false;
    const dataArray = Array.from(this.cache[key]);
    console.log(`dataArray: ${dataArray}`);
    const valueDataArray = dataArray.pop();
    console.log(`valueDataArray ${valueDataArray}`);
    console.log(`dataArray: ${dataArray}`);
    if (!cas){
        dataArray.pop()
    } 
    const message = dataArray.join(" ")     
    return `VALUE ${message}${LINE_FEED}${valueDataArray}`
  }
}
module.exports = Memcached;
