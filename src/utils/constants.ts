import { DialogflowCustomEvents } from '../types'

export const MagicCommandToEventMap: { [key: string]: string } = {
    '/exit': DialogflowCustomEvents.endSession
}