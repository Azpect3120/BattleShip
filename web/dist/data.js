export var Ships;
(function (Ships) {
    Ships[Ships["Carrier"] = 0] = "Carrier";
    Ships[Ships["Battleship"] = 1] = "Battleship";
    Ships[Ships["Cruiser"] = 2] = "Cruiser";
    Ships[Ships["Submarine"] = 3] = "Submarine";
    Ships[Ships["Destroyer"] = 4] = "Destroyer";
})(Ships || (Ships = {}));
;
export var Direction;
(function (Direction) {
    Direction[Direction["Horizontal"] = 0] = "Horizontal";
    Direction[Direction["Vertical"] = 1] = "Vertical";
})(Direction || (Direction = {}));
const SHIP_MAP = new Map([
    [Ships.Carrier, 5],
    [Ships.Battleship, 4],
    [Ships.Cruiser, 3],
    [Ships.Submarine, 3],
    [Ships.Destroyer, 2],
]);
export class Ship {
    /**
     * Creates a new ship. If the coordinates are invalid, an error is thrown.
     */
    constructor(type, start, end) {
        /**
         * The size of the ship. The size is the number of cells the
         * ship occupies. This value is defined by the `SHIP_MAP` and
         * is immutable. This value is set when constructing the ship.
         */
        this.size_p = 0;
        this.type_p = type;
        this.size_p = SHIP_MAP.get(type) || 0;
        this.start = start;
        this.end = end;
        // Set the direction
        if (start.x === end.x) {
            this.direction_p = Direction.Vertical;
        }
        else if (start.y === end.y) {
            this.direction_p = Direction.Horizontal;
        }
        else {
            throw new Error("Invalid ship coordinates");
        }
    }
    /**
     * Returns the type of the ship. This might be useless.
     */
    type() {
        return this.type_p;
    }
    /**
     * Returns the size of the ship.
     */
    size() {
        return this.size_p;
    }
    /**
     * Returns the direction of the ship.
     */
    direction() {
        return this.direction_p;
    }
    /**
     * If the target coordinate intersects with the ship, return true.
     */
    intersects(target) {
        // Ship direction to simplify the logic
        if (this.direction_p === Direction.Vertical) {
            // The target is on the same vertical line as the ship
            if (target.x === this.start.x) {
                if (target.y >= this.start.y && target.y <= this.end.y) {
                    return true;
                }
            }
        }
        else if (this.direction_p === Direction.Horizontal) {
            // The target is on the same horizonta line as the ship
            if (target.y === this.start.y) {
                if (target.x >= this.start.x && target.x <= this.end.x) {
                    return true;
                }
            }
        }
        return false;
    }
}
