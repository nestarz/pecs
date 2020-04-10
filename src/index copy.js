import { World } from "ecsy";
import { Velocity, Position } from "components/index.js";
import { MovableSystem } from "systems/index.js";
import { Vector2 } from "math/Vector2.js";

const FPS = 50;

const Game = () => {
  const world = new World().registerSystem(MovableSystem);

  const entity = world
    .createEntity()
    .addComponent(Position, new Position(0, 10))
    .addComponent(Velocity, new Velocity(0, 10))

  console.log(entity);

  return {
    start: () => {
      setTimeout(function update(lastTime) {
        const time = performance.now();
        world.execute(time - lastTime, time);

        setTimeout(() => update(time), 1000 / FPS);
      }, 1000 / FPS);
    },
  };
};

Game().start();
