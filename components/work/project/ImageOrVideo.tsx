import Image from "next/image";

interface Props {
  item: string;
  autoPlay?: boolean;
}

export const ImageOrVideo: React.FC<Props> = ({ item, autoPlay }) =>
  item.includes(".mp4") ? (
    <video playsInline muted autoPlay={!!autoPlay} src={item} />
  ) : (
    <Image
      src={item}
      fill
      quality={100}
      className="max-w-none scale-[1.02] border-none shadow-none outline-none"
      alt={`Media ${item}`}
    />
  );
