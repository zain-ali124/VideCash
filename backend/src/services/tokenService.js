import JWT from "jsonwebtoken"

export const generateAccessToken =  (userID) =>{
    return JWT.sign(
        { id: userID},
        process.env.JWT_ACCESS_SECRET,
        {expiresIn: process.env.JWT_ACCESS_EXPIRES_IN}
    )
}

export const generateRefreshToken = (userId) => {
  return JWT.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
};