import React from "react";
import { Button } from "@material-ui/core";
import { Center } from "./design/Center";
import { Paragraph } from "./design/Paragraph";
import { UpdateFormProps } from "../interface";

export const UpdateForm = (props: UpdateFormProps) => (
  <>
    <Paragraph>{props.desc}</Paragraph>
    <Center>
      <Button
        variant="contained"
        color="primary"
        onClick={props.openFunc}
        size="medium"
        style={{ margin: "5px" }}
      >
        {props.title}
      </Button>
    </Center>
  </>
);
