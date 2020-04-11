import { createWorld } from "./ecs/index.js";

class InputSystem {
  constructor(DOMNode) {
    this.keydown = {};
    DOMNode.addEventListener("keyup", ({ code }) => {
      this.keydown[code] = false;
    });
    DOMNode.addEventListener("keydown", ({ code }) => {
      this.keydown[code] = true;
    });
  }
}

const game = ({ FPS = 60 } = {}) => {
  const world = createWorld();

  const positionComponent = world.createComponent("position", {
    x: Number,
    y: Number,
  });
  const velocityComponent = world.createComponent("velocity", {
    x: Number,
    y: Number,
  });
  const shapeComponent = world.createComponent("shape", {
    color: String,
    size: Object,
  });
  const rendererComponent = world.createComponent("renderer", {
    context2d: CanvasRenderingContext2D,
  });
  const inputComponent = world.createComponent("input", {
    system: InputSystem,
  });
  const enemyComponent = world.createComponent("enemy", {});

  const renderSystem = world.createSystem("render");
  world.linkSystem(renderSystem, positionComponent);
  world.linkSystem(renderSystem, shapeComponent);
  world.linkSystem(renderSystem, rendererComponent, { mutable: true });
  world.querySystem(renderSystem, (results) => {
    results.forEach(({ renderer, position, shape }) => {
      renderer.context2d.fillStyle = shape.color;
      renderer.context2d.fillRect(
        position.x,
        position.y,
        shape.size.x,
        shape.size.y
      );
    });
  });

  const walkSystem = world.createSystem("walk");
  world.linkSystem(walkSystem, positionComponent, { mutable: true });
  world.linkSystem(walkSystem, velocityComponent);
  world.linkSystem(walkSystem, inputComponent);
  world.linkSystem(walkSystem, rendererComponent);
  world.querySystem(walkSystem, (results, delta) => {
    results.forEach(({ renderer, position, velocity, input }) => {
      const direction = {
        x: input.system.keydown.KeyA ? -1 : input.system.keydown.KeyD ? 1 : 0,
        y: input.system.keydown.KeyW ? -1 : input.system.keydown.KeyS ? 1 : 0,
      };
      position.x = Math.max(0, position.x + direction.x * velocity.x * delta);
      position.x = Math.min(renderer.context2d.canvas.width, position.x);
      position.y = Math.max(0, position.y + direction.y * velocity.y * delta);
      position.y = Math.min(renderer.context2d.canvas.height, position.y);
    });
  });

  const aiWalkSystem = world.createSystem("aiWalk");
  world.linkSystem(aiWalkSystem, positionComponent, { mutable: true });
  world.linkSystem(aiWalkSystem, velocityComponent);
  world.linkSystem(aiWalkSystem, enemyComponent);
  world.linkSystem(aiWalkSystem, rendererComponent);
  world.querySystem(aiWalkSystem, (results, delta, time) => {
    results.forEach(({ renderer, position, velocity }) => {
      const direction = {
        x: time % 1000 < delta ? (Math.random() > 0.5 ? -1 : 1) : 0,
        y: time % 1000 < delta ? (Math.random() > 0.5 ? -1 : 1) : 0,
      };
      position.x = Math.max(0, position.x + direction.x * velocity.x * delta);
      position.x = Math.min(renderer.context2d.canvas.width, position.x);
      position.y = Math.max(0, position.y + direction.y * velocity.y * delta);
      position.y = Math.min(renderer.context2d.canvas.height, position.y);
    });
  });

  const parent = document.querySelector("#app");
  const canvas = parent.appendChild(document.createElement("canvas"));
  canvas.width = parent.getBoundingClientRect().width;
  canvas.height = parent.getBoundingClientRect().height;
  canvas.tabIndex = 0;
  Object.assign(canvas.style, { width: "100%", height: "100%" });

  const playerEntity = world.createEntity("player");
  world.linkEntity(playerEntity, positionComponent, {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
  });
  world.linkEntity(playerEntity, velocityComponent, {
    x: 1,
    y: 1,
  });
  world.linkEntity(playerEntity, shapeComponent, {
    color: "black",
    size: { x: 200, y: 120 },
  });
  world.linkEntity(playerEntity, rendererComponent, {
    context2d: canvas.getContext("2d"),
  });
  world.linkEntity(playerEntity, inputComponent, {
    system: new InputSystem(canvas),
  });

  for (let i = 0; i < 10; i++) {
    const wolfEntity = world.createEntity("wolf"+i);
    world.linkEntity(wolfEntity, positionComponent, {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
    });
    world.linkEntity(wolfEntity, velocityComponent, {
      x: 1,
      y: 1,
    });
    world.linkEntity(wolfEntity, shapeComponent, {
      color: "red",
      size: { x: 100, y: 60 },
    });
    world.linkEntity(wolfEntity, rendererComponent, {
      context2d: canvas.getContext("2d"),
    });
    world.linkEntity(wolfEntity, enemyComponent, {});
  }

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
