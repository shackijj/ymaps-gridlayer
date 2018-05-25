import {sin, cos} from './geometry';
/**
 * Hexagon.
 * Calculate hexagon grid.
 */
export default class Hexagon {
    /**
     * @param {number} R Radius of hexagon.
     */
    constructor(R) {
        this.R = R;
    }

    /**
     * Get center for tile.
     * @param {number} tileNumber Number of tile.
     * @param {number} tileSize Size of tile.
     * @param {number} scale Scale of map.
     */
    getCentersForTile(tileNumber, tileSize, scale) {
        const R = this.R / scale;
        const r = sin(60) * R;
        const BETWEEN_CENTERS_OF_COLS = 1.5 * R;
        const BETWEEN_CENTERS_OF_ROWS = 2 * r;
        const COL_OFFSET = 1;
        const ROW_OFFSET = 1;
        const offset = [
            tileNumber[0] * tileSize,
            tileNumber[1] * tileSize
        ];

        const col = Math.ceil(offset[0] / BETWEEN_CENTERS_OF_COLS) - COL_OFFSET;
        const row = Math.ceil(offset[1] / BETWEEN_CENTERS_OF_ROWS) - ROW_OFFSET;
        const result = [];

        const firstHexagon = [
            (col * BETWEEN_CENTERS_OF_COLS) - offset[0],
            (row * BETWEEN_CENTERS_OF_ROWS) - offset[1]
        ];

        let currentColumn = col;
        let x = firstHexagon[0];
        let y = firstHexagon[1];

        while (y < tileSize + BETWEEN_CENTERS_OF_ROWS * ROW_OFFSET) {
            while (x < tileSize + BETWEEN_CENTERS_OF_COLS * COL_OFFSET) {
                const horizontalShift = currentColumn % 2 === 0 ? 0 : r;
                result.push([x, y + horizontalShift]);
                currentColumn++;
                x += BETWEEN_CENTERS_OF_COLS;
            }
            y += BETWEEN_CENTERS_OF_ROWS;
            x = firstHexagon[0];
            currentColumn = col;
        }
        return result;
    }

    /**
     * Get pixel vertices for tile.
     * @param {Array} [param0] Array of coordinates.
     * @param {number} scale Scale of map.
     */
    getPixelVerticesForTile([x, y], scale) {
        const R = this.R / scale;
        const hexagon = [
            [cos(0), sin(0)],
            [cos(60), sin(60)],
            [cos(120), sin(120)],
            [cos(180), sin(180)],
            [cos(240), sin(240)],
            [cos(300), sin(300)],
            [cos(0), sin(0)]
        ];

        return hexagon.map(([hX, hY]) => [
            (x + (hX * R)),
            (y + (hY * R))
        ]);
    }

    /**
     * Get BBox
     * @param {Array} param0 Array of coordinates.
     * @param {number} offset Offset.
     * @param {number} scale Scale of map.
     */
    getBBox([x, y], offset, scale) {
        const R = this.R / scale;
        const r = sin(60) * R;
        return {
            x: ((x + offset[0]) - R) * scale,
            y: ((y + offset[1]) - r) * scale,
            w: 2 * R * scale,
            h: 2 * r * scale
        };
    }
}
