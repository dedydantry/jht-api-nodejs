import mongoose from "../../config/mongo.mjs"
const Schema = mongoose.Schema
const SearchLogSchema = new Schema({
    user_id:String,
    keyword:String,
    result:Number,
}, { timestamps: { createdAt: 'created_at', updatedAt:'updated_at' }})

const SearchLog = mongoose.model('SearchLog', SearchLogSchema)

export default SearchLog