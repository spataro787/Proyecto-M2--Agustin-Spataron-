import db from "./src/db/db.js";

const test = async () => {
  try {
    const res = await db.query("SELECT NOW()");
    console.log("✅ CONEXIÓN OK:", res.rows[0]);
  } catch (err) {
    console.error("❌ ERROR CONEXIÓN:", err.message);
  } finally {
    await db.end();
  }
};

test();