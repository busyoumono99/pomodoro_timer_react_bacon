import Bacon from 'baconjs';

export default class {
  constructor() {
    this.busCache = {};  // Bus == Subject in Rx
  }
  stream(name) {
    return this.bus(name)
  }

  push(name, value) {
    this.bus(name).push(value)
  }

  plug(name, value) {
    this.bus(name).plug(value)
  }

  //これはprivate関数かも
  bus(name) {
    return this.busCache[name] = this.busCache[name] || new Bacon.Bus()
  }
};
