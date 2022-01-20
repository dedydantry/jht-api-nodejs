import DB from '../config/mysql.mjs'

const ProductVariantItem = DB.model('ProductVariantItem', {
    hasTimestamps: true,
    tableName : 'product_variant_items',
    idAttribute : 'id',
})

export default ProductVariantItem