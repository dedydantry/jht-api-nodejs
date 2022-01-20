import DB from '../config/mysql.mjs'

const ProductNote = DB.model('ProductNote', {
    tableName : 'product_notes',
    idAttribute : 'id',
})

export default ProductNote