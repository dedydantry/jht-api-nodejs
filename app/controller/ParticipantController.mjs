import Event from '../models/mongo/Events.mjs'
import EventOrder from "../models/mongo/EventOrder.mjs"
import {errorValidations} from '../helpers/index.mjs'
import {Validator} from 'node-input-validator'
import {format} from 'date-fns'
const ParticipantController = {

    async store(req, res) {
        try {
            const validate = new Validator(req.body, {
                name:'required',
                email:'required',
                phone:'required',
                event_id:'required'
            })
            const matched = await validate.check();
            if(!matched) return res.send({
                status:false,
                message:errorValidations(validate.errors)
            })

            const event = await Event.findById(req.body.event_id)
            if(!event) return res.send({
                status:false,
                message:'Invalid Event'
            })

            const checkParticipant = await Event.findOne({_id:req.body.event_id, "participants": {$elemMatch:{email:req.body.email}}})
            let order = null
            if(!checkParticipant){
                const params = {
                    name:req.body.name,
                    email:req.body.email,
                    phone:req.body.phone,
                    created_at:format(new Date(), 'yyyy-mm-dd H:m:s')
                }
                await Event.findByIdAndUpdate(req.body.event_id, 
                    { "$push": { "participants": params}},
                    { "new": true, "upsert": true }
                )
                
                const paramsOrder = {
                    invoice:Date.now(),
                    email:req.body.email,
                    total:event.price,
                    event_id:req.body.event_id
                }
                order = new EventOrder(paramsOrder)
                order.save()
            }else{
                order = await EventOrder.findOne({
                    event_id:req.body.event_id,
                    email:req.body.email
                })
            }

            return res.send({
                status:true,
                message:{
                    invoice:order.invoice,
                    total:parseFloat(order.total),
                    email:req.body.email,
                    phone:req.body.phone,
                    description:'Pembayaran: ' + event.name
                }
            })

        } catch (error) {
            return res.send({
                status:true,
                message:error.message
            })
        }
    }

}

export default ParticipantController