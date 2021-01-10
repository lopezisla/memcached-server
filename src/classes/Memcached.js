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
    let data = [flags, value, this.getCas()];
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

  deleteData(key){
    delete this.cache[key];
  }
}
module.exports = Memcached;
