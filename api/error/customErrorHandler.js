class customErrorHandler {
    constructor(code, message) {
        this.code = code;
        this.message = message;

        console.log(message);
    }
}

module.exports = customErrorHandler;