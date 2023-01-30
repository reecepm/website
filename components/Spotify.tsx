import React from "react";
import { useLanyard } from "use-lanyard";
import SpotlightContainer from "./SpotlightContainer";
import Image from "next/image";
import Link from "next/link";

const DISCORD_ID = "480435502445756429";

const Spotify = () => {
  const { data: user, isLoading } = useLanyard(DISCORD_ID);

  // const isLoading = true;

  const inner = (
    <SpotlightContainer padding="md" fixedWidth="sm">
      {isLoading ? (
        <div className="h-16 w-16 bg-slate-300 rounded-xl animate-pulse"></div>
      ) : user?.spotify?.album_art_url ? (
        <Image
          src={user.spotify.album_art_url}
          width={64}
          height={64}
          alt={user?.spotify?.song || "Reece Martin"}
          className="rounded-xl"
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
