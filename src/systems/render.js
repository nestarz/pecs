import {
  positionComponent,
  shapeComponent,
  rendererComponent,
} from "../components/index.js";

export default {
  components: {
    positionComponent,
    shapeComponent,
    rendererComponent: {
      ...rendererComponent,
      mutable: true,
    },
  },
  query: (results) => {
    results.forEach(({ renderer, position, shape }) => {
      renderer.context2d.fillStyle = shape.color;
      renderer.context2d.fillRect(
        position.x,
        position.y,
        shape.size.x,
        shape.size.y
      );
    });
  },
};
