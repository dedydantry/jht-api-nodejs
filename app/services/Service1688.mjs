import fetch from 'node-fetch'
import dotenv from 'dotenv'
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
            const querySignature   = { 'keyWord': keyword}
            const signature = await this.getSignature(decodeURIComponent(keyword), path, 'search')
            querySignature._aop_signature   = signature.signature
            querySignature.access_token = signature.access_token
            const params = new URLSearchParams(querySignature)
            const str = params.toString()
            const res = await this.fetching(signature.path, str)
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