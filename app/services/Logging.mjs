import fetch from 'node-fetch'
import dotenv from "dotenv"
dotenv.config()
const ErrorLog = async(title, message, productId = 'Unset') => {

    try {
        const params = {
            'username': 'Error notifier',
            'text': title, 
            'icon_emoji': ':bangbang:',
            'attachments': [{ 
                'color': '#eed140', 
                'fields': [ 
                    {
                        'title': 'Environment',
                        'value': 'Production', 
                        'short': true
                    },
                    {
                        'title': 'Product ID',
                        'value': productId,
                        'short': true
                    },
                    {
                        "title": "Error Code",
                        "value": message,
                        "short": false 
                      }
                ]
            }]
        }

        const postLog = await fetch(`https://hooks.slack.com/services/${process.env.SLACK_KEY}`, {
            method:'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(params)
        })
    } catch (error) {
        console.log(error.message)
    }

}

export {
    ErrorLog
}