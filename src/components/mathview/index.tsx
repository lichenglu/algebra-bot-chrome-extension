import React, { useCallback, useRef } from "react";
import styled from "styled-components";
import MathView, { MathViewProps, MathViewRef, MathFieldChangeEvent } from "@edpi/react-math-view";

import { HIGH_SCHOOL_KEYBOARD_LAYER, HIGH_SCHOOL_KEYBOARD } from './config';

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0px 8px;
  border: 1px solid #1990ff;
  .my-mathview {
    flex: 1;
    padding: 8px;
  }
  span {
    width: 36px;
    display: flex;
    margin-left: 6px;
    color: #1990ff;
    cursor: pointer;
    transition: color 0.2s;
    &:hover {
      color: #002766;
    }
  }
`;
const MathWithKeyboardButton = React.memo((props: MathViewProps) => {
  const ref = useRef<MathViewRef>(null);

  const onChange = useCallback(
    (e: React.SyntheticEvent<HTMLInputElement, MathFieldChangeEvent>) => {
      props.onChange?.(e);
    },
    [props.onChange]
  );

  return (
    <Container>
      <MathView
        value={props.value ?? ''}
        onChange={onChange}
        className="my-mathview"
        ref={ref}
        fontsDirectory={chrome.runtime?.getURL?.('./src/assets/fonts')}
        customVirtualKeyboardLayers={HIGH_SCHOOL_KEYBOARD_LAYER}
        customVirtualKeyboards={HIGH_SCHOOL_KEYBOARD}
        virtualKeyboards={"high-school-keyboard"}
        virtualKeyboardMode="manual"
        {...props}
      />
    </Container>
  );
});

export default MathWithKeyboardButton;
