///<reference path="../../lib/mocha/mocha.d.ts" />
///<reference path="../../lib/node/node.d.ts" />
///<reference path="../../src/nemesis.ts" />

declare var assert: any;

suite("nemesis.config", function() {
    test("config is initialized by default", () => {
        var config = nemesis.config();

        assert.ok(config, "FAIL: config cannot be null by default");
    });

    test("properties set persist", () => {
        var config = nemesis.config();

        config.logLevel = 100;
        nemesis.config(config);

        config = nemesis.config();
        assert.equal(config.logLevel, 100, "FAIL: property set is not persistent on config")
    });

    test("custom properties can be set", () => {
        var customConfig = {
            value: 10
        };

        nemesis.config(customConfig);

        var config = nemesis.config();
        assert.equal((<any>config).value, customConfig.value, "FAIL: failed to set custom property on config");
    })
});