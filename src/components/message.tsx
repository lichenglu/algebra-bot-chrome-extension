import React from "react";
import {
  Bubble,
  Button,
  Divider,
  Card,
  CardMedia,
  CardTitle,
  CardText,
  ScrollView,
  Flex,
  FlexItem,
  MessageProps as ChatMessageProps,
} from "@chatui/core";
import { Tag, Avatar, Image } from "antd";
import { BulbOutlined } from "@ant-design/icons";

import { MessageTypes } from "../types";
import schnauzerImg from "../assets/schnauzer.png";
import { trimString } from "../utils";
import TruncatedList from "../components/truncatedList";

export interface MessageProps extends ChatMessageProps {
  buttonProps?: {
    onClick?: (
      msg: ChatMessageProps,
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
  };
}

const Message: React.FC<MessageProps> = ({ buttonProps, ...msg }) => {
  const { content, type, position } = msg;
  let contentComponent;
  
  switch (type) {
    case MessageTypes.text:
      contentComponent = <Bubble content={content.text} />;
      break;
    case MessageTypes.image:
      contentComponent = (
        <Image
          width={"50%"}
          src={content.imgUrl}
          placeholder={
            <Image
              preview={false}
              src="data:image/png;base64,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"
              width={200}
            />
          }
        />
      );
      break;
    case MessageTypes.button:
      contentComponent = (
        <Button
          variant="float"
          label={content.text}
          onClick={(e) => buttonProps?.onClick?.(msg, e)}
        />
      );
      break;
    case MessageTypes.chips:
      contentComponent = (
        <ScrollView
          data={content.items}
          renderItem={(item) => {
            return (
              <Tag
                key={item._id}
                icon={<BulbOutlined />}
                onClick={() =>
                  item.actionLink && window.open(item.actionLink, "_blank")
                }
                color="magenta"
              >
                {item.text}
              </Tag>
            );
          }}
        />
      );
      break;
    case MessageTypes.search:
        contentComponent = (
          <ScrollView
            data={content.items}
            renderItem={(item) => {
              return (
                <Card
                    key={item._id}
                    className={"SearchCard"}
                    // @ts-ignore
                    onClick={() => {
                      // record starting position for automatic playback
                      if (item.videoId) {
                        localStorage.setItem(`bot-video-${item.videoId}`, item.startTime)
                      }
                      item.actionLink && window.open(item.actionLink, "_blank")
                    }}
                  >
                    {item.imgUrl && (
                      <CardMedia image={item.imgUrl} aspectRatio="wide" />
                    )}
                    {item.topicName && (
                      <CardTitle title={trimString(item.section.split(':').shift() + " " + item.topicName, 50)} />
                    )}
                    {item.text && (
                      <CardText>{`Confidence: ${(item.score * 100).toFixed(2)}% `}{trimString(item.text, 120)}</CardText>
                    )}
                </Card>
              );
            }}
          />
        );
        break;
    case MessageTypes.info:
      contentComponent =
        content.items?.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Divider>{content.text}</Divider>
            <ScrollView
              data={content.items}
              renderItem={(item) => {
                return (
                  <Card
                    key={item._id}
                    className={item.imgUrl ? "resource-with-img" : ""}
                    // @ts-ignore
                    onClick={() =>
                      item.actionLink && window.open(item.actionLink, "_blank")
                    }
                  >
                    {item.imgUrl && (
                      <CardMedia image={item.imgUrl} aspectRatio="wide" />
                    )}
                    {item.text && (
                      <CardTitle title={trimString(item.text, 50)} />
                    )}
                    {/* @ts-ignore */}
                    {item.description && (
                      <CardText>{trimString(item.description)}</CardText>
                    )}
                  </Card>
                );
              }}
            />
          </div>
        ) : (
          <Card
            // @ts-ignore
            onClick={() => window.open(content.actionLink, "_blank")}
          >
            {content.imgUrl && (
              <CardMedia image={content.imgUrl} aspectRatio="wide" />
            )}
            <CardTitle title={trimString(content.text, 50)} />
            {/* @ts-ignore */}
            {content.description && (
              <CardText>{trimString(content.description)}</CardText>
            )}
          </Card>
        );
      break;
    case MessageTypes.description:
      contentComponent = (
        <div>
          <Divider>{content.text as string}</Divider>
          <Bubble>
            <TruncatedList
              items={content.items}
              renderItem={({ text, description, _id }) => (
                <div className="listItem" key={_id}>
                  <h3>{text}</h3>
                  <p>{description}</p>
                </div>
              )}
            />
          </Bubble>
        </div>
      );
      break;
    default:
      contentComponent = <></>;
      break;
  }

  if (
    [
      MessageTypes.chips,
      MessageTypes.info,
      MessageTypes.description,
      MessageTypes.button,
      MessageTypes.search,
    ].includes(type as MessageTypes)
  ) {
    return contentComponent;
  }

  const isChatbot = position === "left";
  const avatarStle = { color: "#f56a00", backgroundColor: "#fde3cf" };

  return (
    <Flex direction={isChatbot ? "row" : "row-reverse"}>
      {isChatbot ? (
        <Avatar style={avatarStle} src={chrome.runtime?.getURL?.(schnauzerImg) ?? schnauzerImg} size={40} />
      ) : (
        <Avatar style={avatarStle} size={40}>
          You
        </Avatar>
      )}
      <div style={{ width: 4 }} />
      <FlexItem>{contentComponent}</FlexItem>
    </Flex>
  );
};

export default Message;
