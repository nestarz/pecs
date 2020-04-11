const handler = {
  get(target, property, receiver) {
    if (property in target) return Reflect.get(target, property, receiver);
    if (property === "then") return; // ?
    throw new Error(`AttributeError: object has no attribute '${property}'`);
  },
  set(target, property, value, receiver) {
    if (!(Object(value) instanceof Object(target[property]).constructor))
      throw new Error(
        `TypeError: value ${value} do not match type '${
          Object(target[property]).constructor.name
        }'`
      );
    if (!(property in target))
      throw new Error(`AttributeError: object has no attribute '${property}'`);
    return Reflect.set(target, property, value, receiver);
  },
};

export const safe = (obj) => new Proxy(obj, handler);
export const freeze = (obj) => new Proxy(Object.freeze(obj), handler);
