import SearchLog from '../models/mongo/SearchLog.mjs'
const SearchTrackingController = {

    async index(req, res){
        console.log('sksk');
        try {
            const log = await SearchLog.find({})
            return res.send(log)
        } catch (error) {
            throw error
        }
    },

    async store(req, res){
        try {
            const keyword = req.body.keyword.replace(/ +(?= )/g,'').toLowerCase()
            const log = new SearchLog({
                user_id:req.body.user_id,
                keyword:keyword,
            })
            await log.save()
            return res.send(log)
        } catch (error) {
            res.send(error.message)
        }
    }

}

export default SearchTrackingController