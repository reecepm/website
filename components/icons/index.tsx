import { Project } from "../../data/projects";
import FlareIcon from "./Flare";
import { IconCircleLetterM } from "@tabler/icons";
import EscapeIcon from "./Escape";
import BlissIcon from "./Bliss";

export const getIconById = (id: Project["id"]) => {
  switch (id) {
    case "flare":
      return FlareIcon;
    case "escape":
      return EscapeIcon;
    case "bliss":
      return BlissIcon;
    default:
      return IconCircleLetterM;
  }
};
