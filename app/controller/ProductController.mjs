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
            let newProduct = true
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
                if(findByUuid.data.last_updated != '-'){
                    newProduct = false
                }
            }

            const service = new Service1688(productId)
            if(newProduct){
                await service.buildRelation(productId)
            }
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
                return res.status(200).json({
                    status:false,
                    message: data1688//typeof data1688.message != 'undefined' ? data1688.message : 'Invalid product from 1688 or Product has removed'
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
            // ErrorLog('Fetching product detail', `${error.name}: ${error.message}`, req.params.id)
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
    },

    async searchByPicture(req, res){
        try {
            let picture = req.body.picture
            let page = req.body.page
            if(!picture) return res.status(200).json({status:false,data:[]})
            const service = new Service1688('')
            const search = await service.searchByPicture(picture, page)
            return res.status(200).json(search)
        } catch (error) {
            return res.send(error.message)
        }
    }

}

export default ProductController