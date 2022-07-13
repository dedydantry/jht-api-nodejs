import ProductRecommend from "../models/mongo/ProductRecommend.mjs"
import { Validator } from 'node-input-validator'
import { errorValidations } from '../helpers/index.mjs'
import { v4 as uuidv4 } from 'uuid';

const ProductRecommendController = {
    
    async index(req, res){
        try {
            let skip = 0;
            let limit = req.query.limit ? req.query.limit : 12;

            let page = req.query.page ? req.query.page : 1;
            skip = page === 1 ? 0 : (page - 1) * limit;
      
            const productsRecommend = await ProductRecommend.find({})
              .sort({ created_at: -1 })
              .skip(skip)
              .limit(limit);

            const totalProduct = await ProductRecommend.count();
            let totalPage = totalProduct / limit;
      
            res.send({
                status: true,
                total_page:
                    totalPage > parseInt(totalPage)
                    ? parseInt(totalPage) + 1
                    : parseInt(totalPage),
                total: totalProduct,
                last_page: parseInt(page),
                data: productsRecommend,
            });
          } catch (error) {
            res.send({
              status: false,
              message: error.message,
            });
          }
    },

    async store(req, res) {
        try {
            const validate = new Validator(req.body, {
                product_id: 'required',
                cover: 'required',
                name: 'required',
            }, { 
                product_id: 'Pilihan produk tidak boleh kosong',
                cover: 'Image Product tidak boleh kosong',
                name: 'Title tidak boleh kosong',
            })

            const matched = await validate.check();
            if(!matched) return res.send({
                status:false,
                message:errorValidations(validate.errors)
            })

            const product =  await ProductRecommend.find({product_id: req.body.product_id}).exec()
            if(product.length > 0) return res.send({
                status:false,
                message:'ID Produk ' + req.body.product_id + ' telah terdaftar sebelumnya sebagai produk rekomendasi'
            })

            const params = {
                uuid: uuidv4(),
                product_id: req.body.product_id,
                name: req.body.name,
                price: req.body.price,
                moq: req.body.moq,
                cover: req.body.cover,
                supplier: req.body.supplier,
                expired_at: null,
            }
            
            const productsRecommend = new ProductRecommend(params)
            productsRecommend.save()
            return res.send({
                status:true,
                message: productsRecommend
            })
        } catch (error) {
            return res.send({
                status:false,
                message:error.message,
            })
        }
    },

    async update(req, res){
        try {
            const validate = new Validator(req.body, {
                product_id: 'required',
                cover: 'required',
                name: 'required',
            }, { 
                product_id: 'Pilihan produk tidak boleh kosong',
                cover: 'Image Product tidak boleh kosong',
                name: 'Title tidak boleh kosong',
            })
            const matched = await validate.check();
            if(!matched) return res.send({
                status:false,
                message:errorValidations(validate.errors)
            })

            const product = await ProductRecommend.find({
                $and: [
                    { _id: {$ne: req.params.id} },
                    { product_id: req.body.product_id},
                ]
            }).exec()
            if(product.length > 0 && product[0].product_id == req.body.product_id) return res.send({
                status:false,
                message:'ID Produk ' + req.body.product_id + ' telah terdaftar sebelumnya sebagai produk rekomendasi'
            })

            const params = {
                uuid: uuidv4(),
                product_id: req.body.product_id,
                name: req.body.name,
                price: req.body.price,
                moq: req.body.moq,
                cover: req.body.cover,
                supplier: req.body.supplier,
                expired_at: null,
            }

            await ProductRecommend.updateOne({_id:req.params.id}, params,{ upsert: true })
            return res.send({
                status:true,
                message:params
            })
        } catch (error) {
            return res.send({
                status:false,
                message:error.message,
            })
        }
    },

    async setNote(req, res){
        try {
            const params = {
                note: req.body.note
            }

            await ProductRecommend.updateOne({_id:req.params.id}, params, { upsert: true })
            res.send({
                status:true,
                message:params
            })
        } catch (error) {
            res.send({
                status:false,
                message:error.message
            })
        }
    },

    async destroy(req, res){
        try {
            await ProductRecommend.deleteOne({_id:req.params.id})
            return res.send({
                status:true,
                message:'Product has been deleted'
            })
        } catch (error) {
            return res.send({
                status:true,
                message:error.message
            })
        }
    },

    async show(req, res){
        try {
            const product = await ProductRecommend.findById(req.params.id)
            return res.send({
                status:true,
                message:product
            })
        } catch (error) {
            return res.send({
                status:true,
                message:error.message
            })
        }
    },
}

export default ProductRecommendController