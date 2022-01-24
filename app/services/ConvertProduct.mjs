import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import TranslateService from './TranslateService.mjs'

class ConvertProduct extends TranslateService {

    constructor (productData) {
        super()
        this.masterData  = productData.productInfo
        this.variantType = 'no_variant'
    }

    async mapping () {
        const masterCategory = this.findCategory()
        const firstCategory = masterCategory[masterCategory.length - 1].name
        const parentCategory = masterCategory
        const variant = this.findVariant()
        let productResult =  {
            flag:1688,
            product_id:this.masterData.productID,
            main_url:`https://detail.1688.com/offer/${this.masterData.productID}.html`,
            subject:{
                en:'',
                cn:this.masterData.subject
            },
            prices:this.findPrice(),
            stock:typeof this.masterData.saleInfo.amountOnSale  !== 'undefined' ? this.masterData.saleInfo.amountOnSale : null,
            moq:this.masterData.saleInfo.minOrderQuantity,
            images:this.masterData.image.images.map(x => `https://cbu01.alicdn.com/${x}`),
            category:{
                name_cn:firstCategory ,
                name_en:'',
                id:this.masterData.categoryID,
                group:parentCategory
            },
            weight:this.findWeight(),
            height:typeof this.masterData.shippingInfo.height !== 'undefined' ? this.masterData.shippingInfo.height : 0,
            length:typeof this.masterData.shippingInfo.length !== 'undefined' ? this.masterData.shippingInfo.length : 0,
            variant_type:this.variantType,
            video:typeof this.masterData.mainVedio !== 'undefined' ? this.masterData.mainVedio : null,
            variants:variant,
            created_time:this.masterData.createTime,
            last_updated:this.masterData.lastUpdateTime,
            attributes:this.masterData.attributes.map(x => {
                return {
                    name_cn:x.attributeName,
                    name_en:'',
                    value_cn:x.value,
                    value_en:''
                }
            }),
            seller_name:this.masterData.supplierLoginId,
            seller_id:this.masterData.supplierUserId,
            seller_address:this.masterData.shippingInfo.sendGoodsAddressText,
            description:this.masterData.description
        }

        // handling translate all
        try {
            const translateAll = await Promise.all([
                this.translateTitleCategory(`${this.masterData.subject} - ${firstCategory}`),
                this.translateVariant(productResult)
            ])
    
            if (translateAll[0]) {
                const [title, cat] = translateAll[0].split(' - ')
                productResult.subject.en = title
                productResult.category.name_en = cat
                productResult.category.group[0].name_en = cat
            }
    
            productResult = this.appendVariant(productResult, translateAll[1])

        } catch (error) {
            throw error
        }

        return productResult
    }

    findWeight () {
        let weight = 0
        if (typeof this.masterData.shippingInfo.unitWeight !== 'undefined') {
            weight = this.masterData.shippingInfo.unitWeight
        } else if (this.masterData.shippingInfo.weight != 'undefined') {
            weight = this.masterData.shippingInfo.weight
        }
        if (weight > 0) {
            weight = weight * 1000
        }
        return weight
    }

    findVariant () {
        if (typeof this.masterData.skuInfos === 'undefined') return []
        const items = this.masterData.skuInfos.filter(x => x.amountOnSale > 0)
        let isMultiple = true
        const result = items.map(x => {
           let name = ''
           let img = ''
           let keyVariant = ''
           if (typeof x.attributes !== 'undefined' && x.attributes.length) {
              if (typeof x.attributes[0].skuImageUrl !== 'undefined') {
                  img = `https://cbu01.alicdn.com/${x.attributes[0].skuImageUrl.replace('.jpg', '.60x60.jpg')}`
              }
              name = x.attributes.map(x => x.attributeValue).join(' - ')
              keyVariant = x.attributes[0].attributeValue
              if (x.attributes.length <= 1) {
                isMultiple = false
              }
           }
            return {
                stock:x.amountOnSale,
                price: typeof x.price !== 'undefined' ? x.price : 0,
                retail_price: typeof x.retailPrice !== 'undefined' ? x.retailPrice : 0,
                name,
                image:img,
                sku_id:x.skuId,
                spec_id:x.specId,
                keyVariant
            }
        })

        this.variantType = isMultiple ? 'multiple_item' : 'single_item' 
        const variant = []
        const imgGroup = _.groupBy(result, 'image')
        Object.keys(imgGroup).forEach(function (key) {
            if (isMultiple) {
                variant.push({
                    name:typeof imgGroup[key][0].key_variant !== 'undefined' ? imgGroup[key][0].key_variant : imgGroup[key][0].keyVariant,
                    name_en:'',
                    image:key,
                    items:imgGroup[key].map(x => {
                        return {
                            stock:x.stock,
                            price:x.price,
                            retail_price:x.retail_price,
                            name:x.name,
                            name_en:'',
                            image:x.image,
                            sku_id:x.sku_id,
                            spec_id:x.spec_id
                        }
                    })
                })
            } else {
                variant.push({
                    name:typeof imgGroup[key][0].key_variant !== 'undefined' ? imgGroup[key][0].key_variant : imgGroup[key][0].keyVariant,
                    name_en:'',
                    stock:imgGroup[key][0].stock,
                    price:imgGroup[key][0].price,
                    retail_price:imgGroup[key][0].retail_price,
                    image:imgGroup[key][0].image,
                    sku_id:imgGroup[key][0].sku_id,
                    spec_id:imgGroup[key][0].spec_id
                })
            }
        })
       

        return variant
    }


    findCategory () {
        const category = this.masterData.categoryName.split('/')
        return category.map((x, index) => {
            return {
                uuid:uuidv4(),
                name:x,
                name_en:null,
                category_id_1688: !index ? this.masterData.categoryID : null
            }
        })
    }

    findPrice () {
        if (typeof this.masterData.skuInfos !== 'undefined') {
            if (this.masterData.skuInfos.length) {
                const firstItem = this.masterData.skuInfos[0]
                if (typeof firstItem.price !== 'undefined') {
                    if (firstItem.price) {
                        return {
                            fix:parseFloat(firstItem.price),
                            ranges:[],
                            price_type:'VARIANT'
                        }
                    }
                }
            }
        }

        if (this.masterData.saleInfo.priceRanges.length > 1) {
            return {
                fix:this.masterData.saleInfo.priceRanges[0].price,
                ranges:this.masterData.saleInfo.priceRanges.map(x => {
                    return {
                        start_quantity:x.startQuantity,
                        price:parseFloat(x.price)
                    }
                }),
                price_type:'RANGE'
            }
        }

        return {
            fix:parseFloat(this.masterData.saleInfo.priceRanges[0].price),
            ranges:[],
            price_type:'FIX'
        }
    }

    // translate
    async translateTitleCategory (str) {
        try {
            const title = await this.translate(str)
            return title
        } catch (error) {
            return ''
        }
    }

    async translateAtribute (params) {
        try {
            const attrString = params.attributes.map(x => {
                return `${x.name_cn} - ${x.value_cn}`
            }).join(' | ')
            const resultTranslate = await this.translate(attrString)
            const arrResult = resultTranslate.split(' | ')
            return arrResult
        } catch (error) {
            return params
        }
    }

    appendStringAttribute (params, arg) {
        arg.map((x, index) => {
            const valueName = x.split(' - ')
            const [name, value] = valueName
            params.attributes[index].name_en = name
            params.attributes[index].value_en = value
        })
        return params
    }

    async translateVariant (params) {
        if (!params.variants.length) return params

        let variantString = ''
        if (params.variant_type == 'multiple_item') {
            variantString = params.variants.map(x => {
                const itemString = x.items.map(y => {
                    return y.name
                }).join(' >> ')
                return `${x.name} <> ${itemString}`
            }).join(' << ')

           
            const resultTranslate = await this.translate(variantString)
            if(resultTranslate) return resultTranslate.split(' << ')
            return variantString.split(' << ')

        } else if (params.variant_type === 'single_item') {
            const singleItemString = params.variants.map(x => {
                return x.name
            }).join(' << ')

            const resultSingleTranslate = await this.translate(singleItemString)
            const arrResultSingle = resultSingleTranslate.split(' << ')
            return arrResultSingle
        }

        return ''        
    }

    appendVariant (params, arg) {
        if (params.variant_type == 'multiple_item') {
            arg.map((x, index) => {
                const [name, itemString] = x.split(' <> ')
                params.variants[index].name_en = name
                if(typeof itemString !== 'undefined'){
                    if(itemString.search('>>') >= 0){
                        const arrItemString = itemString.split(' >> ')
                        arrItemString.map((q, i) => {
                            params.variants[index].items[i].name_en = q
                        })
                    }else{
                        params.variants[index].items[0].name_en = itemString
                    }
                }
            })
        } else if (params.variant_type === 'single_item') {
            arg.map((x, index) => {
                params.variants[index].name_en = x
            })
        }

        return params
    }

    convertPrice (params, rate) {
        params.price = parseFloat(params.price) * rate 
        
        if (params.price_type === 'RANGE') {
            params.ranges.map(x => {
                x.price = rate * parseFloat(x.price)
                return x
            })
        }


        if (params.price_type === 'VARIANT') {
            params.variants.map(x => {
                x.items.map(y => {
                    y.price = y.price ? (y.price * rate) : 0
                })
            })
        }

        return params
    }
}

export default ConvertProduct