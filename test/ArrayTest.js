///<reference path="../lib/mocha/mocha.d.ts" />
///<reference path="../util/requirejs/require.d.ts" />
var assert = require("assert");

describe('Array', function () {
    describe('#indexOf()', function () {
        it('returns -1 when the value is not present', function () {
            assert.equal(-1, [1, 2, 3].indexOf(5));
            assert.equal(-1, [1, 2, 3].indexOf(0));
        });
    });
});
//# sourceMappingURL=ArrayTest.js.map
