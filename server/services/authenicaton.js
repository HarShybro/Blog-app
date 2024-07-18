import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createTokenForUser = (user) => {
  const payload = {
    email: user.email,
    name: user.fullName,
    avatar: user.avatar,
    role: user.role,
  };
  const token = JWT.sign(payload, process.env.SECRET_KEY);

  return token;
};

export const validateToken = (token) => {
  const payload = JWT.verify(token, secret);
  return payload;
};
