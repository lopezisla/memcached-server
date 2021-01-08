class Memcached {
  constructor() {
    this.cache = {};
    if (typeof Memcached.instance === "object") {
      return Memcached.instance;
    }
    Memcached.instance = this;
    return this;
  }
}
module.exports = Memcached;