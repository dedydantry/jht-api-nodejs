import Service1688 from '../services/Service1688.mjs'
import ConvertProduct from '../services/ConvertProduct.mjs'
// import {ErrorLog} from "../services/Logging.mjs"
import RateService from '../services/RateService.mjs'
import ProductRepository from '../repositories/ProductRepository.mjs'

const ProductController = {

    index (req, res) {
        return res.send('product')
    },

    async view (req, res) {
        try {
            const uuid = req.params.id
            const isCopyLink = req.query.copy
            let productId = ''

            const repo = new ProductRepository()
            if (typeof isCopyLink !== 'undefined') {
                productId = uuid
            } else {
                const findByUuid = await repo.findProductByUuid(uuid)
                if (!findByUuid.status) return res.status(200).json({
                    status:false,
                    message:findByUuid.data,
                })
                productId = findByUuid.data.product_id_1688
            }

            const service = new Service1688(productId)
            const c = await service.buildRelation(productId)
            console.log(c, 'cccs');
            let [data1688, dataLocal] = await Promise.all([
                service.productDetail(productId),
                repo.mysqlByProductId(productId)
            ])

            console.log(data1688, 'data');

            if (!data1688.success) {
                // ErrorLog('Fetching product detail', `Invalid product : ${data1688.message}`, req.params.id)
                return res.status(200).json({
                    status:false,
                    message: data1688//typeof data1688.message != 'undefined' ? data1688.message : 'Invalid product from 1688 or Product has removed'
                })
            }

            const rateService = new RateService()
            const rateArr = await rateService.run()
            const idrRate =  rateArr.find(x => x.label === 'CNY')
            const rate = idrRate.rate_markup
            const convert = new ConvertProduct(data1688)
            if (!dataLocal) {
                const converted = await convert.mapping()
                await service.store(converted)
                dataLocal = await repo.mysqlByProductId(productId)
                return res.status(200).json({
                    status:true,
                    message:typeof isCopyLink !== 'undefined' ? dataLocal.uuid : convert.convertPrice(dataLocal, rate)
                })
            }

            if (dataLocal.last_updated === data1688.productInfo.lastUpdateTime) return res.status(200).json({
                status:true,
                message:typeof isCopyLink !== 'undefined' ? dataLocal.uuid : convert.convertPrice(dataLocal, rate)
            })
            const regetProduct = await repo.mysqlByProductId(productId)

            return res.status(200).json({
                status:true,
                message:typeof isCopyLink !== 'undefined' ? regetProduct.uuid : convert.convertPrice(regetProduct, rate)
            })
        } catch (error) {
            // ErrorLog('Fetching product detail', `${error.name}: ${error.message}`, req.params.id)
            res.send({
                status:false,
                message:error.message
            })
        }
    }

}

export default ProductController