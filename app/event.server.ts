import { EventEmitter } from "events";

let emitter: EventEmitter;

declare global {
  var emitter: EventEmitter;
}

if (process.env.NODE_ENV === "production") {
  emitter = new EventEmitter();
} else {
  if (!global.emitter) {
    global.emitter = new EventEmitter();
  }
  emitter = global.emitter;
}

export default emitter;
