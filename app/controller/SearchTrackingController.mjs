import SearchLog from '../models/mongo/SearchLog.mjs'
const SearchTrackingController = {

    async index(req, res){
        try {
            const log = await SearchLog.find({})
            return res.send({
                status:true,
                data:log
            })
        } catch (error) {
            return res.send({
                status:false,
                data:error.message
            })
        }
    },

    async store(req, res){
        try {
            const keyword = req.body.keyword.replace(/ +(?= )/g,'').toLowerCase()
            const log = new SearchLog({
                user_id:req.body.user_id,
                keyword:keyword,
            })
            log.save()
            return res.send({success:true})
        } catch (error) {
            return res.send({success:false})
        }
    }

}

export default SearchTrackingController