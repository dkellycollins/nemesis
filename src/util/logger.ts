///<reference path="./util.d.ts" />

class logger implements ILogger {
    public log(msg: string): void {
        console.log(msg);
    }
}

export = logger;