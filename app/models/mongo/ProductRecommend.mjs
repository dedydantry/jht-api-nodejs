import mongoose, {decimalField} from "../../config/mongo.mjs"
const Schema = mongoose.Schema
const ProductRecommendSchema = new Schema({
    uuid: String,
    cover: String,
    product_id: String,
    name: String,
    price: decimalField(),
    moq: Number,
    supplier: String,
    expired_at: Date,
    publish_status: {type: Boolean, default: false},
    note: {type: String, default: null}
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

const ProductRecommend = mongoose.model('ProductRecommend', ProductRecommendSchema)

export default ProductRecommend