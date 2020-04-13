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
  query: (results, delta) => {
    results.forEach(
      ({
        renderer: { context2d },
        position,
        velocity,
        shape: { size },
        input: { recorder },
      }) => {
        const direction = {
          x: recorder.keydown.KeyA ? -1 : recorder.keydown.KeyD ? 1 : 0,
          y: recorder.keydown.KeyW ? -1 : recorder.keydown.KeyS ? 1 : 0,
        };
        position.x = position.x + direction.x * velocity.x * delta;
        position.x = Math.max(0, position.x);
        position.x = Math.min(context2d.canvas.width - size.x, position.x);
        position.y = position.y + direction.y * velocity.y * delta;
        position.y = Math.max(0, position.y);
        position.y = Math.min(context2d.canvas.height - size.y, position.y);
      }
    );
  },
};
