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

import {
  User
} from "firebase/auth";

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
  user?: User;
  algebraNationData?: {
    useraccountId?: string;
    fallbackUseraccountId?: string
  }
}

export enum ChromeEvents {
  changeAppState = 'changeAppState',
  login = 'login',
  writeDataToDB = 'writeDataToDB'
}
export interface ChromeMessage {
  type: ChromeEvents;
  payload: FirebaseWritePayload | string
}

export interface FirebaseWritePayload {
  field: 'profile' | 'messages' | 'logs',
  data: any
}

export enum DialogflowCustomEvents {
  endSession = 'custom.end_session'
}
