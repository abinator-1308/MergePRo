import { Core } from "../state/core";

export interface CoreProps {
  core: Core;
}

export interface UpdateFormProps {
    title: string;
    openFunc(): void;
    desc: string;
  }