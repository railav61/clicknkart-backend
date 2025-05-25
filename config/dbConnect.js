const { default: mongoose } = require("mongoose");
require("dotenv").config();
const dbConnect = () => {
  const MONGOURI = process.env.MONGOURI;
  try {
    const conn = mongoose.connect(MONGOURI || "mongodb://localhost:27017/");
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("DAtabase error");
  }
};
module.exports = dbConnect;
