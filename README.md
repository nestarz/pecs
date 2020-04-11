# PECS, a small ECS attempt without class

## Run

```
python -m http.server 8080 --bind 127.0.0.1
```

## Example

```javascript
import { createWorld } from "pecs";

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

  const movableSystem = world.createSystem("movable");
  world.linkSystem(movableSystem, positionComponent, { mutable: true });
  world.linkSystem(movableSystem, velocityComponent);
  world.linkSystem(movableSystem, rendererComponent);
  world.querySystem(movableSystem, (results, delta) => {
    results.map(({ position, velocity, renderer }) => {
      position.x += delta * velocity.x;
      position.y += delta * velocity.y;
      if (position.x > renderer.context2d.canvas.width) position.x = 0;
      if (position.x < 0) position.x = renderer.context2d.canvas.width;
      if (position.y > renderer.context2d.canvas.height) position.y = 0;
      if (position.y < 0) position.y = renderer.context2d.canvas.height;
    });
  });

  const renderSystem = world.createSystem("render");
  world.linkSystem(renderSystem, positionComponent);
  world.linkSystem(renderSystem, shapeComponent);
  world.linkSystem(renderSystem, rendererComponent, { mutable: true });
  world.querySystem(renderSystem, (results) => {
    results.forEach((entity, i) => {
      entity.renderer.context2d.fillStyle = entity.shape.color;
      entity.renderer.context2d.fillRect(
        entity.position.x,
        entity.position.y,
        entity.shape.size.x,
        entity.shape.size.y
      );
    });
  });

  const canvas = document.body.appendChild(document.createElement("canvas"));
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  for (let i = 0; i < 400; i++) {
    const entity = world.createEntity();
    world.linkEntity(entity, positionComponent, {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
    });
    world.linkEntity(entity, velocityComponent, {
      x: Math.random() / 10,
      y: Math.random() / 10,
    });
    world.linkEntity(entity, shapeComponent, {
      color: "red",
      size: { x: 10, y: 10 },
    });
    world.linkEntity(entity, rendererComponent, {
      context2d: canvas.getContext("2d"),
    });
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
```