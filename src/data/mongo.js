// // const mongoose = require("mongoose");
// // const { env } = require("../config/env");

// async function connectMongo() {
// //   if (!env.mongoUri || env.mongoUri === "##") {
// //     console.log("INFO: MONGO_URI no definida. Se omite conexión a MongoDB.");
// //     return;
// //   }

// //   try {
// //     const conn = await mongoose.connect(env.mongoUri);
// //     console.log("INFO: Conexión a MongoDB correcta:", conn.connection.name);
// //   } catch (error) {
// //     console.error("ERROR: (connectMongo) ->", error.message);
// //     throw error;
// //   }
// // }

// // module.exports = {
// //   connectMongo,
// // };
