import mongoose, {decimalField} from "../../config/mongo.mjs"

const Schema = mongoose.Schema
const orders = new Schema({
    event_id:String,
    invoice:String,
    email:String,
    name:String,
    phone:String,
    total:decimalField(),
    paid_at:{
        type:Date,
        default:null
    },
    paid_by:{
        type:String,
        default:null
    },
    expired_at:{
        type:Date,
        default:null
    },
    payment_payload:{
        type:Schema.Types.Mixed,
        default:null
    }
}, { timestamps: { createdAt: 'created_at', updatedAt:'updated_at' }})

const EventOrders = mongoose.model('EventOrders', orders)

export default EventOrders