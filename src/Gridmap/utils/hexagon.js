export function sin(angle) {
    return Math.sin(angle * Math.PI / 180);
}

export function getCentersOfHexagonsForTile(tileNumber, tileSize, R) {
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
