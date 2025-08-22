  import { asynchandler }  from ".../utils/async.util.js";


  const register =asynchandler( async (req, res) => {
    // Registration logic here
     res.status(201).json({ message: "User registered successfully" });
  })

  export { register };