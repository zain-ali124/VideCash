export const authorize = (...role) => {
    return ( req, res, next ) => {
        if(!role.includes(req.user.role)){
            res.status(403).json({
                success: false,
                message: "Access denied"
            })
        }
        next();
    };
};



