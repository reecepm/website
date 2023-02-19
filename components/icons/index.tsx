import { Project } from "../../data/projects";
import FlareIcon from "./Flare";
import {
  IconCircleLetterM,
  IconGrave2,
  IconTriangleSquareCircle,
} from "@tabler/icons";
import EscapeIcon from "./Escape";
import BlissIcon from "./Bliss";

export const getIconById = (id: Project["id"]) => {
  switch (id) {
    case "flare":
      return { Icon: FlareIcon, fill: true };
    case "escape":
      return { Icon: EscapeIcon, fill: true };
    case "bliss":
      return { Icon: BlissIcon, fill: true };
    case "malice":
      return { Icon: IconCircleLetterM, fill: false };
    case "upcoming":
      return { Icon: IconTriangleSquareCircle, fill: false };
    case "graveyard":
      return { Icon: IconGrave2, fill: false };
    default:
      return { Icon: IconTriangleSquareCircle, fill: false };
  }
};
