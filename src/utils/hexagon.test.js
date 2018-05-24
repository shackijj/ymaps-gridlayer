import Hexagon from './Hexagon';
import {sin} from './geometry';
import {expect} from 'chai';

describe('getCentersOfHexagonsForTile', () => {
    let R;
    let actual;
    let tileSize;
    let tileNumber;
    let hexagon;

    beforeEach(() => {
        hexagon = new Hexagon(R);
        actual = hexagon.getCentersForTile(tileNumber, tileSize, 1);
    });

    // eslint-disable-next-line
    describe('hexagons are generated with one extra column and one extra row in order to cover the whole area of a square tile', () => {
        function testsForBigRadiusAndTileSize(bigRadius, size, tiles) {
            tiles.forEach(({tile, expected}) => {
                describe(`given that tileNumber is [${tile[0]}, ${tile[1]}]`, () => {
                    before(() => {
                        R = bigRadius;
                        tileNumber = tile;
                        tileSize = size;
                    });
                    it(`will return ${JSON.stringify(expected)}`, () => {
                        expect(actual).to.eql(expected);
                    });
                });
            });
        }

        describe('given that R is 2 and tileSize is 4', () => {
            const R = 2;
            const tileSize = 4;
            const r = R * sin(60);
            const BETWEEN_CENTERS_OF_COLS = 1.5 * R;
            const BETWEEN_CENTERS_OF_ROWS = 2 * r;

            testsForBigRadiusAndTileSize(R, tileSize, [
                {
                    tile: [0, 0],
                    expected: [
                        // row -1
                        [BETWEEN_CENTERS_OF_COLS * -1, BETWEEN_CENTERS_OF_ROWS * -1 + r],
                        [BETWEEN_CENTERS_OF_COLS * 0, BETWEEN_CENTERS_OF_ROWS * -1],
                        [BETWEEN_CENTERS_OF_COLS, BETWEEN_CENTERS_OF_ROWS * -1 + r],
                        [BETWEEN_CENTERS_OF_COLS * 2, BETWEEN_CENTERS_OF_ROWS * -1],
                        // row 0
                        [BETWEEN_CENTERS_OF_COLS * -1, 0 + r],
                        [0, 0],
                        [BETWEEN_CENTERS_OF_COLS, 0 + r],
                        [BETWEEN_CENTERS_OF_COLS * 2, 0],
                        // row 1
                        [BETWEEN_CENTERS_OF_COLS * -1, BETWEEN_CENTERS_OF_ROWS + r],
                        [BETWEEN_CENTERS_OF_COLS * 0, BETWEEN_CENTERS_OF_ROWS],
                        [BETWEEN_CENTERS_OF_COLS, BETWEEN_CENTERS_OF_ROWS + r],
                        [BETWEEN_CENTERS_OF_COLS * 2, BETWEEN_CENTERS_OF_ROWS],
                        // row 2
                        [BETWEEN_CENTERS_OF_COLS * -1, BETWEEN_CENTERS_OF_ROWS * 2 + r],
                        [BETWEEN_CENTERS_OF_COLS * 0, BETWEEN_CENTERS_OF_ROWS * 2],
                        [BETWEEN_CENTERS_OF_COLS, BETWEEN_CENTERS_OF_ROWS * 2 + r],
                        [BETWEEN_CENTERS_OF_COLS * 2, BETWEEN_CENTERS_OF_ROWS * 2]
                    ]
                }
            ]);

            const firstHexOffset = [-2, 0];
            const colMin1 = BETWEEN_CENTERS_OF_COLS * -1 - firstHexOffset[0];
            const col0 = 0 - firstHexOffset[0];
            const col1 = BETWEEN_CENTERS_OF_COLS - firstHexOffset[0];
            testsForBigRadiusAndTileSize(R, tileSize, [
                {
                    tile: [1, 0],
                    expected: [
                        // row -1
                        [colMin1, BETWEEN_CENTERS_OF_ROWS * -1 + r],
                        [col0, BETWEEN_CENTERS_OF_ROWS * -1],
                        [col1, BETWEEN_CENTERS_OF_ROWS * -1 + r],
                        // row 0
                        [colMin1, 0 + r],
                        [col0, 0],
                        [col1, 0 + r],
                        // row 1
                        [colMin1, BETWEEN_CENTERS_OF_ROWS + r],
                        [col0, BETWEEN_CENTERS_OF_ROWS],
                        [col1, BETWEEN_CENTERS_OF_ROWS + r],
                        // row 2
                        [colMin1, BETWEEN_CENTERS_OF_ROWS * 2 + r],
                        [col0, BETWEEN_CENTERS_OF_ROWS * 2],
                        [col1, BETWEEN_CENTERS_OF_ROWS * 2 + r]
                    ]
                }
            ]);
        });
    });
});
