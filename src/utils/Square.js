/**
 * Square.
 */
export default class Square {
    /**
     * @param {number} side Side of square.
     */
    constructor(side) {
        this.side = side;
    }

    /**
     * Get center for tile.
     * @param {number} tileNumber Number of tile.
     * @param {number} tileSize Size of tile.
     * @param {number} scale Scale of map.
     */
    getCentersForTile(tileNumber, tileSize, scale) {
        const BETWEEN_CENTERS_OF_COLS = this.side / scale;
        const BETWEEN_CENTERS_OF_ROWS = this.side / scale;
        const COL_OFFSET = 1;
        const ROW_OFFSET = 1;
        const offset = [
            tileNumber[0] * tileSize,
            tileNumber[1] * tileSize
        ];

        const col = Math.ceil(offset[0] / BETWEEN_CENTERS_OF_COLS) - COL_OFFSET;
        const row = Math.ceil(offset[1] / BETWEEN_CENTERS_OF_ROWS) - ROW_OFFSET;
        const result = [];

        const firstSquare = [
            (col * BETWEEN_CENTERS_OF_COLS) - offset[0],
            (row * BETWEEN_CENTERS_OF_ROWS) - offset[1]
        ];

        let x = firstSquare[0];
        let y = firstSquare[1];

        while (y < tileSize + BETWEEN_CENTERS_OF_ROWS * ROW_OFFSET) {
            while (x < tileSize + BETWEEN_CENTERS_OF_COLS * COL_OFFSET) {
                result.push([x, y]);
                x += BETWEEN_CENTERS_OF_COLS;
            }
            y += BETWEEN_CENTERS_OF_ROWS;
            x = firstSquare[0];
        }
        return result;
    }

    /**
     * Get pixel vertices for tile.
     * @param {Array} [param0] Array of coordinates.
     * @param {number} scale Scale of map.
     */
    getPixelVerticesForTile([x, y], scale) {
        const side = this.side / scale;
        const top = x - side / 2;
        const left = y - side / 2;
        return [
            [top, left],
            [top, left + side],
            [top + side, left + side],
            [top + side, left]
        ];
    }

    /**
     * Get BBox
     * @param {Array} param0 Array of coordinates.
     * @param {number} offset Offset.
     * @param {number} scale Scale of map.
     */
    getBBox([x, y], offset, scale) {
        const side = this.side / scale;
        const top = x - side / 2;
        const left = y - side / 2;
        return {
            x: (top + offset[0]) * scale,
            y: (left + offset[1]) * scale,
            w: side * scale,
            h: side * scale
        };
    }
}
