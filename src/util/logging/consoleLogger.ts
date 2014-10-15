class consoleLogger {
    public static log(msg: string): void {
        console.log(msg);
    }

    public static logError(msg: string, e?: ExceptionInformation) {
        console.error(msg);
        if(!!e) {
            console.error(e.toString());
        }
    }
}

export = consoleLogger;