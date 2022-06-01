import { create } from 'apisauce'
import { protos } from '@google-cloud/dialogflow-cx'

// define the api
const api = create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
})

export const talkToAgent = ({ message, event, userID }: { message: string, event?: string, userID?: string }) => {
    return api.post<protos.google.cloud.dialogflow.cx.v3.IDetectIntentResponse>('/chatbot/detectIntentByText', { message, event, userID })
}