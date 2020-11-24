import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import Axios, { AxiosResponse } from "axios"
// import * as twilio from 'twilio'
import { v4 } from 'uuid';

// const client = twilio(functions.config().twilio.live.account_sid, functions.config().twilio.live.auth_token);

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://spaas-8500c.firebaseio.com'
})

const makeRequest = (token = "", prefix?: string, length?: number) => {
    return Axios.create({
        timeout: 50000,
        headers: {
            Authorization: `${prefix ? prefix : 'Bearer'} ${token}`
        }
    });
};

async function addMessageTemplate(message: { title: string, content: string }, userId: string, date: string) {
    const id = v4()
    await admin.firestore().collection('templates').doc(id).set({ ...message, id, templateOwner: userId, date })
}

async function sendBulkSMS(to: string, body: string): Promise<Boolean> {
    const messageRequest: AxiosResponse = await makeRequest().post(`${functions.config().bulksms_nigeria.base_url}/sms/create?api_token=${functions.config().bulksms_nigeria.api_token}&from=VoyaService&to=${to}&body=${body}&dnd=${4}`);
    const { error } = messageRequest.data
    if (error) {
        return false
    } else {
        return true
    }
}

exports.sendSMS = functions.https.onCall(async (data, context) => {
    try {
        const { recipients, message, saveAsTemplate } = data
        const date = new Date().toISOString()
        const userId = context.auth && context.auth.uid ? context.auth.uid : ''

        if (recipients.length < 1 || !message.content) {
            return {
                error: true,
                message:
                    "recipients, message title and message content must be provided."
            };
        }
        const receivers: string[] = []
        recipients.forEach(async (recipient: { phoneNumber: string }, index: number) => {
            receivers.push(recipient.phoneNumber)
            if (index === recipients.length - 1) {
                await sendBulkSMS(receivers.join(','), message.content)
            }
            // client.messages.create({
            //     to: recipient.phoneNumber,
            //     from: functions.config().twilio.live.phone,
            //     messagingServiceSid: functions.config().twilio.live.messaging_service_id,
            //     body: message.content
            // })
            //     .then(() => {
            //         return true;
            //     })
            //     .catch((err) => {
            //         console.log(err);
            //         return false;
            //     })
        });

        if (saveAsTemplate) {
            await addMessageTemplate(message, userId, date)
        }

        const mid = v4()
        await admin.firestore().collection('messageHistory').doc(mid).set({ ...message, recipients, id: mid, messageOwner: userId, date })
    } catch (error) {
        console.log(error)
        return error.message
    }
})

exports.createMessageTemplate = functions.https.onCall(async (data, context) => {
    try {
        const { title, content } = data
        const date = new Date().toISOString()
        const userId = context.auth && context.auth.uid ? context.auth.uid : ''

        if (!title || !content) {
            return {
                error: true,
                message:
                    "template title and content must be provided."
            };
        }

        await addMessageTemplate({ title, content }, userId, date)

        return {
            error: false
        }
    } catch (error) {
        console.log(error)
        return {
            error: false,
            msg: error.message
        }
    }
})