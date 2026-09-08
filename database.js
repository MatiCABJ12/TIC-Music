import pkg from "pg";
const { Pool } = pkg;


export const pool = new Pool({
  host: "ep-tiny-surf-ac1j2ai3-pooler.sa-east-1.aws.neon.tech",
  user: "neondb_owner",
  password: "npg_xLEQeZCqIg37",
  database: "neondb",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
  channelBinding: "require",
});


export const dbController = {
  pool: pool,
};


export const query = async (text, params = []) => {
  const client = await dbController.pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};
