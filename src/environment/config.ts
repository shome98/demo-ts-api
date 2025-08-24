import dotenv from "dotenv";
dotenv.config();
const config = {
  PORT: Number(process.env.PORT),
  DATABASE_URL: String(process.env.DATABASE_URL_POSTGRES),
};
export default config;
