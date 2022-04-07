import Event from "../models/mongo/Events.mjs"
import {Validator} from 'node-input-validator'
import {errorValidations} from '../helpers/index.mjs'
const EventController = {

    async index(req, res){
        const events = await Event.find({}).sort({created_at:-1})
        res.send(events)
    },

    async store(req, res) {
        try {
            const validate = new Validator(req.body, {
                name:'required',
                cover:'required',
                expired_at:'required',
                price:'required'
            })
            const matched = await validate.check();
            if(!matched) return res.send({
                status:false,
                message:errorValidations(validate.errors)
            })
            const params = {
                name:req.body.name,
                slug:req.body.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
                cover:req.body.cover,
                expired_at:req.body.expired_at,
                price:req.body.price
            }

            const events = new Event(params)
            events.save()
            res.send({
                status:true,
                message:events
            })
        } catch (error) {
            res.send({
                status:false,
                message:error.message
            })
        }
    },
    
    async update(req, res) {
        try {
            const validate = new Validator(req.body, {
                name:'required',
                cover:'required',
                expired_at:'required',
                price:'required'
            })
            const matched = await validate.check();
            if(!matched) return res.send({
                status:false,
                message:errorValidations(validate.errors)
            })

            const params = {
                name:req.body.name,
                slug:req.body.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
                cover:req.body.cover,
                expired_at:req.body.expired_at,
                price:req.body.price
            }

            await Event.updateOne({_id:req.params.id}, params,{ upsert: true })
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
            await Event.deleteOne({_id:req.params.id})
            res.send({
                status:true,
                message:'Event has deleted'
            })
        } catch (error) {
            res.send({
                status:true,
                message:error.message
            })
        }
    },

    async show(req, res) {
        try {
            const event = await Event.findById(req.params.id)
            res.send({
                status:true,
                message:event
            })
        } catch (error) {
            res.send({
                status:true,
                message:error.message
            })
        }
    }
}


export default EventController