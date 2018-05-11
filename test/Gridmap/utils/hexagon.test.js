import {getPositionOfTheFirstHexagon} from '../../../src/Gridmap/utils/hexagon';
import {expect} from 'chai';

describe('hexagonOffset', () => {
    let R;
    let output;
    let tileSize;
    let tileNumber;

    beforeEach(() => {
        output = getPositionOfTheFirstHexagon(tileNumber, tileSize, R);
    });

    describe('given that the first hexagon is drawn in the origin 0, 0', () => {
        function testsForBigRadiusAndTileSize(bigRadius, size, tiles) {
            describe(`given that bigRadius equals ${bigRadius} and tileSize equals ${size}`, () => {
                before(() => {
                    R = bigRadius;
                    tileSize = size;
                });
                tiles.forEach(({tile, expected}) => {
                    describe(`given that tileNumber is [${tile[0]}, ${tile[1]}]`, () => {
                        before(() => {
                            tileNumber = tile;
                        });
                        it(`will return [${expected[0]}, ${expected[1]}]`, () => {
                            expect(output).to.eql(expected);
                        });
                    });
                });
            });
        }

        testsForBigRadiusAndTileSize(1, 3, [
            {
                tile: [0, 0],
                expected: [0, 0]
            },
            {
                tile: [1, 0],
                expected: [3, 0]
            },
            {
                tile: [0, 1],
                expected: [0, 3.4641016151377544]
            }
        ]);

        testsForBigRadiusAndTileSize(2, 3, [
            {
                tile: [0, 0],
                expected: [0, 0]
            },
            {
                tile: [1, 0],
                expected: [3, 1.7320508075688772]
            }
        ]);
    });
});
