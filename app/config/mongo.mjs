import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

try {
   mongoose
    // .connect(`mongodb://${process.env.MONGO_NAME}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@8.215.28.69:27017/${process.env.MONGO_DB}`, {
      .connect(`mongodb://localhost:27017/caribarang_mg`, {
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

export function decimalField () {
  return{
    default: 0,
    required: true,
    type: mongoose.Schema.Types.Decimal128,
    get: v => v.toString(),
  }
};
export default mongoose