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
            await service.buildRelation(productId)
            let [data1688, dataLocal] = await Promise.all([
                service.productDetail(productId),
                repo.mysqlByProductId(productId)
            ])
            const rateService = new RateService()
            const rateArr = await rateService.run()
            const idrRate =  rateArr.find(x => x.label === 'CNY')
            const rate = idrRate.rate_markup

            if (!data1688.success || typeof data1688.error_message !== 'undefined') {
                // ErrorLog('Fetching product detail', `Invalid product : ${data1688.message}`, req.params.id)
                if((data1688.error_code == 'gw.QosAppFrequencyLimit' || data1688.error_code == 'gw.SignatureInvalid') && dataLocal) {
                    const cvrt = new ConvertProduct(data1688)
                    return res.status(200).json({
                        status:true,
                        message: cvrt.convertPrice(dataLocal, rate)
                    })
                }
                
            }

            // check if product has removed
            if(typeof data1688.message != 'undefined'){
                if(data1688.message.includes('已下架')){
                    repo.removed(productId)
                }
                return res.status(200).json({
                    status:false,
                    message: data1688
                })
            }

            const convert = new ConvertProduct(data1688)
            if (!dataLocal) {
                const converted = await convert.mapping()
                if(converted === false) return res.status(200).json({
                    status:false,
                    message:'Product out of stock'
                })
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
            const converted2 = await convert.mapping()
            if(converted2 === false) return res.status(200).json({
                status:false,
                message:'Product out of stock'
            })
            await service.store(converted2)
            const regetProduct = await repo.mysqlByProductId(productId)
            return res.status(200).json({
                status:true,
                message:typeof isCopyLink !== 'undefined' ? regetProduct.uuid : convert.convertPrice(regetProduct, rate)
            })
        } catch (error) {
            throw error
            res.send({
                status:false,
                message:error.message
            })
        }
    },

    async search(req, res){
        try {
            let keyword = req.body.keyword
            if(!keyword) return res.status(200).json({status:false,data:[]})
            const service = new Service1688('')
            const search = await service.search(keyword)
            return res.status(200).json(search)
        } catch (error) {
            return res.send(error.message)
        }
    }

}

export default ProductController