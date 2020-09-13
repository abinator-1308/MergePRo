import styled from "@emotion/styled";
import { MediumButton } from "./Button";

const Container = styled.div`
  margin: 16px 0;
`;

const Item = styled.div`
  padding: 8px;
`;

const Remove = styled(MediumButton)`
  margin-left: 0;
  margin-right: 8px;
`;

export { Container, Item, Remove };
