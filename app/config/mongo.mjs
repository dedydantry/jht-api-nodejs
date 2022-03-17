import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

try {
   mongoose
    .connect(`mongodb://cr_user:${encodeURIComponent('qwerty#123123#')}@8.215.28.69:27017/caribarang_mg`, {
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