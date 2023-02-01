import React, { useEffect } from "react";
import { useLanyard, useLanyardWS } from "use-lanyard";
import SpotlightContainer from "./SpotlightContainer";
import Image from "next/image";
import Link from "next/link";
import { useColor, usePalette } from "color-thief-react";
import { ArrayRGB } from "color-thief-react/lib/types";

interface SpotifyProps {
  albumColors: ArrayRGB[] | undefined;
  setAlbumColors: React.Dispatch<React.SetStateAction<ArrayRGB[] | undefined>>;
}

const Spotify: React.FC<SpotifyProps> = ({ setAlbumColors, albumColors }) => {
  const isLoading = false;
  const user = useLanyardWS(process.env.NEXT_PUBLIC_DISCORD_ID as `${bigint}`);

  const inner = (
    <SpotlightContainer padding="md" fixedWidth="sm">
      {isLoading ? (
        <div className="h-16 w-16 bg-slate-300 rounded-xl animate-pulse"></div>
      ) : user?.spotify?.album_art_url ? (
        <ImageWithExtractor
          src={user.spotify.album_art_url}
          alt={user?.spotify?.song || "Reece Martin"}
          albumColors={albumColors}
          setAlbumColors={setAlbumColors}
        />
      ) : (
        <div className="h-16 w-16 bg-slate-300 rounded-xl"></div>
      )}
      <div className="flex flex-col gap-1 flex-grow overflow-hidden min-w-0">
        {isLoading ? (
          <>
            <div className="h-3.5 w-24 bg-slate-300 rounded-full animate-pulse"></div>
            <div className="h-3.5 w-20 bg-slate-300 rounded-full animate-pulse"></div>
            <div className="h-3.5 w-16 bg-slate-300 rounded-full animate-pulse"></div>
          </>
        ) : (
          <>
            <div className="text-sm font-bold text-white truncate">
              {user?.spotify?.song}
            </div>
            <div className="text-xs font-bold text-neutral-400 truncate">
              {user?.spotify?.artist}
            </div>
            <div className="text-xs font-bold text-neutral-500 truncate">
              {user?.spotify?.album}
            </div>
          </>
        )}
      </div>
    </SpotlightContainer>
  );

  return user?.listening_to_spotify && user.spotify?.track_id ? (
    <Link
      href={`https://open.spotify.com/track/${user.spotify.track_id}`}
      target="_blank"
      rel="noreferrer"
    >
      {inner}
    </Link>
  ) : (
    inner
  );
};

export default Spotify;

interface ImageWithExtractorProps extends SpotifyProps {
  src: string;
  alt: string;
}

const ImageWithExtractor: React.FC<ImageWithExtractorProps> = ({
  src,
  alt,
  setAlbumColors,
}) => {
  const { data, loading, error } = usePalette(src, 6, "rgbArray", {
    crossOrigin: "*",
    quality: 100,
  });

  useEffect(() => {
    setAlbumColors(data);
  }, [data]);

  return (
    <Image
      src={src}
      width={64}
      height={64}
      alt={alt || "Reece Martin"}
      className="rounded-xl flex-shrink-0 max-w-full"
    />
  );
};
