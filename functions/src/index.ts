import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
// import Axios from "axios"
import * as twilio from 'twilio'
import { v4 } from 'uuid';

const client = twilio(functions.config().twilio.test.account_sid, functions.config().twilio.test.auth_token);

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://spaas-8500c.firebaseio.com'
})

// const makeRequest = (token = "", prefix?: string, length?: number) => {
//     return Axios.create({
//         timeout: 50000,
//         headers: {
//             Authorization: `${prefix ? prefix : 'Bearer'} ${token}`,
//         },
//     });
// };
// const messageRequest = await makeRequest(
//     functions.config().bulksms.api_auth, 'Basic', messageObj.length
// ).post(`${functions.config().bulksms.base_url}/messages`, messageObj);

exports.sendSMS = functions.https.onCall(async (data, context) => {
    try {
        const { recipients, message, saveAsTemplate } = data
        const date = new Date().toISOString()
        const userId = context.auth?.uid

        if (recipients.length < 1 || !message.content) {
            return {
                error: true,
                message:
                    "recipients, message title and message content must be provided."
            };
        }

        recipients.forEach((recipient: { phoneNumber: string }) => {
            client.messages.create({
                to: recipient.phoneNumber,
                from: '+12514517566',
                body: message.content
            })
                .then(() => {
                    return true;
                })
                .catch((err) => {
                    console.log(err);
                    return false;
                })
        });

        if (saveAsTemplate) {
            const id = v4()
            await admin.firestore().collection('templates').doc(id).set({ ...message, id, templateOwner: userId, date })
        }

        const mid = v4()
        await admin.firestore().collection('messageHistory').doc(mid).set({ ...message, recipients, id: mid, messageOwner: userId, date })
    } catch (error) {
        console.log(error)
        return error.message
    }
})