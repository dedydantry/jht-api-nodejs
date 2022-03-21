import SearchLog from '../models/mongo/SearchLog.mjs'
const SearchTrackingController = {

    async index(req, res){
        try {
            const filters = [
                {
                    $group:{
                        _id:"$keyword",
                        result: { "$last": "$result" },
                        last_hit: { "$last": "$created_at" },
                        hit: { $sum: 1 }
                    }
                },
                {
                    $match: {
                        "result": { 
                            "$exists": true, 
                            "$ne": null 
                        }
                    }    
                },
                {
                    $sort:{result:-1}
                }
            ]
            const report = req.query.report
            let skip = 0
            const page = req.query.page ? req.query.page : 1
            skip = page === 1 ?  0 : (page-1) * 15
            let log
            if(report){
                log = SearchLog.aggregate(filters)
            }else{
                log = SearchLog.find({}).sort({created_at:-1}).skip(skip)
            }
            log = await log
            const totalLog = await SearchLog.count()
            let totalPage = totalLog/15
            return res.send({
                status:true,
                data:{
                    total_page:totalPage > parseInt(totalPage) ? parseInt(totalPage) + 1 :  parseInt(totalPage),
                    total:totalLog,
                    last_page:parseInt(page),
                    data:log
                }
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
            if(typeof req.body.keyword !== 'undefined'){
                const keyword = req.body.keyword.replace(/ +(?= )/g,'').toLowerCase()
                const log = new SearchLog({
                    user_id:req.body.user_id,
                    keyword:keyword,
                    result:req.body.result ? req.body.result : 0
                })
                log.save()
                return res.send({success:true})
            }
            return res.send({success:false})
        } catch (error) {
            return res.send({success:false})
        }
    }

}

export default SearchTrackingController