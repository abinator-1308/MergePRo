import { Filter } from "../filtering/filters";
import { Core } from "../state/core";

export interface CoreProps {
  core: Core;
}

export interface UpdateFormProps {
  title: string;
  openFunc(): void;
  desc: string;
}

export interface PopupState {
  currentFilter: Filter;
}
