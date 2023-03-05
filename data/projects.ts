import { technologies } from "./technologies";
import flareCoverImage from "../public/flare.png";
import escapeCoverImage from "../public/escape.png";
import maliceCoverImage from "../public/malice.png";
import blissCoverImage from "../public/bliss.png";
import upcomingCoverImage from "../public/upcoming.png";
import zephyrCoverImage from "../public/zephyr.png";
import graveyardCoverImage from "../public/graveyard.png";
import flareLogo from "../public/flarelogo.png";
import escapeLogo from "../public/escapelogo.png";
import maliceLogo from "../public/malicelogo.gif";
import blissLogo from "../public/blisslogo.png";
import upcomingLogo from "../public/upcoming-logo.png";
import zephyrLogo from "../public/zephyr-logo.png";
import graveyardLogo from "../public/graveyard-logo.png";
import { StaticImageData } from "next/image";

export interface Project {
  id:
    | "flare"
    | "escape"
    | "malice"
    | "bliss"
    | "upcoming"
    | "zephyr"
    | "graveyard";
  logoPath: StaticImageData;
  coverImagePath: StaticImageData;
  name: string;
  desc: string;
  url: string;
  status: "PRODUCTION" | "IN_PROGRESS" | "EOL" | "ARCHIVED";
  overview: string;
  responsibilities: string;
  completed: string;
  technologies: (keyof typeof technologies)[];
  media: {
    type: "image" | "video";
    src: StaticImageData | string;
    title: string;
    desc: string;
  }[];
}

export const projects: Project[] = [
  {
    id: "flare",
    logoPath: flareLogo,
    coverImagePath: flareCoverImage,
    name: "Flare AIO",
    desc: "Automation software",
    url: "https://flarebots.com",
    status: "PRODUCTION",
    completed: "July 2022 - February 2023",
    overview:
      "Flare AIO is a piece of automation software created to help users acquire limited goods like sneakers, collectibles and clothing. This project involved creating a desktop application which is effortless to use. It also involved creating a landing page for the product.",
    responsibilities:
      "I was solely responsible for the desktop application's frontend code and the synchronisation of data with the external Go backend. I also took over the development of the landing page.",
    technologies: [
      "react",
      "next",
      "typescript",
      "webpack",
      "styled-components",
      "electron",
      "framer-motion",
    ],
    media: [
      {
        type: "image",
        src: flareCoverImage,
        title: "Desktop application overview",
        desc: "Preview of the Flare AIO desktop application",
      },
      {
        type: "image",
        src: "/flare-site.png",
        title: "Website overview",
        desc: "Preview of the Flare AIO website",
      },
      {
        type: "video",
        src: "https://reece.b-cdn.net/task%20creation.mp4",
        title: "Task creation",
        desc: "Task creation process for the desktop application",
      },
      {
        type: "video",
        src: "https://reece.b-cdn.net/profiles.mp4",
        title: "Profiles",
        desc: "Profiles snippet for the desktop application",
      },
      {
        type: "video",
        src: "https://reece.b-cdn.net/task%20group%20actions.mp4",
        title: "Task group actions",
        desc: "Actions the user can use on a task group",
      },
      {
        type: "video",
        src: "https://reece.b-cdn.net/settings.mp4",
        title: "Settings",
        desc: "Options for user to manage their settings",
      },
    ],
  },
  {
    id: "escape",
    logoPath: escapeLogo,
    coverImagePath: escapeCoverImage,
    name: "Escape Notify",
    desc: "Information provider",
    url: "https://escapenotify.com",
    status: "IN_PROGRESS",
    completed: "In Development",
    overview:
      "Escape notify is an information provider created to help users acquire limited goods like sneakers, collectibles and clothing. This project involved creating a mobile application to provide their users with information directly.",
    responsibilities:
      "I was solely responsible for the mobile application development, alongisde an API.",
    technologies: [
      "reactNative",
      "typescript",
      "styled-components",
      "reanimated",
      "golang",
      "graphql",
      "postgres",
      "react-query",
    ],
    media: [
      {
        type: "image",
        src: escapeCoverImage,
        title: "Coming soon",
        desc: "Small tease of the mobile application",
      },
    ],
  },
  {
    id: "malice",
    logoPath: maliceLogo,
    coverImagePath: maliceCoverImage,
    name: "Malice",
    desc: "Information provider",
    url: "https://wearemalice.com",
    status: "PRODUCTION",
    completed: "October 2021 - March 2022",
    overview:
      "Malice describes themselves as 'the ultimate personal development collective, designed to empower individuals to reach their full potential'. This project involved creating a mobile application to provide their users with guides and information to help them succeed.",
    responsibilities:
      "I was solely responsible for the mobile application development, alongisde an API and also an admin dashboard to manage the content within the application.",
    technologies: [
      "reactNative",
      "react",
      "next",
      "typescript",
      "styled-components",
      "reanimated",
      "node",
      "graphql",
      "react-query",
      "mongodb",
    ],
    media: [
      {
        type: "image",
        src: maliceCoverImage,
        title: "Malice App overview",
        desc: "Overview of the mobile application",
      },
      {
        type: "video",
        src: "https://reece.b-cdn.net/malice%20login.mp4",
        title: "Login",
        desc: "Login screen for the mobile application",
      },
      {
        type: "video",
        src: "https://reece.b-cdn.net/malice%20reminders.mp4",
        title: "Calendar & Reminders",
        desc: "Upcoming calendar events and reminders",
      },
      {
        type: "video",
        src: "https://reece.b-cdn.net/malice%20guides.mp4",
        title: "Guides",
        desc: "Guides for the user to read",
      },
      {
        type: "video",
        src: "https://reece.b-cdn.net/malice%20profile.mp4",
        title: "Profile & Leaderboards",
        desc: "User profile, points marketplace and leaderboards",
      },
      {
        type: "image",
        src: "/malice-admin.png",
        title: "Admin dashboard",
        desc: "Also created admin dashboard for project. Blurred for privacy.",
      },
    ],
  },
  {
    id: "upcoming",
    logoPath: upcomingLogo,
    coverImagePath: upcomingCoverImage,
    name: "????",
    desc: "Coming soon",
    url: "https://twitter.com/reece_pm",
    status: "IN_PROGRESS",
    overview: "Working on a new project, more details to come soon.",
    completed: "September 2022 - Present",
    responsibilities: "Full stack.",
    technologies: [
      "react",
      "next",
      "typescript",
      "trpc",
      "prisma",
      "postgres",
      "redis",
      "tailwindcss",
      "react-query",
      "react-hook-form",
      "framer-motion",
      "storybook",
    ],
    media: [
      {
        type: "image",
        src: upcomingCoverImage,
        title: "Coming soon",
        desc: "Teaser for the upcoming project",
      },
    ],
  },
  {
    id: "bliss",
    logoPath: blissLogo,
    coverImagePath: blissCoverImage,
    name: "Bliss Notify",
    desc: "Information provider",
    url: "https://tiktok.com/@blissnotify",
    status: "ARCHIVED",
    overview:
      "Bliss was a resell information provider which had a huge focus on ease of use and accessibility. The goal was to create bespoke apps to make the overall experience easier and more accessible to a casual person. Unfortunately the project was cancelled and never released.",
    completed: "September 2021 - April 2022",
    responsibilities:
      "I was the sole developer of the mobile application, all api's, user dashboard, purchasing system, admin dashboard, guide website and the landing page. Also some small discord bots.",
    technologies: [
      "reactNative",
      "react",
      "next",
      "typescript",
      "golang",
      "graphql",
      "postgres",
      "react-query",
      "redis",
      "styled-components",
      "framer-motion",
      "reanimated",
    ],
    media: [
      {
        type: "image",
        src: blissCoverImage,
        title: "Bliss preview",
        desc: "Preview of the mobile application and dashboard",
      },
      {
        type: "image",
        src: "/bliss-mobile.png",
        title: "Bliss mobile app",
        desc: "Overview of the mobile application",
      },
      {
        type: "image",
        src: "/bliss-dash.png",
        title: "Bliss user dashboard",
        desc: "User dashboard to purchase bliss and manage their account",
      },
      {
        type: "image",
        src: "/bliss-admin.png",
        title: "Bliss admin dashboard",
        desc: "Admin dashboard to manage all content provided to users",
      },
      {
        type: "image",
        src: "/bliss-guides.png",
        title: "Bliss guides",
        desc: "Guides website for users to learn",
      },
      {
        type: "image",
        src: "/bliss-site.png",
        title: "Bliss landing page",
        desc: "Initial version of landing page",
      },
    ],
  },
  {
    id: "zephyr",
    logoPath: zephyrLogo,
    coverImagePath: zephyrCoverImage,
    name: "Zephyr",
    desc: "Service provider",
    url: "https://zephyrmonitorsllc.com/",
    status: "IN_PROGRESS",
    overview:
      "Zephyr is a service provider for the sneaker and resell industry. I have provided contracted frontend work for them for the last year for some of their tools. Unfortunately lots haven't reached production yet but I've displayed some of the work I've done for them.",
    completed: "December 2022 - Present",
    responsibilities:
      "Frontend development for various tools. One project was full stack.",
    technologies: [
      "react",
      "next",
      "typescript",
      "react-query",
      "styled-components",
      "prisma",
      "postgres",
      "trpc",
      "framer-motion",
    ],
    media: [
      {
        type: "image",
        src: zephyrCoverImage,
        title: "Landing page",
        desc: "Landing page for Zephyr Monitors. Other pages transferred from previous site.",
      },
      {
        type: "image",
        src: "/zephyr-dashboards.png",
        title: "Client Dashboard, Admin Dashboard & Links Dashboard",
        desc: "Different dashboard projects for Zephyr. All are waiting to be released to clients.",
      },
    ],
  },
  {
    id: "graveyard",
    logoPath: graveyardLogo,
    coverImagePath: graveyardCoverImage,
    name: "Graveyard",
    desc: "Retired or unpublished projects",
    url: "https://twitter.com/reece_pm",
    status: "EOL",
    overview:
      "This is a collection of various projects that I have worked on in the past, but for different reasons aren't around today. Some reached end of life and others didn't make it to production. Although they do not stack up to my current standards, I still wanted to showcase them. Some (such as Peachy Pings) provided me with a lot of early experience which I am grateful for. It also shows how far I have come since then.",
    completed: "2020-2021",
    responsibilities: "Full stack on most of these projects.",
    technologies: [
      "react",
      "electron",
      "webpack",
      "typescript",
      "mongodb",
      "styled-components",
      "flutter",
      "dart",
      "swift",
      "swiftui",
    ],
    media: [
      {
        type: "image",
        src: graveyardCoverImage,
        title: "Graveyard Overview",
        desc: "Overview of the graveyard",
      },
      {
        type: "image",
        src: "/graveyard-peachydesktop.png",
        title: "Peachy Desktop",
        desc: "Electron/react desktop application for Peachy Pings with API. Project handed over to another developer.",
      },
      {
        type: "image",
        src: "/graveyard-peachymobile.png",
        title: "Peachy Mobile",
        desc: "Flutter mobile application for Peachy Pings with admin site and API. EOL due to lack of updates.",
      },
      {
        type: "image",
        src: "/graveyard-layout.png",
        title: "Layout Mobile",
        desc: "SwiftUI mobile application for Layout with API. Company closed down.",
      },
      {
        type: "image",
        src: "/graveyard-slap.png",
        title: "Slap Mobile",
        desc: "Flutter mobile application. UI developed but company abandoned mobile project.",
      },
    ],
  },
];
