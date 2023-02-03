import React, { useEffect } from "react";
import { useLanyard, useLanyardWS, Spotify as SpotifyType } from "use-lanyard";
import SpotlightContainer from "./SpotlightContainer";
import Image from "next/image";
import Link from "next/link";
import { ArrayRGB } from "color-thief-react/lib/types";
import { usePalette } from "color-thief-react";
import tinycolor from "tinycolor2";

interface SpotifyWrapperProps {
  brightest: string | undefined;
  setBrightest: React.Dispatch<React.SetStateAction<string | undefined>>;
  data: SpotifyType;
}

export const Spotify: React.FC<SpotifyWrapperProps> = ({
  brightest,
  setBrightest,
  data,
}) => {
  const {
    data: paletteData,
    loading,
    error,
  } = usePalette(data.album_art_url!, 6, "rgbArray", {
    crossOrigin: "*",
    quality: 100,
  });

  useEffect(() => {
    if (!loading && !error && paletteData && paletteData.length > 0) {
      const mapped = paletteData.map((rgb) =>
        tinycolor(`rgb(${rgb.join(",")})`)
      );
      if (!mapped) return undefined;

      const isFirstBright = mapped[0].getLuminance() > 0.05;
      const color = isFirstBright
        ? mapped[0]
        : mapped.find((color) => color.getLuminance() > 0.05 !== isFirstBright);
      if (!color) return undefined;

      const rgb = color.toRgb();
      setBrightest(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
  }, [paletteData]);

  const inner = (
    <div className="group relative h-[115px] w-80 overflow-hidden rounded-2xl transition-all">
      <div className="absolute h-full w-full overflow-hidden rounded-2xl p-0.5">
        <div className="relative h-full w-full overflow-hidden rounded-[14px] p-0.5">
          <div
            className="absolute -top-[136px] -left-6 h-96 w-96 animate-spin-slow blur-lg saturate-200"
            style={{
              background: `conic-gradient(rgba(${
                (brightest && `${brightest},1`) || "255, 255, 255, 0.6"
              }), rgba(0, 0, 0, 0.1))`,
            }}
          ></div>
        </div>
      </div>
      <div
        className="absolute flex h-full w-full gap-3 rounded-2xl bg-neutral-900/90 p-6"
        style={{
          border: `2px solid rgba(${
            (brightest && `${brightest},1`) || "255, 255, 255, 0.6"
          })`,
        }}
      >
        {data.album_art_url ? (
          <Image
            src={data.album_art_url}
            width={64}
            height={64}
            alt={data.song || "Reece Martin"}
            className="max-w-full flex-shrink-0 rounded-xl"
          />
        ) : (
          <div className="h-16 w-16 rounded-xl bg-slate-300"></div>
        )}
        <div className="flex min-w-0 flex-grow flex-col gap-1 overflow-hidden">
          <>
            <div className="truncate text-sm font-bold text-white">
              {data.song}
            </div>
            <div className="truncate text-xs font-bold text-neutral-400">
              {data.artist}
            </div>
            <div className="truncate text-xs font-bold text-neutral-500">
              {data.album}
            </div>
          </>
        </div>
      </div>
    </div>
  );

  return data && data.track_id ? (
    <Link
      href={`https://open.spotify.com/track/${data.track_id}`}
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
