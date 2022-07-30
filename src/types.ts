import { User } from "firebase/auth";
import { QuickReplyItemProps } from "@chatui/core";

export interface DialogFlowChipOption {
  text: string;
  link: string;
  image: {
    src: {
      rawUrl: string;
    };
  };
}

export interface DialogFlowSearchOption {
  score: number;
  metadata: {
    endTime: number;
    startTime: number;
    name: string;
    section: string;
    sectionId: string;
    tutorId: string;
    text: string;
    videoId: number;
  };
}
export interface DialogFlowMessage {
  type: MessageTypes;
  text?: string | string[];
  items?: any[];
  options?: (DialogFlowChipOption | DialogFlowSearchOption)[];
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
  event?: DialogflowCustomEvents;
}

export enum MessageTypes {
  text = "text",
  button = "button",
  image = "image",
  iframe = "iframe",
  info = "info",
  description = "description",
  list = "list",
  accordion = "accordion",
  chips = "chips",
  search = "search",
}

export interface BackgroundState {
  enableChatbot: boolean;
  user?: User | null;
  algebraNationData?: {
    useraccountId?: string;
    fallbackUseraccountId?: string;
  };
}

export enum ChromeEvents {
  changeAppState = "changeAppState",
  login = "login",
  loginError = "loginError",
  writeDataToDB = "writeDataToDB",
  loadWithVideo = "loadWithVideo",
}
export interface ChromeMessage<Payload = any> {
  type: ChromeEvents;
  payload: Payload;
}

export interface ErrorMessagePayload {
  message: string;
}

export interface FirebaseWritePayload {
  field: "profile" | "messages" | "logs";
  data: any;
}

export enum DialogflowCustomEvents {
  endSession = "custom.end_session",
  clearMessages = "clearMessages",
}

export enum ANTutors {
  amy = 1,
  ashley = 2,
  darnell = 3,
  jose = 6,
  kiana = 8,
  zach = 5
}

export const ANTutorMap = {
  [ANTutors.amy]: 'Amy',
  [ANTutors.ashley]: 'Ashley',
  [ANTutors.darnell]: 'Darnell',
  [ANTutors.jose]: 'Jose',
  [ANTutors.kiana]: 'Kiana',
  [ANTutors.zach]: 'Zach',
}