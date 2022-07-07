import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateForgotPasswordToken = (id) => {
  return jwt.sign({ id }, process.env.AWS_FORGOT_PASSWORD_KEY, {
    expiresIn: "1d",
  }).slice(0, 15)
};

export default generateForgotPasswordToken;