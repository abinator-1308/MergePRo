import styled from "@emotion/styled";
import { AuthorAvatarSize, AuthorWidth } from "../../constants";

const PullRequestBox = styled.a`
  display: flex;
  flex-direction: row;
  background-color: rgb(225, 228, 232);
  justify-content: space-between;
  text-decoration: none;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #eef5ff;
    text-decoration: none;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;
`;

const Title = styled.div`
  padding: 8px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;
`;

const Repo = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9em;
  padding: 8px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;
`;

const AuthorBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;
  width: ${AuthorWidth};
  padding: 8px;
`;

const AuthorAvatar = styled.img`
  width: ${AuthorAvatarSize};
  height: ${AuthorAvatarSize};
  margin-right: 20px;
  border: 1px ridge #333;
  border-radius: 50%;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;
`;

const AuthorLogin = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: 20px;
  font-size: 0.9em;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;
  max-width: ${AuthorWidth};
`;

export {
  AuthorAvatar,
  AuthorBox,
  PullRequestBox,
  AuthorLogin,
  Info,
  Title,
  Repo,
};
