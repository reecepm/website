import { motion } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { Project } from "../../../data/projects";
import useOutsideClick from "../../../hooks/outsideCick";
import { ImageOrVideo } from "./ImageOrVideo";

interface ModalProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: number;
  setSelectedItem: React.Dispatch<React.SetStateAction<number>>;
  project: Project;
}

const SearchModal: React.FC<ModalProps> = ({
  setOpen,
  selectedItem,
  setSelectedItem,
  project,
}) => {
  const { ref: modalRef } = useOutsideClick(() => setOpen(false));
  const listRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [locked, setLocked] = useState(false);

  const filteredMedia = useMemo(() => {
    if (search === "") {
      return project.media;
    }
    return project.media.filter((item) => {
      return item.title.toLowerCase().includes(search.toLowerCase());
    });
  }, [search]);

  const [hoveredItem, setHoveredItem] = useState(0);

  const scrollIfNextItemIsOutOfView = (itemIndex: number) => {
    if (listRef.current) {
      listRef.current.children[itemIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex h-full w-full justify-center bg-black/40 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.15,
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (filteredMedia.length > 0 && filteredMedia[hoveredItem]) {
            setSelectedItem(hoveredItem);
            setOpen(false);
          }
        }

        if (e.key === "ArrowUp") {
          e.preventDefault();
          setLocked(true);
          const hovered =
            hoveredItem > 0 ? hoveredItem - 1 : filteredMedia.length - 1;
          setHoveredItem(hovered);
          scrollIfNextItemIsOutOfView(hovered);
        }

        if (e.key === "ArrowDown") {
          e.preventDefault();
          setLocked(true);
          const hovered =
            hoveredItem < filteredMedia.length - 1 ? hoveredItem + 1 : 0;
          setHoveredItem(hovered);
          scrollIfNextItemIsOutOfView(hovered);
        }
      }}
    >
      <motion.div
        className="mt-[25vh] w-full max-w-xl"
        ref={modalRef}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        onClick={() => setOpen(false)}
        layout
      >
        <motion.div
          className="border border-neutral-700 bg-neutral-900 shadow-lg"
          onClick={(e) => e.stopPropagation()}
          layout
          transition={spring}
          style={{
            borderRadius: 16, // fix jittering by setting it inline
          }}
        >
          <motion.input
            layout="position"
            type="text"
            placeholder="Search..."
            autoFocus
            className="w-full border-b border-neutral-800 bg-transparent px-7 py-4 text-white outline-none placeholder:text-neutral-500"
            value={search}
            onChange={(e) => {
              setHoveredItem(0);
              setSearch(e.target.value);
            }}
          />
          <motion.div
            className="z-0 flex max-h-80 flex-col overflow-auto py-3 px-4"
            layout="position"
            transition={spring}
            ref={listRef}
          >
            {filteredMedia.length === 0 ? (
              <motion.div
                className="p-3 text-sm text-neutral-500"
                layout="position"
              >
                No results found for "{search}"
              </motion.div>
            ) : (
              filteredMedia.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="relative cursor-pointer"
                  onClick={() => {
                    setSelectedItem(item.id);
                    setOpen(false);
                  }}
                  onMouseEnter={() => {
                    if (!locked) {
                      setHoveredItem(index);
                    }
                  }}
                  onMouseLeave={() => setLocked(false)}
                  layout="position"
                  transition={spring}
                >
                  {hoveredItem === index && (
                    <motion.div
                      className="absolute z-0 h-full w-full rounded-xl bg-white/10"
                      layoutId="selected"
                      transition={spring}
                      layout
                    />
                  )}
                  <motion.div
                    className="relative z-10 flex items-center gap-3 p-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div
                      className={twMerge(
                        "relative h-[72px] w-32 overflow-hidden rounded-md",
                        selectedItem === index
                          ? "bg-neutral-800"
                          : "bg-neutral-900"
                      )}
                    >
                      <ImageOrVideo item={item.src} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">
                        {item.title}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {item.desc}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))
            )}
          </motion.div>
          <div
            className="flex w-full items-center justify-between border-t border-neutral-800 px-7 py-4"
            // layout="position"
            // transition={spring}
          >
            <div className="text-sm font-medium text-neutral-500">
              {project.name}
            </div>
            <div className="flex gap-2 text-sm font-medium text-white">
              View Media
              <div className="flex items-center justify-center rounded-md bg-white/5 px-2 pt-1 text-xs">
                ↵
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SearchModal;

const spring = {
  type: "spring",
  stiffness: 1000,
  damping: 70,
};

const easeIn = {
  hidden: {
    y: "5vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.15,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};
