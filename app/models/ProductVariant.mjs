import DB from '../config/mysql.mjs'
import ProductVariantItem from './ProductVariantItem.mjs'

const ProductVariant = DB.model('ProductVariant', {
    hasTimestamps: true,
    soft: true,
    tableName : 'product_variants',
    idAttribute : 'id',

    items(){
        return this.hasMany(ProductVariantItem)
    }
})

export default ProductVariant