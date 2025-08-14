import dotenv from "dotenv";
dotenv.config();
const config = {
  MONGODB_URI: String(process.env.MONGODB_URI),
  PORT: Number(process.env.PORT),
};
export default config;
