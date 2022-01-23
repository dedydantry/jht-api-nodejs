import fetch from 'node-fetch'
import NodeCache from 'node-cache'
const myCache = new NodeCache();
class RateService {

    async run(){
        const cacheRate = myCache.get("rates");

        if(typeof cacheRate !== 'undefined') {
            const getRates = JSON.parse(cacheRate)
            return getRates
        }

        const arrCurrency = ['USD', 'CNY','PHP','MYR','THB','SGD']
        const prAll = []

        for (let index = 0; index < arrCurrency.length; index++) {
            const f = this.fetching(arrCurrency[index])
            prAll.push(f)
        }

        const result = await Promise.all(prAll)
        const params = arrCurrency.map((x,index) => {
            const r = result[index].rate
            return {
                label:x,
                rate:r,
                rate_markup:r + (r + 0.04)
            }
        })

        myCache.set('rates', JSON.stringify(params), 7200)
        return params
    }

    fetching(from, to ='IDR'){
        return new Promise((resolve, reject) => {
            fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}`)
            .then(res => res.json())
            .then(res => {
                resolve(res.info)
            })
            .catch(err => reject(err))
        })
    }

}

export default RateService