import { DialogflowCustomEvents, CustomQuickReplyItemProps } from "../types";

export const MagicCommandToEventMap: { [key: string]: string } = {
  "/exit": DialogflowCustomEvents.endSession,
  "/clear": DialogflowCustomEvents.clearMessages,
};

export const DEFAULT_QUICK_REPLIES: CustomQuickReplyItemProps[] = [
  {
    icon: "message",
    name: "Help",
    isHighlight: true,
  },
  {
    icon: "folder",
    name: "Search",
    isHighlight: true,
  },
  {
    icon: "compass",
    name: "Solve/simplify",
    isHighlight: true,
  },
  {
    icon: "search",
    name: "Recommend",
    isHighlight: true,
  },
  {
    icon: "bullhorn",
    name: "Summarize",
    isHighlight: true,
  },
  {
    icon: "cancel",
    code: "/exit",
    name: "Reset Conversation",
    event: DialogflowCustomEvents.endSession,
    isHighlight: true,
  },
  {
    icon: "smile",
    name: "Joke",
    isHighlight: true,
  },
];
