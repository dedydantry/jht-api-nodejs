import Product from '../models/Product.mjs'
export default class ProductRepository {

    async mysqlByProductId (productId) {
        try {
            const product = await Product.with(['category', 'ranges', 'images', 'variants.items', 'attributess', 'note', 'seller', 'keyword'])
                .where('product_id_1688', productId).first()
            if (!product) return  null
            return product.toJSON()
        } catch (error) {
            throw error
            return null
        }
    }

    async findProductByUuid (uuid) {
        try {
            const product = await Product.select(['id', 'uuid', 'product_id_1688'])
            .where('uuid', uuid)
            .first()
            if (!product) return {
                status:false,
                data:product
            }
            return {
                status:true,
                data:product.toJSON()
            }
        } catch (error) {
            return {
                status:false,
                data:error.message
            }
        }
    }
}