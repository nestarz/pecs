const handler = {
  get(target, property, receiver) {
    if (property in target) return Reflect.get(target, property, receiver);
    if (property === "then") return; // ?
    throw new Error(`AttributeError: object has no attribute '${property}'`);
  },
  set(target, property, value, receiver) {
    if (property in target)
      return Reflect.set(target, property, value, receiver);
    if (property === "then") return; // ?
    throw new Error(`AttributeError: object has no attribute '${property}'`);
  },
};

export const safe = (obj) => new Proxy(obj, handler);
export const freeze = (obj) => new Proxy(Object.freeze(obj), handler);
