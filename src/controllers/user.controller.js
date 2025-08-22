  import { asynchandler }  from "../utils/async.js";


  const register =asynchandler( async (req, res) => {
    // Registration logic here
     res.status(201).json({ message: "User registered successfully" });
  })

  export { register };