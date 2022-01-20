import DB from '../config/mysql.mjs'

const PriceRange = DB.model('PriceRange', {
    tableName : 'product_price_ranges',
    idAttribute : 'id',
})

export default PriceRange