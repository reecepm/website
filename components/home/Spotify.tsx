import React from "react";
import { Spotify as SpotifyType } from "../../types/lanyard";
import Image from "next/image";
import Link from "next/link";

interface SpotifyWrapperProps {
  data?: SpotifyType;
  brightest?: string;
}

export const Spotify: React.FC<SpotifyWrapperProps> = ({ data, brightest }) => {
  if (!data) return null;

  const inner = (
    <div className="group relative mt-4 h-[115px] w-80 overflow-hidden rounded-2xl transition-all animate-in fade-in zoom-in-105 slide-in-from-bottom-8 duration-1000">
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
