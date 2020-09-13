import styled from "@emotion/styled";
import { Typography, Tooltip } from "@material-ui/core";
import { AuthorAvatarSize } from "../../constants";

const AuthorAvatar = styled.img`
  width: ${AuthorAvatarSize};
  height: ${AuthorAvatarSize};
  margin-right: 20px;
  border: 1px ridge #333;
  border-radius: 50%;
  position: relative;
  left: 67%;
`;
const StyledTypography = styled(Typography)`
  color: white;
  position: absolute;
  font-size: 16px;
  right: 30px;
  margin-right: 20px;
  top: 14px;
`;

const StyledTooltip = styled(Tooltip)`
  background-color: "#f5f5f9";
  color: "rgba(0, 0, 0, 0.87)";
  max-width: 220;
  border: "1px solid #dadde9";
  margin-left: 8px;
`;

export { AuthorAvatar, StyledTypography, StyledTooltip };
