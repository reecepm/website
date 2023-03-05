import Image, { StaticImageData } from "next/image";

interface Props {
  item: StaticImageData | string;
  autoPlay?: boolean;
}

export const ImageOrVideo: React.FC<Props> = ({ item, autoPlay }) => {
  const src = typeof item === "string" ? item : item.src;
  return src.includes(".mp4") ? (
    <video playsInline muted autoPlay={!!autoPlay} src={src} />
  ) : (
    <Image
      src={item}
      fill
      quality={100}
      placeholder={typeof item !== "string" ? "blur" : undefined}
      className="max-w-none scale-[1.02] border-none shadow-none outline-none"
      alt={`Media ${item}`}
    />
  );
};
