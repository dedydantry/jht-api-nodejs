import Order1688Notes from "../models/mongo/Order1688Notes.mjs"
import { Validator } from "node-input-validator"
import { errorValidations } from "../helpers/index.mjs"

const Order1688NoteController = {
	async index(req, res){
		try {
			const notes = await Order1688Notes.find({}).sort({ created_at: -1})
			return res.send({
				status: true,
				data: notes
			})
		} catch (error) {
			return res.send({
				status: false,
				message: error.message
			})
		}
	},

	async store(req, res) {
		try {
			const validate = new Validator(req.body,{
				label: 'required',
				address: 'required',
				note: 'required',
			})

			const match = await validate.check()
			if(!match) {
				return res.send({
					status: false,
					message: errorValidations(validate.errors)
				})
			}

			const params = {
				label: req.body.label,
				address: req.body.address,
				note: req.body.note
			}

			const order1688Note = new Order1688Notes(params)
			order1688Note.save()

			return res.send({
				status: true,
				message: order1688Note
			})
		} catch (error) {
			return res.send({ 
				status: false,
				message: error.message
			})
		}
	},

	async show(req, res) {
		try {
			const order1688Note = await Order1688Notes.findById(req.params.id)
			if(!order1688Note) return res.send({
				status: false,
				message: 'Invalid order 1688 note'
			})

			return res.send({
				status: true,
				data: order1688Note
			})
		} catch (error) {
			return res.send({
				status: false,
				message: error.message
			})
		}
	},

	async update(req, res) {
		try {
			const validate = new Validator(req.body,{
				label: 'required',
				address: 'required',
				note: 'required',
			})

			const match = await validate.check()
			if(!match) {
				return res.send({
					status: false,
					message: errorValidations(validate.errors)
				})
			}
			
			const noteId = req.params.id

			const params = {
				label: req.body.label,
				address: req.body.address,
				note: req.body.note
			}
			
			const order1688Note = await Order1688Notes.updateOne({ _id: noteId }, { $set: params }, { upsert: true})

			return res.send({
				status: true,
				message: order1688Note
			})
		} catch (error) {
			return res.send({ 
				status: false,
				message: error.message
			})
		}
	}
}

export default Order1688NoteController