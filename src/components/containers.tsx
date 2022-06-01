import styled from 'styled-components';
import { Spin } from 'antd'

export const AppContainer = styled.div`
  .chatbot__authentication {
    position: fixed;
    bottom: calc(24px + 64px);
    right: calc(24px + 64px);
  }

  .ChatApp {
    position: fixed;
    min-height: 720px;
    height: 60vh;
    width: 540px;
    bottom: calc(24px + 64px);
    right: calc(24px + 64px);

    .Input {
      font-size: 16px;
    }

    .Message {
      font-size: 16px;
      h3 {
        font-size: 18px;
      }
      .Time {
        font-size: 14px;
      }
    }
    
    .Btn {
      font-size: 14px;
    }

    .CardTitle-title {
      font-size: 18px;
    }

    .Navbar {
      background-color: #383838;
      border-radius: 5px 5px 0 0;
    }
    
    .Navbar-title {
      font-size: 18px;
      color: #fcfcfc;
    }

    .QuickReply {
      font-size: 16px;
    }

    .ScrollView-inner {
      padding: 4px;
    }

    .ScrollView-item {
      transition: margin 0.2s ease-in-out, box-shadow 0.2s;
      &:hover {
        margin-top: -3px;
      }
    }

    .ant-tag {
      cursor: pointer;
      &:hover {
        box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
      }
    }

    .Card {
      width: 260px;
      cursor: pointer;
      height: 174px;
      &:hover {
        box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
      }
    }

    .Card.resource-with-img {
      height: 338px;
    }
  }
`;

export const TagContainer = styled.div`
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
`