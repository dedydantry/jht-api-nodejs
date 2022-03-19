import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

console.log(`mongodb://${process.env.MONGO_NAME}:${encodeURIComponent(process.env.MONGO_NAME)}@8.215.28.69:27017/${process.env.MONGO_DB}`, 'oke');
try {
   mongoose
    .connect(`mongodb://${process.env.MONGO_NAME}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@8.215.28.69:27017/${process.env.MONGO_DB}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useNewUrlParser:true
      // useFindAndModify: false,
      // useCreateIndex: true,
    })
    .then((res) => console.log("connection success"))
    .catch((err) => console.log(err))
} catch (error) {
  console.log(error.message);
}

export default mongoose