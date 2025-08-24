import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import config from "../environment/config";


const db = drizzle(config.DATABASE_URL);
