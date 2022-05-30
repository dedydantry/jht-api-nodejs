import mongoose, {decimalField} from "../../config/mongo.mjs"
const Schema = mongoose.Schema
const EventSchema = new Schema({
    name:String,
    slug:String,
    cover:String,
    status:String,
    participants:{
        type:Array,
        default:[]
    },
    schedules:{
        type:Array,
        default:[]
    },
    expired_at:Date,
    price:decimalField()
}, { timestamps: { createdAt: 'created_at', updatedAt:'updated_at' }})

const Event = mongoose.model('Events', EventSchema)

export default Event