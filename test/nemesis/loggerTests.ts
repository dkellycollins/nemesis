///<reference path="../../lib/mocha/mocha.d.ts" />
///<reference path="../../lib/node/node.d.ts" />
///<reference path="../../src/nemesis.ts" />

declare var assert: any;

class mockLogWrtier implements nemesis.ILogWriter {
    constructor(private _logLevel: nemesis.logLevel) {
        
    }
    
    public error(msg: string, error: ExceptionInformation) {
        assert.fail(nemesis.logLevel.ERROR, this._logLevel, "FAIL: ERROR should not have been logged.");
    }
    
    public warn(msg: string, error?: ExceptionInformation) {
        assert.fail(nemesis.logLevel.WARN, this._logLevel, "FAIL: WARN should not have been logged.");
    }
    
    public info(msg: string) {
        assert.fail(nemesis.logLevel.INFO, this._logLevel, "FAIL: INFO should not have been logged.")
    }
}

suite("nemsis.logger", () => {
    test("error is logged with level of ALL", function (done) {
        var logWriter = new mockLogWrtier(nemesis.logLevel.ALL);
        logWriter.error = function () {
            done();
        };
        nemesis.config({ logLevel: nemesis.logLevel.ALL });
        
        nemesis.logger.addWriter(logWriter);
        
        nemesis.logger.error("Test Message", null);
    });
    
    test("warn is logged with level of ALL", function (done) {
        var logWriter = new mockLogWrtier(nemesis.logLevel.ALL);
        logWriter.warn = function () {
            done();
        };
        nemesis.config({ logLevel: nemesis.logLevel.ALL });
        
        nemesis.logger.addWriter(logWriter);
        
        nemesis.logger.warn("Test Message");
    });
    
    test("info is logged with level of ALL", function (done) {
        var logWriter = new mockLogWrtier(nemesis.logLevel.ALL);
        logWriter.info = function () {
            done();
        };
        nemesis.config({ logLevel: nemesis.logLevel.ALL });
        
        nemesis.logger.addWriter(logWriter);
        
        nemesis.logger.info("Test Message");
    });
    
    test("error is logged with level of INFO", function (done) {
        var logWriter = new mockLogWrtier(nemesis.logLevel.INFO);
        logWriter.error = function () {
            done();
        };
        nemesis.config({ logLevel: nemesis.logLevel.INFO });
        
        nemesis.logger.addWriter(logWriter);
        
        nemesis.logger.error("Test Message", null);
    });
    
    test("warn is logged with level of INFO", function (done) {
        var logWriter = new mockLogWrtier(nemesis.logLevel.INFO);
        logWriter.warn = function () {
            done();
        };
        nemesis.config({ logLevel: nemesis.logLevel.INFO });
        
        nemesis.logger.addWriter(logWriter);
        
        nemesis.logger.warn("Test Message");
    });
    
    test("info is logged with level of INFO", function (done) {
        var logWriter = new mockLogWrtier(nemesis.logLevel.INFO);
        logWriter.info = function () {
            done();
        };
        nemesis.config({ logLevel: nemesis.logLevel.INFO });
        
        nemesis.logger.addWriter(logWriter);
        
        nemesis.logger.info("Test Message");
    });
    
    test("error is logged with level of WARN", function (done) {
        var logWriter = new mockLogWrtier(nemesis.logLevel.WARN);
        logWriter.error = function () {
            done();
        };
        nemesis.config({ logLevel: nemesis.logLevel.WARN });
        
        nemesis.logger.addWriter(logWriter);
        
        nemesis.logger.error("Test Message", null);
    });
    
    test("warn is logged with level of WARN", function (done) {
        var logWriter = new mockLogWrtier(nemesis.logLevel.WARN);
        logWriter.warn = function () {
            done();
        };
        nemesis.config({ logLevel: nemesis.logLevel.WARN });
        
        nemesis.logger.addWriter(logWriter);
        
        nemesis.logger.warn("Test Message");
    });
    
    test("info is not logged with level of WARN", function () {
        var logWriter = new mockLogWrtier(nemesis.logLevel.WARN);
        nemesis.config({ logLevel: nemesis.logLevel.WARN });
        
        nemesis.logger.addWriter(logWriter);
        
        nemesis.logger.info("Test Message");
    });
    
    test("error is logged with level of ERROR", function (done) {
        var logWriter = new mockLogWrtier(nemesis.logLevel.ERROR);
        logWriter.error = function () {
            done();
        };
        nemesis.config({ logLevel: nemesis.logLevel.ERROR });
        
        nemesis.logger.addWriter(logWriter);
        
        nemesis.logger.error("Test Message", null);
    });
    
    test("warn is not logged with level of ERROR", function () {
        var logWriter = new mockLogWrtier(nemesis.logLevel.ERROR);
        nemesis.config({ logLevel: nemesis.logLevel.ERROR });
        
        nemesis.logger.addWriter(logWriter);
        
        nemesis.logger.warn("Test Message");
    });
    
    test("info is not logged with level of ERROR", function () {
        var logWriter = new mockLogWrtier(nemesis.logLevel.ERROR);
        nemesis.config({ logLevel: nemesis.logLevel.ERROR });
        
        nemesis.logger.addWriter(logWriter);
        
        nemesis.logger.info("Test Message");
    });
    
    test("error is not logged with level of OFF", function () {
        var logWriter = new mockLogWrtier(nemesis.logLevel.OFF);
        nemesis.config({ logLevel: nemesis.logLevel.OFF });
        
        nemesis.logger.addWriter(logWriter);
        
        nemesis.logger.error("Test Message", null);
    });
    
    test("warn is not logged with level of OFF", function () {
        var logWriter = new mockLogWrtier(nemesis.logLevel.OFF);
        nemesis.config({ logLevel: nemesis.logLevel.OFF });
        
        nemesis.logger.addWriter(logWriter);
        
        nemesis.logger.warn("Test Message");
    });
    
    test("info is not logged with level of OFF", function () {
        var logWriter = new mockLogWrtier(nemesis.logLevel.OFF);
        nemesis.config({ logLevel: nemesis.logLevel.OFF });
        
        nemesis.logger.addWriter(logWriter);
        
        nemesis.logger.info("Test Message");
    });
})