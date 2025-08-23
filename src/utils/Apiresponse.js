class Apiresponse {
    constructor(statuscode , data , message = "Success",) {
        this.success = statuscode <  400 ; // Indicate success
        this.message = message; // Custom message
        this.statuscode = statuscode;
        this.data = data;
    }
}
export default Apiresponse;