import flatten from "lodash/flatten";
import { observer } from "mobx-react-lite";
import React from "react";
import { Card } from "react-bootstrap";
import { Header } from "./design/Header";
import { Link } from "./design/Link";
import { CoreProps } from "../interface";
import { Item, Remove, Container } from "./design/styled-ignore-repo";

export const IgnoredRepositories = observer((props: CoreProps) => {
  const ignored = props.core.muteConfiguration.ignored || {};
  if (Object.keys(ignored).length === 0) {
    return <></>;
  }
  return (
    <Container>
      <Header>Ignored repositories</Header>
      <Card>
        {...flatten(
          Object.entries(ignored).map(([owner, config]) =>
            config.kind === "ignore-all" ? (
              <Item key={owner}>
                <Remove onClick={() => props.core.unmuteOwner(owner)}>+</Remove>
                <Link
                  href={`https://github.com/${owner}`}
                  target="_blank"
                >{`${owner}/*`}</Link>
              </Item>
            ) : (
              config.repoNames.map((repo) => (
                <Item key={`${owner}/${repo}`}>
                  <Remove
                    onClick={() =>
                      props.core.unmuteRepository({ owner, name: repo })
                    }
                  >
                    +
                  </Remove>
                  <Link
                    href={`https://github.com/${owner}/${repo}`}
                    target="_blank"
                  >{`${owner}/${repo}`}</Link>
                </Item>
              ))
            )
          )
        )}
      </Card>
    </Container>
  );
});
