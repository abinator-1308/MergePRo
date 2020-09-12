import styled from "@emotion/styled";
import { Paragraph } from "./Paragraph";

const List = styled.div`
  border: 1px solid #ddd;
  border-radius: 0 8px 8px 8px;
  margin-bottom: 16px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;
`;

const OpenAllParagraph = styled(Paragraph)`
  display: inline-block;
  text-align: center;
  position: relative;
  left: 45%;
  color: #777;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;
`;

export { OpenAllParagraph, List };
