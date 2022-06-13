import {format} from 'date-fns'
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
            const product = await Product.select(['id', 'uuid', 'product_id_1688', 'last_updated'])
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

    async removed(productId){
        try {
            console.log(productId, 'mantaf');
            const removed = await Product
            .where({product_id_1688:productId})
            .save(
                {removed_at:format(new Date(), 'yyyy-MM-dd HH:mm:ss', { timeZone: 'Asia/Jakarta' })},
                {patch:true}
            )
            return true
        } catch (error) {
            return false
        }
    }
}