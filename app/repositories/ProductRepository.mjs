import Product from '../models/Product.mjs'
export default class ProductRepository {

    async mysqlByProductId (productId) {
        try {
            const product = await Product.with(['category', 'ranges', 'images', 'attributess', 'note', 'seller', 'keyword'])
                .with('variants', (q) => {
                    q.whereNull('deleted_at')
                })
                .with('variants.items', (q) => {
                    q.whereNull('deleted_at')
                })
                .where('product_id_1688', productId).first()
            if (!product) return  null
            return product.toJSON()
        } catch (error) {
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