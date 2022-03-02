import DB from '../config/mysql.mjs'

const ProductKeyword = DB.model('ProductKeyword', {
    tableName : 'product_keywords',
    idAttribute : 'id',
})

export default ProductKeyword