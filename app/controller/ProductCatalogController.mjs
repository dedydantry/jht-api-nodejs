import { Validator } from 'node-input-validator'
import ProductCatalog from "../models/mongo/ProductCatalog.mjs"
import { errorValidations } from '../helpers/index.mjs'
import { v4 as uuidv4 } from 'uuid';

const ProductCatalogController = {
    async index(req, res){
        // if(!req.query.user_id){
        //     res.send({
        //         status:false,
        //         message:'Request not completed',
        //     })
        // }
        // const productCatalog = await ProductCatalog.find({user_id: req.query.user_id}).sort({created_at: -1})
        const productCatalog = await ProductCatalog.find({}).sort({created_at: -1})
        return res.send(productCatalog)
    },

    async store(req, res) {
        try {
            const validate = new Validator(req.body, {
                file_url: 'required',
                name: 'required',
                user_id: 'required'
            }, { 
                file_url: 'File gagap di upload',
                name: 'Nama tidak boleh kosong',
                user_id: 'User tidak memiliki Akses'
            })

            const matched = await validate.check();
            if(!matched) return res.send({
                status:false,
                message:errorValidations(validate.errors)
            })

            const params = {
                uuid: uuidv4(),
                name: req.body.name,
                file_url: req.body.file_url,
                user_id: req.body.user_id
            }
            
            const productCatalog = new ProductCatalog(params)
            productCatalog.save()
            res.send({
                status:true,
                message: productCatalog
            })
        } catch (error) {
            res.send({
                status:false,
                message:error.message,
            })
        }
    },

    async destroy(req, res){
        try {
            await ProductCatalog.deleteOne({_id:req.params.id})
            res.send({
                status:true,
                message:'Catalog has been deleted'
            })
        } catch(error) {
            res.send({
                status:false,
                message:error.message
            })
        }
    }
}

export default ProductCatalogController