import DB from '../config/mysql.mjs'

const ProductImage = DB.model('ProductImage', {
    hasTimestamps: true,
    tableName : 'product_images',
    idAttribute : 'id',
})

export default ProductImage