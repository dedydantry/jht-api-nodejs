import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()

export default class TranslateService {

    // constructor(){
    //     const token = this.getTokenAzure()
    //     this.token = token
    // }

    getTokenAzure(){
        return new Promise((resolve, reject) => {
            fetch(`https://southeastasia.api.cognitive.microsoft.com/sts/v1.0/issueToken?Subscription-Key=${process.env.AZURE_TRANSLATE_KEY}`, {
                method:'POST',
                headers:{
                    'Content-Length': 0,
                    "Host": "southeastasia.api.cognitive.microsoft.com"
                }
            })
            .then(res => res.text())
            .then(res => {
                return resolve(res)
            })
            .catch(err => resolve(''))
        })
    }

    translate(token, to, text){
        if(!text || !token ) return ''

        return new Promise((resolve, reject) => {
            const params = [{text:text}]
            fetch(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${to}&plain=plain`, {
                headers:{
                    'Authorization': 'Bearer ' + token,
                    'Content-type': 'application/json',
                    'cache-control': 'no-cache'
                },
                body:JSON.stringify(params),
                method:'POST',
                json: true,
            })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                resolve(res[0].translations[0].text)
            })
            .catch(err => reject(err))
        })
    }
}