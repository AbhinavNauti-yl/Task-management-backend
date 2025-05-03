class apiError {
    constructor(
        statusCode,
        message
    ){
        this.statusCode = statusCode
        this.message = message
    }
}

export default apiError