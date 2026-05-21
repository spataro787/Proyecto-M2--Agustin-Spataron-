import db from "./db.js";

const test = async () => {
  try {
    const res = await db.query("SELECT NOW()");
    console.log("✅ CONEXIÓN OK");
    console.log(res.rows[0]);
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  } finally {
    await db.end();
  }
};

test();