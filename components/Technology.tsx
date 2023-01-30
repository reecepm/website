import { ReactJs } from "@icons-pack/react-simple-icons";
import { IconQuestionMark } from "@tabler/icons";
import React from "react";
import { technologies } from "../data/technologies";

interface Props {
  id: keyof typeof technologies;
}

const Technology: React.FC<Props> = ({ id }) => {
  if (!(id in technologies)) {
    return (
      <div className="flex gap-2 items-center">
        <IconQuestionMark size={16} />
        <div className="truncate">Not found</div>
      </div>
    );
  }

  const { Icon, name } = technologies[id];

  return (
    <div className="flex gap-2 items-center">
      <Icon size={16} />
      <div className="truncate">{name}</div>
    </div>
  );
};

export default Technology;
