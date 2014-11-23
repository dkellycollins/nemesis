interface ILogger {
    log(msg:string):void;
    logError(msg:string, e?:ExceptionInformation):void;
}