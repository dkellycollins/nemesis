///<reference path="../../lib/mocha/mocha.d.ts" />
///<reference path="../../lib/node/node.d.ts" />
///<reference path="../../src/nemesis.ts" />

declare var assert: any;

suite("nemsis.logger", () => {
    test("error is logged with level of ALL");
    test("warn is logged with level of ALL");
    test("info is logged with level of ALL");
    test("error is logged with level of INFO");
    test("warn is logged with level of INFO");
    test("info is logged with level of INFO");
    test("error is logged with level of WARN");
    test("warn is logged with level of WARN");
    test("info is not logged with level of WARN");
    test("error is logged with level of ERROR");
    test("warn is not logged with level of ERROR");
    test("info is not logged with level of ERROR");
    test("error is not logged with level of OFF");
    test("warn is not logged with level of OFF");
    test("info is not logged with level of OFF");
})