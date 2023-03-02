import { TablerIcon, IconMinus, IconPlus } from "@tabler/icons";
import { cva } from "class-variance-authority";
import { m } from "framer-motion";
import { twMerge } from "tailwind-merge";
import SpotlightContainer from "../SpotlightContainer";

interface ItemProps {
  title: string;
  Icon: TablerIcon;
  children?: React.ReactNode;
  highlights?: React.ComponentProps<typeof SpotlightContainer>["highlights"];
  open?: boolean;
  onClick: () => void;
}

const Item: React.FC<ItemProps> = ({
  title,
  Icon,
  highlights,
  children,
  open,
  onClick,
}) => {
  return (
    <m.div
      onClick={onClick}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="w-full cursor-pointer sm:flex sm:cursor-default"
    >
      <SpotlightContainer
        fixedWidth="md"
        fixedHeight="md"
        padding="lg"
        spotlightSize="lg"
        highlights={highlights}
      >
        <div className="flex w-full flex-col gap-1 truncate">
          <div className="flex items-center justify-between">
            <div className="flex w-full items-center gap-3">
              <div className={iconWrapperStyles({ highlights })}>
                <Icon className={iconStyles({ highlights })} size={16} />
              </div>
              <div className="text-sm font-bold text-white lg:text-base">
                {title}
              </div>
            </div>
            <div className="flex text-white sm:hidden">
              {open ? (
                <IconMinus height={18} width={18} />
              ) : (
                <IconPlus height={18} width={18} />
              )}
            </div>
          </div>
          <div
            className={twMerge(
              "w-full whitespace-normal pt-3 text-xs text-neutral-400  lg:text-sm",
              open ? "flex" : "hidden sm:flex"
            )}
          >
            {children}
          </div>
        </div>
      </SpotlightContainer>
    </m.div>
  );
};

export default Item;

const iconWrapperStyles = cva(
  "flex items-center justify-center p-1 bg-neutral-500/20 border border-neutral-300/50 rounded-full transition-all",
  {
    variants: {
      highlights: {
        white: "group-hover:border-white/50 group-hover:bg-white/20",
        red: "group-hover:border-rose-500/50 group-hover:bg-rose-400/20",
        blue: "group-hover:border-blue-500/50 group-hover:bg-blue-400/20",
        green: "group-hover:border-green-500/50 group-hover:bg-green-400/20",
        purple: "group-hover:border-purple-500/50 group-hover:bg-purple-400/20",
      },
    },
  }
);

const iconStyles = cva("text-white transition-all", {
  variants: {
    highlights: {
      white: "text-white",
      red: "group-hover:text-rose-500",
      blue: "group-hover:text-blue-500",
      green: "group-hover:text-green-500",
      purple: "group-hover:text-purple-500",
    },
  },
});
