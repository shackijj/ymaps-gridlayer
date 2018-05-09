import {describe, it} from 'mocha';
import {expect} from 'chai';

import identity from '../src/Boilerplate/utils/identity';

describe('identity', () => {
    it('should work', () => {
        const expected = 'It\'s work!';
        const result = identity(expected);

        expect(result).to.be.equal(expected);
    });
});
