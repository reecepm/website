import { SVGProps } from "react";
import FlareIcon from "../components/icons/Flare";
import { technologies } from "./technologies";

export interface Project {
  id: string;
  logoPath: string;
  coverImagePath: string;
  name: string;
  desc: string;
  url: string;
  status: "PRODUCTION" | "IN_PROGRESS" | "EOL" | "ARCHIVED";
  overview: string;
  responsibilities: string;
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
    overview:
      "Flare AIO is a piece of automation software created to help users acquire limited goods like sneakers, collectibles and clothing. This project involved creating a desktop application which is effortless to use.",
    responsibilities:
      "I was solely responsible for the frontend and the synchronisation of data with the external Go backend.",
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
        src: "/flare.png#11",
        title: "Product overview423423423423",
        desc: "Preview of the Flare AIO desktop application",
      },
      {
        id: 1,
        type: "video",
        src: "https://reece.b-cdn.net/flare/1.mp4#12",
        title: "Task group creation423423",
        desc: "This is a preview of the task group creation process",
      },
      {
        id: 2,
        type: "video",
        src: "https://reece.b-cdn.net/flare/1.mp4#033",
        title: "Task group creationaaaaaaaaa",
        desc: "This is a preview of the task group creation processssss",
      },
      {
        id: 3,
        type: "image",
        src: "/flare.png#3333",
        title: "Product overviewaaa2222",
        desc: "Preview of the Flare AIO desktop applicationss",
      },
      {
        id: 4,
        type: "video",
        src: "https://reece.b-cdn.net/flare/1.mp4#1",
        title: "Task group creation2444",
        desc: "This is a preview of the task group creation process2",
      },
      {
        id: 5,
        type: "image",
        src: "/flare.png",
        title: "Product overview111111",
        desc: "Preview of the Flare AIO desktop application",
      },
      {
        id: 6,
        type: "video",
        src: "https://reece.b-cdn.net/flare/1.mp4",
        title: "Task group creation11111",
        desc: "This is a preview of the task group creation process",
      },
      {
        id: 7,
        type: "video",
        src: "https://reece.b-cdn.net/flare/1.mp4#0",
        title: "Task group creationaaaaa",
        desc: "This is a preview of the task group creation processssss",
      },
      {
        id: 8,
        type: "image",
        src: "/flare.png#",
        title: "Product overviewaaa",
        desc: "Preview of the Flare AIO desktop applicationss",
      },
      {
        id: 9,
        type: "video",
        src: "https://reece.b-cdn.net/flare/1.mp4#",
        title: "Task group creation2",
        desc: "This is a preview of the task group creation process2",
      },
    ],
  },
  {
    id: "flare2",
    logoPath: "/flarelogo.png",

    coverImagePath: "/flare.png",
    name: "Flare AIO2",
    desc: "Automation software",
    url: "https://flareaio.com",
    status: "PRODUCTION",
    overview:
      "Flare AIO is a piece of automation software created to help users acquire limited goods like sneakers, collectibles and clothing. This project involved creating a desktop application which is effortless to use.",
    responsibilities:
      "I was solely responsible for the frontend and the synchronisation of data with the external Go backend.",
    technologies: [
      "react",
      "next",
      "typescript",
      "webpack",
      "styled-components",
      "framer-motion",
    ],
    media: [],
  },
  {
    id: "flare3",
    logoPath: "/flarelogo.png",

    coverImagePath: "/flare.png",
    name: "Flare AIO",
    desc: "Automation software",
    url: "https://flareaio.com",
    status: "PRODUCTION",
    overview:
      "Flare AIO is a piece of automation software created to help users acquire limited goods like sneakers, collectibles and clothing. This project involved creating a desktop application which is effortless to use.",
    responsibilities:
      "I was solely responsible for the frontend and the synchronisation of data with the external Go backend.",
    technologies: [
      "react",
      "next",
      "typescript",
      "webpack",
      "styled-components",
      "framer-motion",
    ],
    media: [],
  },
  {
    id: "flare4",
    logoPath: "/flarelogo.png",

    coverImagePath: "/flare.png",
    name: "Flare AIO",
    desc: "Automation software",
    url: "https://flareaio.com",
    status: "PRODUCTION",
    overview:
      "Flare AIO is a piece of automation software created to help users acquire limited goods like sneakers, collectibles and clothing. This project involved creating a desktop application which is effortless to use.",
    responsibilities:
      "I was solely responsible for the frontend and the synchronisation of data with the external Go backend.",
    technologies: [
      "react",
      "next",
      "typescript",
      "webpack",
      "styled-components",
      "framer-motion",
    ],
    media: [],
  },
  {
    id: "flare5",
    logoPath: "/flarelogo.png",

    coverImagePath: "/flare.png",
    name: "Flare AIO",
    desc: "Automation software",
    url: "https://flareaio.com",
    status: "PRODUCTION",
    overview:
      "Flare AIO is a piece of automation software created to help users acquire limited goods like sneakers, collectibles and clothing. This project involved creating a desktop application which is effortless to use.",
    responsibilities:
      "I was solely responsible for the frontend and the synchronisation of data with the external Go backend.",
    technologies: [
      "react",
      "next",
      "typescript",
      "webpack",
      "styled-components",
      "framer-motion",
    ],
    media: [],
  },
  {
    id: "flare6",
    logoPath: "/flarelogo.png",

    coverImagePath: "/flare.png",
    name: "Flare AIO",
    desc: "Automation software",
    url: "https://flareaio.com",
    status: "PRODUCTION",
    overview:
      "Flare AIO is a piece of automation software created to help users acquire limited goods like sneakers, collectibles and clothing. This project involved creating a desktop application which is effortless to use.",
    responsibilities:
      "I was solely responsible for the frontend and the synchronisation of data with the external Go backend.",
    technologies: [
      "react",
      "next",
      "typescript",
      "webpack",
      "styled-components",
      "framer-motion",
    ],
    media: [],
  },
];
