import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateSuperToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SUPER_SECRET, {
    expiresIn: "7d",
  });
};

export default generateSuperToken;