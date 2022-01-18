import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateOwnerToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_OWNER_SECRET, {
    expiresIn: "7d",
  });
};

export default generateOwnerToken;