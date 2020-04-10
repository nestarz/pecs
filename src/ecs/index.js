const insert = (database, name, value) => {
  database[name] = value;
  return name;
};

export const createWorld = () => {
  const data = {
    entities: {},
    components: {},
    systems: {},
  };

  return {
    data,
    execute: (delta) => {
      if (typeof delta !== "number") throw('delta must be number');
      Object.values(data.systems).forEach(({ fn }) => fn(delta));
    },
    createComponent: (name, value) => insert(data.components, name, value),
    createEntity: () =>
      insert(data.entities, Math.random(), {
        components: {},
      }),
    createSystem: (name) =>
      insert(data.systems, name, {
        components: {},
      }),
    linkSystem: (systemId, componentId) =>
      insert(data.systems[systemId].components, componentId),
    linkEntity: (entityId, componentId, componentValue) =>
      insert(data.entities[entityId].components, componentId, componentValue),
    querySystem: (name, fn) => {
      data.systems[name].fn = (delta) => {
        const results = Object.values(data.entities)
          .filter((entity) =>
            Object.keys(
              data.systems[name].components
            ).every((systemComponent) =>
              Object.keys(entity.components).includes(systemComponent)
            )
          ).map(entity => entity.components)

        if (results.length) {
          fn(results, delta);
        }
      };
    },
  };
};
