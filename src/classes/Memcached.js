class Memcached {
  constructor() {
    this.cache = {};
    if (typeof Memcached.instance === "object") {
      return Memcached.instance;
    }
    Memcached.instance = this;
    return this;
  }

  saveData({ key, flags, exptime, value }) {
    console.log(key);
    console.log(flags);
    console.log(exptime);
    console.log(value);
    return "save";
  }
}
module.exports = Memcached;
