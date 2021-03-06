import { safe } from "./safe.js";

const insert = (database, name, value) => {
  database[name] = safe(value);
  return name;
};

const sameStruct = (struct, value) =>
  Object.entries(struct).every(([key, type]) =>
    type instanceof Array
      ? type.some((t) => Object(value[key]) instanceof t)
      : Object(value[key]) instanceof type
  ) && Object.keys(value).every((key) => typeof struct[key] !== "undefined");

export const createWorld = () => {
  const data = {
    entities: {},
    components: {},
    systems: {},
  };

  return {
    data: Object.freeze(data),
    execute: (delta, time) => {
      if (typeof delta !== "number") throw "delta must be number";
      Object.values(data.systems).forEach(({ query }) => query(delta, time));
    },
    createComponent: (name, value) => insert(data.components, name, value),
    createEntity: (name = Math.random()) =>
      insert(data.entities, name, {
        components: {},
      }),
    removeEntity: (name) => {
      if (!(name in data.entities))
        throw Error(`removeEntity: no name ${name} found in entities`);
      delete data.entities[name];
    },
    createSystem: (name) =>
      insert(data.systems, name, {
        components: {},
        query: () => null,
      }),
    linkSystem: (systemId, componentId, { mutable = false } = {}) =>
      insert(data.systems[systemId].components, componentId, {
        id: componentId,
        mutable,
      }),
    linkEntity: (entityId, componentId, componentValue) => {
      if (!sameStruct(data.components[componentId], componentValue)) {
        console.error(
          componentValue,
          `do not match struct`,
          data.components[componentId]
        );
        throw Error("Unmatch struct");
      }

      insert(
        data.entities[entityId].components,
        componentId,
        safe({ ...componentValue })
      );
    },
    querySystem: (name, fn) => {
      const query = () =>
        Object.values(data.entities)
          .filter((entity) =>
            Object.values(
              data.systems[name].components
            ).every((systemComponent) =>
              Object.keys(entity.components).includes(systemComponent.id)
            )
          )
          .map(({ components }) =>
            Object.fromEntries(
              Object.entries(components)
                .filter(
                  ([componentId, _]) =>
                    componentId in data.systems[name].components
                )
                .map(([componentId, component]) =>
                  data.systems[name].components[componentId].mutable
                    ? [componentId, component]
                    : [componentId, Object.freeze({ ...component })]
                )
            )
          );

      data.systems[name].query = (delta, time) => {
        const results = query();
        if (results.length) {
          fn(results, delta, time);
        }
      };
    },
  };
};
