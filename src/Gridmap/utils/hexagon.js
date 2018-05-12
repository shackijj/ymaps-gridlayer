export function getHexagonsForTile(tileNumber, tileSize, R) {
    const r = Math.sin(60 * Math.PI / 180) * R;
    const BETWEEN_CENTERS_OF_COLS = 1.5 * R;
    const BETWEEN_CENTERS_OF_ROWS = 2 * r;
    const offset = [
        tileNumber[0] * tileSize,
        tileNumber[1] * tileSize
    ];

    const col = Math.ceil(offset[0] / BETWEEN_CENTERS_OF_COLS) - 1;
    const row = Math.ceil(offset[1] / BETWEEN_CENTERS_OF_ROWS) - 1;
    const result = [];

    const firstHexagon = [
        (col * BETWEEN_CENTERS_OF_COLS) - offset[0],
        (row * BETWEEN_CENTERS_OF_ROWS) - offset[1]
    ];

    let currentColumn = col;
    let x = firstHexagon[0];
    let y = firstHexagon[1];

    while (y < tileSize + BETWEEN_CENTERS_OF_ROWS) {
        while (x < tileSize + BETWEEN_CENTERS_OF_COLS) {
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
