import DB from '../config/mysql.mjs'
import Category from './Category.mjs'
import Seller from './Seller.mjs'
import ProductVariant from './ProductVariant.mjs'
import ProductAttribute from './ProductAttribute.mjs'
import ProductImage from './ProductImage.mjs'
import ProductNote from './ProductNote.mjs'
import PriceRange from './PriceRange.mjs'

const Product = DB.model('Product', {
    hasTimestamps: ['created_at', 'updated_at'],
    tableName : 'products',
    idAttribute : 'id',

    category () {
        return this.belongsTo(Category)
    },

    seller () {
        return this.belongsTo(Seller)
    },

    variants () {
        return this.hasMany(ProductVariant)
    },

    attributess () {
        return this.hasMany(ProductAttribute)
    },

    images () {
        return this.hasMany(ProductImage)
    },

    note () {
        return this.hasMany(ProductNote)
    },

    ranges () {
        return this.hasMany(PriceRange)
    }
})

export default Product