const mongoose = require("mongoose");
const validateMongoDbId = (id) => {
  try {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    console.log("id = ", id); //output - id =  prod

    if (!isValid) throw new Error("This id is not valid or not Found");
  } catch (error) {
    console.log(error);
    return error;
  }
};
module.exports = validateMongoDbId;
