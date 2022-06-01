import {
  User
} from "firebase/auth";
import { QuickReplyItemProps } from '@chatui/core'

export interface DialogFlowMessage {
  type: MessageTypes;
  text?: string | string[];
  items?: any[];
  options?: {
    text: string
    link: string
    image: {
      src: {
        rawUrl: string
      },
    },
  }[]
  title?: string;
  subtitle?: string;
  actionLink?: string;
  link?: string;
  event?: MessagePayload;
  rawUrl?: string;
  image?: {
    src: {
      rawUrl: string;
    };
  };
  icon?: {
    color: string;
    type: string;
  };
}

export interface MessagePayload {
  name: string;
  languageCode: string;
  parameters: { [key: string]: any };
}

export interface CustomQuickReplyItemProps extends QuickReplyItemProps {
  event?: DialogflowCustomEvents
}

export enum MessageTypes {
  text = "text",
  button = "button",
  image = "image",
  info = "info",
  description = "description",
  list = "list",
  accordion = "accordion",
  chips = "chips",
}

export interface BackgroundState {
  enableChatbot: boolean;
  user?: User | null;
  algebraNationData?: {
    useraccountId?: string;
    fallbackUseraccountId?: string
  }
}

export enum ChromeEvents {
  changeAppState = 'changeAppState',
  login = 'login',
  loginError = 'loginError',
  writeDataToDB = 'writeDataToDB'
}
export interface ChromeMessage<Payload = any> {
  type: ChromeEvents;
  payload: Payload
}

export interface ErrorMessagePayload {
  message: string
}

export interface FirebaseWritePayload {
  field: 'profile' | 'messages' | 'logs',
  data: any
}

export enum DialogflowCustomEvents {
  endSession = 'custom.end_session'
}
