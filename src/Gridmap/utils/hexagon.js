export function getPositionOfTheFirstHexagon(tileNumber, tileSize, R) {
    const r = Math.sin(60 * Math.PI / 180) * R;
    const BETWEEN_CENTERS_OF_COLS = 1.5 * R;
    const BETWEEN_CENTERS_OF_ROWS = 2 * r;
    const offset = [
        tileNumber[0] * tileSize,
        tileNumber[1] * tileSize
    ];
    const col = Math.ceil(offset[0] / BETWEEN_CENTERS_OF_COLS);
    const row = Math.ceil(offset[1] / BETWEEN_CENTERS_OF_ROWS);
    const horizontalShift = col % 2 === 0 ? 0 : r;
    return [
        (col * BETWEEN_CENTERS_OF_COLS) - offset[0],
        (row * BETWEEN_CENTERS_OF_ROWS) + horizontalShift - offset[1]
    ];
}
