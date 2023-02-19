import { SVGProps } from "react";
import FlareIcon from "../components/icons/Flare";
import { technologies } from "./technologies";

export interface Project {
  id:
    | "flare"
    | "escape"
    | "malice"
    | "bliss"
    | "upcoming"
    | "zephyr"
    | "graveyard";
  logoPath: string;
  coverImagePath: string;
  name: string;
  desc: string;
  url: string;
  status: "PRODUCTION" | "IN_PROGRESS" | "EOL" | "ARCHIVED";
  overview: string;
  responsibilities: string;
  completed: string;
  technologies: (keyof typeof technologies)[];
  media: {
    id: number;
    type: "image" | "video";
    src: string;
    title: string;
    desc: string;
  }[];
}

export const projects: Project[] = [
  {
    id: "flare",
    logoPath: "/flarelogo.png",
    coverImagePath: "/flare.png",
    name: "Flare AIO",
    desc: "Automation software",
    url: "https://flareaio.com",
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
        id: 0,
        type: "image",
        src: "/flare.png",
        title: "Desktop application overview",
        desc: "Preview of the Flare AIO desktop application",
      },
      {
        id: 1,
        type: "image",
        src: "/flare-site.png",
        title: "Website overview",
        desc: "Preview of the Flare AIO website",
      },
    ],
  },
  {
    id: "escape",
    logoPath: "/escapelogo.png",
    coverImagePath: "/escape.png",
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
    ],
    media: [
      {
        id: 0,
        type: "image",
        src: "/escape.png",
        title: "Coming soon",
        desc: "Small tease of the mobile application",
      },
    ],
  },
  {
    id: "malice",
    logoPath: "/malicelogo.gif",
    coverImagePath: "/malice.png",
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
      "mongodb",
    ],
    media: [
      {
        id: 0,
        type: "image",
        src: "/malice.png",
        title: "Malice App overview",
        desc: "Overview of the mobile application",
      },
    ],
  },
  {
    id: "upcoming",
    logoPath: "/upcoming-logo.png",
    coverImagePath: "/upcoming.png",
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
      "framer-motion",
      "storybook",
    ],
    media: [
      {
        id: 0,
        type: "image",
        src: "/upcoming.png",
        title: "Coming soon",
        desc: "Teaser for the upcoming project",
      },
    ],
  },
  {
    id: "bliss",
    logoPath: "/blisslogo.png",
    coverImagePath: "/bliss.png",
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
      "redis",
      "styled-components",
      "framer-motion",
      "reanimated",
    ],
    media: [
      {
        id: 0,
        type: "image",
        src: "/bliss-mobile.png",
        title: "Bliss mobile app",
        desc: "Overview of the mobile application",
      },
      {
        id: 1,
        type: "image",
        src: "/bliss-dash.png",
        title: "Bliss user dashboard",
        desc: "User dashboard to purchase bliss and manage their account",
      },
      {
        id: 2,
        type: "image",
        src: "/bliss-admin.png",
        title: "Bliss admin dashboard",
        desc: "Admin dashboard to manage all content provided to users",
      },
      {
        id: 3,
        type: "image",
        src: "/bliss-guides.png",
        title: "Bliss guides",
        desc: "Guides website for users to learn",
      },
      {
        id: 4,
        type: "image",
        src: "/bliss-site.png",
        title: "Bliss landing page",
        desc: "Initial version of landing page",
      },
    ],
  },
  {
    id: "zephyr",
    logoPath: "/zephyr-logo.png",
    coverImagePath: "/zephyr.png",
    name: "Zephyr",
    desc: "Service provider",
    url: "https://zephyrmonitorsllc.com/",
    status: "IN_PROGRESS",
    overview:
      "Zephyr is a service provider for the sneaker and resell industry. I have provided contracted frontend work for them for the last year for some of their tools. Unfortunately lots haven't reached production yet but I've displayed some of the work I've done for them.",
    completed: "2022 - Present",
    responsibilities:
      "Frontend development for various tools. One project was full stack.",
    technologies: [
      "react",
      "next",
      "typescript",
      "styled-components",
      "prisma",
      "postgres",
    ],
    media: [
      {
        id: 0,
        type: "image",
        src: "/upcoming.png",
        title: "Coming soon",
        desc: "Teaser for the upcoming project",
      },
    ],
  },
  {
    id: "graveyard",
    logoPath: "/graveyard-logo.png",
    coverImagePath: "/graveyard.png",
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
        id: 0,
        type: "image",
        src: "/graveyard.png",
        title: "Coming soon",
        desc: "Teaser for the upcoming project",
      },
    ],
  },
];
