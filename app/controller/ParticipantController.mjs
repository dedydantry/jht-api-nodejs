import Event from '../models/mongo/Events.mjs'
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
                participants:'required',
                event:'required',
                schedule:'required'
            })
            const matched = await validate.check();
            if(!matched) return res.send({
                status:false,
                message:errorValidations(validate.errors)
            })
            const event = await Event.findOne({slug:req.body.event})
            if(!event) return res.send({
                status:false,
                message:'Invalid event'
            })

            const params = {
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
                schedule:req.body.schedule,
                participants:req.body.participants,
                paid_at:null,
                paid_by:null,
                payment_payload:null,
                invoice:Date.now().toString(),
                total:req.body.participants.length * parseFloat(event.price),
                utm:req.body.utm,
                created_at:format(new Date(), 'yyyy-MM-dd H:m:s', { timeZone: 'Asia/Jakarta' })
            }
            await Event.findByIdAndUpdate(event._id, 
                { "$push": { "participants": params}},
                { "new": true, "upsert": true }
            )

            const total = params.participants.length * parseFloat(event.price)
            return res.send({
                status:true,
                message:{
                    invoice:params.invoice.toString(),
                    total:total,
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