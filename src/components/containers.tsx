import styled from 'styled-components';
import { Spin } from 'antd'

const getPosition = () => {
  if (document.URL.includes('algebranation')) {
    return ['100px', '104px']
  }
  return ['24px', '24px']
}

const [bottom, right] = getPosition()

export const AppContainer = styled.div`
  .chatbot__authentication {
    position: fixed;
    bottom: calc(${bottom} + 64px);
    right: calc(${right} + 64px);
  }

  .ChatApp {
    position: fixed;
    min-height: 720px;
    height: 60vh;
    width: 540px;
    bottom: calc(${bottom} + 64px);
    right: calc(${right} + 64px);
    z-index: 104;

    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

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

    .SearchCard {
      height: 260px;
    }
  }
`;

export const TagContainer = styled.div`
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
`

export const Toggle = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  position: fixed;
  bottom: ${bottom};
  right: ${right};
  cursor: pointer;
  z-index: 104;
`;