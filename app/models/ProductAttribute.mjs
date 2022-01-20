import DB from '../config/mysql.mjs'

const ProductAttribute = DB.model('ProductAttribute', {
    hasTimestamps: true,
    tableName : 'product_attributes',
    idAttribute : 'id',
})

export default ProductAttribute