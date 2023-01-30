import { Project } from "../../data/projects";
import FlareIcon from "./Flare";

export const getIconById = (id: Project["id"]) => {
  switch (id) {
    default:
      return FlareIcon;
  }
};
