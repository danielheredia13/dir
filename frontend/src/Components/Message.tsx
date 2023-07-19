import React from "react";
import { Alert } from "react-bootstrap";

interface MessageProps {
  variant: string;
  text: string;
  errorReset: () => void;
}

const Message: React.FC<MessageProps> = ({ variant, text, errorReset }) => {
  return (
    <Alert className="message" onClick={errorReset} variant={variant}>
      {text}
    </Alert>
  );
};

export default Message;
