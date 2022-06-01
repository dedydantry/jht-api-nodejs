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

            let manualRegist = false; // this scenario for manual registration that created by admin
            if(req.body.utm == 'manual' && req.body.payment_payload){
                manualRegist = true;
            }

            const params = {
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
                schedule:req.body.schedule,
                participants:req.body.participants,
                paid_at:(manualRegist) ? format(new Date(), 'yyyy-MM-dd HH:mm:ss', { timeZone: 'Asia/Jakarta' }) : null,
                paid_by:(manualRegist) ? 'admin' : null,
                payment_payload: (manualRegist) ? req.body.payment_payload : null,
                invoice:Date.now().toString(),
                invoice_url:null,
                status: (manualRegist) ? 'paid' : 'unpaid',
                total:req.body.participants.length * parseFloat(req.body.price),
                utm:req.body.utm,
                created_at:format(new Date(), 'yyyy-MM-dd HH:mm:ss', { timeZone: 'Asia/Jakarta' })
            }
            await Event.findByIdAndUpdate(event._id, 
                { "$push": { "participants": params}},
                { "new": true, "upsert": true }
            )

            const total = params.participants.length * parseFloat(req.body.price)
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