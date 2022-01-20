import DB from '../config/mysql.mjs'

const Seller = DB.model('Seller', {
    hasTimestamps: ['created_at', 'updated_at'],
    tableName : 'sellers',
    idAttribute : 'id',
})

export default Seller