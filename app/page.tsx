import Spotify from "../components/home/Spotify";
const ColorThief = require("colorthief");
import tinycolor from "tinycolor2";
import { LanyardResponse, Spotify as SpotifyType } from "../types/lanyard";
import Link from "next/link";
import Tag from "../components/Tag";

type RGBColor = [number, number, number];

type SongData = {
  brightest?: string;
  spotifyData?: SpotifyType;
};

async function getSongData(): Promise<SongData> {
  const res = await fetch(
    "https://api.lanyard.rest/v1/users/480435502445756429",
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const typedRes: LanyardResponse = await res.json();

  if (!typedRes?.success || !typedRes.data.spotify) return {};

  const paletteData = await ColorThief.getPalette(
    typedRes.data.spotify.album_art_url
  );

  const mapped: tinycolor.Instance[] = paletteData.map((rgb: RGBColor) =>
    tinycolor(`rgb(${rgb.join(",")})`)
  );

  if (!mapped) return {};

  const isFirstBright = mapped[0].getLuminance() > 0.1;
  const color = isFirstBright
    ? mapped[0]
    : mapped.find((color) => color.getLuminance() > 0.1 !== isFirstBright);

  if (!color) return {};

  const rgb = color.toRgb();

  return {
    brightest: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
    spotifyData: typedRes.data.spotify,
  };
}

const Home = async () => {
  const { brightest, spotifyData } = await getSongData();

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center gap-3 overflow-x-clip">
      <div
        className="absolute z-0 h-[1000px] w-[1000px] opacity-30 animate-in fade-in zoom-in-0 duration-1000 ease-out"
        style={{
          background: `radial-gradient(50% 50% at 50% 50%, rgba(${
            (brightest && `${brightest},1`) || "255, 255, 255, 0.6"
          }) 0%, rgba(0, 0, 0, 0) 100%)`,
        }}
      />
      <Link
        href="https://www.google.com/maps/place/Bristol,+United+Kingdom"
        target="_blank"
        referrerPolicy="no-referrer"
        className="animate-in fade-in zoom-in-105 slide-in-from-bottom-8 duration-300"
      >
        <Tag background={brightest}>Bristol, United Kingdom</Tag>
      </Link>
      <div className="bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-center text-5xl font-bold text-transparent animate-in fade-in-0 zoom-in-105 slide-in-from-bottom-8 duration-500 sm:text-6xl">
        Reece Martin.
      </div>
      <div className="px-8 text-center text-sm font-medium text-neutral-400 animate-in fade-in zoom-in-105 slide-in-from-bottom-8 duration-700 sm:px-0 sm:text-base">
        Full stack developer devoted to creating fluid and easy to use software.
      </div>

      <Spotify {...{ brightest, data: spotifyData }} />
    </div>
  );
};

export default Home;

export const metadata = {
  description:
    "Personal website for Reece Martin, a full stack web, mobile and desktop developer from Bristol United Kingdom.",
};
