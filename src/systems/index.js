import { System } from "ecsy";

import { Velocity, Position } from "components/index.js";

export class MovableSystem extends System {
  execute(delta) {
    this.queries.moving.results.forEach((entity) => {
      const velocity = entity.getComponent(Velocity);
      const position = entity.getMutableComponent(Position);
      const distance = velocity.multiplyScalar(delta);

      position.add(distance);
    });
  }
}

MovableSystem.queries = {
  moving: {
    components: [Velocity, Position],
  },
};
