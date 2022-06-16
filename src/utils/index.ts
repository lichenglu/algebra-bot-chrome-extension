import { MessageProps } from "@chatui/core";
import { protos } from "@google-cloud/dialogflow-cx";
import { flatten } from "ramda";

import { DialogFlowMessage, DialogFlowChipOption, DialogFlowSearchOption, MessageTypes, BackgroundState } from "../types";

export * from './constants'

export interface EnhancedMessagePros extends MessageProps {
  parentId: string
}

export const transformDialogflowToChatUI = (
  response: protos.google.cloud.dialogflow.cx.v3.IDetectIntentResponse,
  parentId: string
): EnhancedMessagePros[] => {
  const id = response.responseId!;
  return flatten<EnhancedMessagePros[][][]>(
    // @ts-ignore
    response.queryResult?.responseMessages?.map((msg, idx) => {
      if (msg.text) {
        return {
          _id: `${id}_${idx}_${MessageTypes.text}`,
          type: MessageTypes.text,
          content: {
            text: msg.text.text?.[0],
          },
          position: "left",
          parentId
        };
      }

      if (msg.payload) {
        // @ts-ignore
        return msg.payload.richContent.map(
          (richContent: DialogFlowMessage[], idx2: number) => {
            return richContent.map((content, idx3: number) => {
              if (!content) {
                return undefined;
              }

              if (content.options && content.type === MessageTypes.chips) {
                return {
                  _id: `${id}_${idx}_${idx2}_${idx3}_${content.type}`,
                  type: content.type,
                  content: {
                    items: content.options.map((opt, idx4) => {
                      const _opt = opt as DialogFlowChipOption
                      return {
                        _id: `${id}_${idx}_${idx2}_${idx3}_${idx4}_${content.type}`,
                        text: _opt.text,
                        actionLink: _opt.link,
                        imgUrl: _opt.image?.src,
                        position: "left",
                      };
                    }),
                  },
                  position: "left",
                  parentId
                };
              }

              if (content.options && content.type === MessageTypes.search) {
                return {
                  _id: `${id}_${idx}_${idx2}_${idx3}_${content.type}`,
                  type: content.type,
                  content: {
                    items: content.options.map((opt, idx4) => {
                      const _opt = opt as DialogFlowSearchOption
                      return {
                        _id: `${id}_${idx}_${idx2}_${idx3}_${idx4}_${content.type}`,
                        score: _opt.score,
                        text: _opt.metadata.text,
                        topicName: _opt.metadata.name,
                        section: _opt.metadata.section,
                        videoId: _opt.metadata.videoId,
                        startTime: _opt.metadata.startTime,
                        actionLink: `https://web.algebranation.com/video/${_opt.metadata.videoId}`,
                        position: "left",
                      };
                    }),
                  },
                  position: "left",
                  parentId
                };
              }

              return {
                _id: `${id}_${idx}_${idx2}_${idx3}_${content.type}`,
                type: content.type,
                content: {
                  text: content.title ?? content.text,
                  items: Array.isArray(content.text)
                    ? content.text
                    : content.items
                    ? content.items.map((item, idx4: number) => ({
                        _id: `${id}_${idx}_${idx2}_${idx3}_${idx4}_${content.type}`,
                        type: content.type,
                        text: item.title ?? item.text,
                        actionLink: item.actionLink ?? item.link,
                        description: item.subtitle ?? item.description,
                        imgUrl: item.rawUrl ?? item.image?.src,
                        event: item.event,
                      }))
                    : [],
                  actionLink: content.actionLink ?? content.link,
                  description: content.subtitle,
                  imgUrl: content.rawUrl ?? content.image?.src,
                  event: content.event,
                },
                position: "left",
                parentId
              };
            });
          }
        );
      }

      return undefined;
    })
  ).filter((msg) => !!msg);
};

// https://stackoverflow.com/a/3410547
export const trimString = (str: string, limit: number = 100) => {
  return str.slice(0, limit + 1) + "...";
};

export function indexes(source: string, find: string) {
  if (!source) {
    return [];
  }
  // if find is empty string return all indexes.
  if (!find) {
    // or shorter arrow function:
    // return source.split('').map((_,i) => i);
    return source.split("").map(function (_, i) {
      return i;
    });
  }
  var result = [];
  for (let i = 0; i < source.length; ++i) {
    // If you want to search case insensitive use
    // if (source.substring(i, i + find.length).toLowerCase() == find) {
    if (source.substring(i, i + find.length) == find) {
      result.push(i);
    }
  }
  return result;
}

export function findTargetDelimiter(source: string, cursorStartIndex: number) {
  const delimiterIndices = indexes(source, "$");

  // there should always be a even number for pairs of $
  if (delimiterIndices.length % 2 !== 0) {
    return;
  }

  // https://stackoverflow.com/a/8495740
  const chunkSize = 2;

  for (let i = 0; i < delimiterIndices.length; i += chunkSize) {
    const [start, end] = delimiterIndices.slice(i, i + chunkSize);
    if (cursorStartIndex >= start && cursorStartIndex <= end) {
      return [start, end]
    }
  }
}

export function replaceRange(s: string, start: number, end: number, substitute: string) {
  return s.substring(0, start) + substitute + s.substring(end);
}

export async function setBackgroundState(newData: Partial<BackgroundState>) {
  const oldData = await chrome.storage.local.get("appState");
  chrome.storage.local.set({
    appState: {
      ...oldData.appState,
      ...newData
    },
  });
}

export function injectScript(file: string, node: string) {
  var th = document.getElementsByTagName(node)[0];
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  th.appendChild(s);
}

export function convertMS(sec: number) {
  let hours   = Math.floor(sec / 3600); // get hours
  let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
  let seconds = Math.floor(sec - (hours * 3600) - (minutes * 60)); //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  if (minutes < 10) {minutes = "0"+minutes.toFixed(0);}
  if (seconds < 10) {seconds = "0"+seconds.toFixed(0);}
  return minutes+':'+seconds; // Return is HH : MM : SS
}
