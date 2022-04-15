import mongoose from "../../config/mongo.mjs"
const Schema = mongoose.Schema
const ProductCatalogSchema = new Schema({
    uuid: String,
    name: String,
    file_url: String,
    user_id: String, // should user_id number / string ?
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

const ProductCatalog = mongoose.model('ProductCatalog', ProductCatalogSchema)

export default ProductCatalog