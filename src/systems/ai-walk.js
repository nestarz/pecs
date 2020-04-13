import {
  positionComponent,
  velocityComponent,
  inputComponent,
  shapeComponent,
  rendererComponent,
} from "../components/index.js";

export default {
  components: {
    positionComponent: {
      ...positionComponent,
      mutable: true,
    },
    velocityComponent,
    inputComponent,
    shapeComponent,
    rendererComponent,
  },
  query: (results, delta, time) => {
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
  },
};
