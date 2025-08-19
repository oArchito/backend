class Apierror extends Error {
    constructor( statusCode, message, error = [], statck = null ) {
        super(message);
        this.statusCode = statusCode || 500; // Default to 500 if not provided
        this.error = error; // Store error details
        this.statck = statck; // Store stack trace if available   
        this.message = message || "Internal Server Error"; // Default message
        this.data = null; // Additional data can be added later
        this.success = false; // Indicate failure

        if (statck) {
            this.statck = statck; // Store stack trace if provided
        }
    else{
        Error.captureStackTrace(this, this.constructor); // Capture stack trace
    }
    
}
}

export default Apierror;

// Usage example:
// throw new Apierror(404, "Resource not found", [], new Error().stack);