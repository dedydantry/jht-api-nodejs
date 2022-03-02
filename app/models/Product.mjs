import DB from '../config/mysql.mjs'
import Category from './Category.mjs'
import Seller from './Seller.mjs'
import ProductVariant from './ProductVariant.mjs'
import ProductAttribute from './ProductAttribute.mjs'
import ProductImage from './ProductImage.mjs'
import ProductNote from './ProductNote.mjs'
import PriceRange from './PriceRange.mjs'
import ProductKeyword from './ProductKeyword.mjs'

const Product = DB.model('Product', {
    hasTimestamps: ['created_at', 'updated_at'],
    tableName : 'products',
    idAttribute : 'id',
    soft: true,

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
    },

    keyword(){
        return this.hasMany(ProductKeyword)
    }
})

export default Product