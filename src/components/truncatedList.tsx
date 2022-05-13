import React, { useState, useMemo, useEffect } from "react";
import { Button } from "antd";
import styled from "styled-components";
import { BellOutlined } from "@ant-design/icons";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
`;

export interface TruncatedListProps {
  items: any[];
  step?: number;
  renderItem: (item: any) => React.ReactNode;
}

const TruncatedList: React.FC<TruncatedListProps> = ({
  items,
  renderItem,
  step,
}) => {
  const [visibleNum, setVisibleNum] = useState(1);
  const reachedMax = useMemo(() => {
    return visibleNum >= items.length;
  }, [visibleNum]);

  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typeset === "function") {
      window.MathJax.typeset();
    }
  }, [visibleNum]);

  const handleShowClick = () => {
    let candidate = visibleNum + (step ?? items.length - 1);
    if (candidate > items.length) {
      candidate = 1;
    }
    setVisibleNum(candidate);
  };

  return (
    <Container>
      {items.slice(0, visibleNum).map((item, idx) => renderItem(item))}
      <div
        style={{
          alignSelf: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!reachedMax && <h2>...</h2>}
        <Button
          onClick={handleShowClick}
          icon={<BellOutlined />}
          type="primary"
        >
          {reachedMax ? "Collapse" : "Show More"}
        </Button>
      </div>
    </Container>
  );
};

export default TruncatedList;
