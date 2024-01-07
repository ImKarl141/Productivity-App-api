import { createPool } from "mysql2";
import dotenv from 'dotenv';
dotenv.config();

const certificateBase64 = process.env.CERTIFICATE_BASE64;
const certificateContent = Buffer.from(certificateBase64, 'base64').toString('utf-8');


export const db = createPool({
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    host: process.env.TIDB_HOST,
    port: process.env.TIDB_PORT,
    database: process.env.TIDB_DATABASE,
    ssl: {
        ca: certificateContent,
    }
})
