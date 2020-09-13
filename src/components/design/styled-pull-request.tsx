import styled from "@emotion/styled";
import { AuthorAvatarSize, AuthorWidth } from "../../constants";

const PullRequestBox = styled.a`
  display: flex;
  flex-direction: row;
  background-color: rgb(225, 228, 232);
  justify-content: space-between;
  text-decoration: none;
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
`;

const Title = styled.div`
  padding: 8px;
`;

const Repo = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9em;
  padding: 8px;
`;

const AuthorBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${AuthorWidth};
  padding: 8px;
`;

const AuthorAvatar = styled.img`
  width: ${AuthorAvatarSize};
  height: ${AuthorAvatarSize};
  margin-right: 20px;
  border: 1px ridge #333;
  border-radius: 50%;
`;

const AuthorLogin = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: 20px;
  font-size: 0.9em;
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
