import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateManagerToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ADMIN_SECRET, {
    expiresIn: "7d",
  });
};

export default generateManagerToken;