///<reference path="../../lib/mocha/mocha.d.ts" />
///<reference path="../../lib/node/node.d.ts" />
///<reference path="../../src/nemesis.ts" />

declare var assert: any;

suite("nemesis.eventObject", () => {

    test("raise event with no listeners", () => {
        //Arange
        var e = new nemesis.eventObject();

        //Act
        e.emit("testEvent");

        //Assert
    });

    test("raise event with one listener", (done) => {
        var e = new nemesis.eventObject();
        e.on("testEvent", () => {
            done();
        });

        e.emit("testEvent");
    });

    test("raise event with arguments", (done) => {
        var e = new nemesis.eventObject();
        var testValue = 3;
        e.on("testEvent", (value) => {
            assert.equal(testValue, value);
            done();
        });

        e.emit("testEvent", testValue);
    });

    test("raise event when multiple events registered", (done) => {
        var e = new nemesis.eventObject();
        e.on("goodEvent", () => {
            done();
        });
        e.on("badEvent", () => {
            throw "badEvent was called";
        });

        e.emit("goodEvent");
    });

    test("unsubscribe event listener", (done) => {
        var e = new nemesis.eventObject();
        var handler1 = e.on("testEvent", () => {
            throw "removed handler called";
        });
        var handler2 = e.on("testEvent", () => {
            done();
        });

        handler1();
        e.emit("testEvent");
    });
});