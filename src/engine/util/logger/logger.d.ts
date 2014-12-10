/**
 * The common interface for all loggers
 */
interface ILogger{
    /**
     * Logs a standard message
     * @param msg The message to log
     */
    log(msg:string):void;

    /**
     * Logs an error message.
     * @param msg The message to log
     * @param e Error information
     */
    logError(msg:string, e?:ExceptionInformation):void;
}