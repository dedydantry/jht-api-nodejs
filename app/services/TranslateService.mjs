import fetch from 'node-fetch'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
dotenv.config()

export default class TranslateService {

    constructor(){
        this.subscriptionKey = process.env.AZURE_TRANSLATE_KEY
        this.endpoint = process.env.AZURE_ENDPOINT
        this.region = process.env.AZURE_REGION
    }

    translate(text, target='en'){

        return new Promise((resolve, reject) => {
            const params = [{text:text}]
            fetch(`${this.endpoint}/translate?api-version=${encodeURIComponent('3.0')}&from=zh&to=${encodeURIComponent(target)}`, {
                headers:{
                    'Ocp-Apim-Subscription-Key': this.subscriptionKey,
                    'Ocp-Apim-Subscription-Region': this.region,
                    'Content-type': 'application/json',
                    'X-ClientTraceId': uuidv4().toString()
                },
                body:JSON.stringify(params),
                method:'POST',
                json: true,
            })
            .then(res => res.json())
            .then(res => {
                resolve(res[0].translations[0].text)
            })
            .catch(err => reject(err))
        })
    }
}