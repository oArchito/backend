// Correct order: define first, then export
const asynchandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (err) {  // Use the same variable name as in catch
        res.status(err.statusCode || 500).json({  // changed err.code to err.statusCode (common pattern)
            success: false,
            message: err.message || "Internal Server Error"
        });
    }
};

export { asynchandler };
