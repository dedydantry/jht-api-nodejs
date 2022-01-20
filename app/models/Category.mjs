import DB from '../config/mysql.mjs'

const Category = DB.model('Category', {
    hasTimestamps: ['created_at', 'updated_at'],
    tableName : 'categories',
    idAttribute : 'id',
})

DB.Collection.extend({
    model: Category
});

export default Category