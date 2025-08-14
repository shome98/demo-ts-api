import dotenv from "dotenv";
dotenv.config();
const config = {
  PORT: Number(process.env.PORT),
};
export default config;
