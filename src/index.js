import { createWorld } from "ecs";

import playerEntitySchema from "./entities/player.js";
import aiWalkSystemSchema from "./systems/ai-walk.js";
import * as components from "./components/index.js";

const parent = document.querySelector("#app");
const canvas = parent.appendChild(document.createElement("canvas"));
canvas.width = parent.getBoundingClientRect().width;
canvas.height = parent.getBoundingClientRect().height;
canvas.tabIndex = 0;
Object.assign(canvas.style, { width: "100%", height: "100%" });

const game = ({ FPS = 60 } = {}) => {
  const world = createWorld();


  const worldComponents = Object.fromEntries(
    Object.entries(components).map(([name, component]) => [
      component,
      world.createComponent(name, component),
    ])
  );


  Object.values(aiWalkSystemSchema.components).forEach((component) => {
    const system = world.createSystem("aiWalk");
    world.linkSystem(system, worldComponents[component]);
  });

  const player = world.createEntity("player");
  playerEntitySchema(canvas).forEach(({ component, value }) =>
    world.linkEntity(player, component, value)
  );

  console.log(world.data);
  return {
    start: () =>
      setTimeout(function update(lastTime = performance.now()) {
        const time = performance.now();
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        world.execute(time - lastTime, time);

        setTimeout(() => update(time), 1000 / FPS);
      }, 1000 / FPS),
  };
};

game().start();
