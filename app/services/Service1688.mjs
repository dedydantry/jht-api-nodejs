import fetch from 'node-fetch'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid';
import TranslateService from './TranslateService.mjs';
import { format } from 'date-fns'
dotenv.config()
class Service1688 {

    constructor (productId) {
        this.productID = productId
    }

    async buildRelation () {
        try {
           
            const path               = 'param2/1/com.alibaba.product.push/alibaba.cross.syncProductListPushed'
            const querySignature   = {
                'productIdList'       : `[${this.productID}]`
            }

            const signature = await this.getSignature(this.productID, path)
            if (!signature) return signature
            
            querySignature._aop_signature   = signature.signature
            querySignature.access_token = signature.access_token

            const params = new URLSearchParams(querySignature)
            const str = params.toString()
            
            const res = await this.fetching(signature.path, str)
            return res
        } catch (error) {
            console.log(error.message, 'sm,sm')
            return {success:false}
        }
    }

    async fetching (url, params = '') {
       try {
        const get = await fetch(url, {
            method: 'POST',
            headers: {
              'Accept': '*/*',
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: params
        })

        const response = await get.json()

        return response
       } catch (error) {
           return error.message
       }

    }

    async getSignature (productId, path, type = 'relation') {

        try {
            const url = `${process.env.LARAVEL_HOST}/api/1688/signature?product_id=${productId}&path=${path}&type=${type}`
            const gets = await fetch(url,{
                headers:{
                    contentType: "application/json; charset=utf-8",
                }
            })
            const response = await gets.json()
            return response
        } catch (error) {
            return {
                status:false,
                data:error.message
            }
        }
        
    }

    async store (product) {
        try {
            const url = `${process.env.LARAVEL_HOST}/api/1688`
            const gets = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(product)
            })
            const response = await gets.json()
            return response
        } catch (error) {
            return {
                status:false,
                data:error.message
            }
        }
    }

    async storeSuggest(params){
        try {
            const url = `${process.env.LARAVEL_HOST}/api/1688/suggest`
            const gets = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(params)
            })
            const response = await gets.json()
            return response
        } catch (error) {
            return {
                status:false,
                data:error.message
            }
        }
    }

    async productDetail () {
        try {
            const path = 'param2/1/com.alibaba.product/alibaba.cross.productInfo'
            const querySignature   = { 'productId': this.productID}

            const signature = await this.getSignature(this.productID, path, 'product_detail')
            
            querySignature._aop_signature   = signature.signature
            querySignature.access_token = signature.access_token
            const params = new URLSearchParams(querySignature)
            const str = params.toString()

            const res = await this.fetching(signature.path, str)
            return res
        } catch (error) {
            return {
                success:false,
                data:error.message
            }
        }
    }

    async search(keyword = '') {
        try {
            const path = 'param2/1/com.alibaba.product/alibaba.product.suggest.crossBorder'
            const translate = new TranslateService();
            const keywordOri = keyword
            keyword = await translate.translate(keyword, 'en', 'id')
            if(!keyword) return {status:false,data:[]}
            const querySignature   = { 'keyWord': keyword}
            const signature = await this.getSignature(decodeURIComponent(keyword), path, 'search')
            querySignature._aop_signature   = signature.signature
            querySignature.access_token = signature.access_token
            const params = new URLSearchParams(querySignature)
            const str = params.toString()
            const res = await this.fetching(signature.path, str)
            if(typeof res.resultList !== 'undefined'){
                const result =  res.resultList.map(x => {
                    return {
                        seller_id : null,
                        category_id :null,
                        subcategory_id : null,
                        category_id_1688 :null,
                        product_id_1688 :x.productID,
                        uuid : uuidv4(),
                        name : x.subject,
                        name_en :'',
                        price :x.price,
                        price_type :'FIX',
                        stock :x.amountOnSale,
                        moq : x.minPurchaseQuantity ?  x.minPurchaseQuantity : 1,
                        cover :x.picUrl,
                        weight :0,
                        height :0,
                        length :0,
                        variant_type :'no_variant',
                        last_updated : '-',
                        created_at:format(new Date(), 'yyyy-MM-dd hh:ii:ss')
                    }
                })

                const longTitle =  result.map(x => x.name).join(' || ')
                const arrTitle =  await translate.translate(longTitle)
                if(arrTitle){
                    const resultTranslate = arrTitle.split(' || ')
                    for (let index = 0; index < resultTranslate.length; index++) {
                        result[index].name_en = resultTranslate[index]
                    }
                }
                
                this.storeSuggest({
                    product:result,
                    keyword: keywordOri + ',' + keyword
                })

                return {
                    status:true,
                    data:result
                }
            }
            return {
                status:false,
                data:res
            }
        } catch (error) {
            return{
                success:false,
                data:error.message
            }
        }
       
    }

    async searchByPicture(picUrl = '', page = 1){
        try {
            const path = 'param2/1/com.alibaba.linkplus:alibaba.cross.similar.offer.search'
            const querySignature = {
                'picUrl': picUrl,
                'page': page
            }
            const signature = await this.getSignature(picUrl, path, 'search_by_picture')
            querySignature._aop_signature   = signature.signature
            querySignature.access_token = signature.access_token
            const params = new URLSearchParams(querySignature)
            const str = params.toString()
            const res = await this.fetching(signature.path, str)
            // handle response 
            // still got error Unsupported API
            return res
        } catch (error) {
            return{
                success:false,
                data:error.message
            }
        }
    }
}

export default Service1688