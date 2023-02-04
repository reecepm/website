import React, { useState } from "react";
import { motion } from "framer-motion";
import useOutsideClick from "../hooks/outsideCick";
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandTwitter,
  IconCheck,
  IconCopy,
  IconMail,
  IconSend,
} from "@tabler/icons";
import { Button } from "./Button";
import { useRouter } from "next/navigation";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContactModal: React.FC<Props> = ({ setOpen }) => {
  const { ref } = useOutsideClick(() => setOpen(false));
  const router = useRouter();

  const [emailCheck, setEmailCheck] = useState(false);
  const [discordCheck, setDiscordCheck] = useState(false);

  return (
    <motion.div
      className="absolute inset-0 z-50 flex h-full w-full items-center justify-center bg-black/40 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.15,
      }}
    >
      <motion.div
        className="m-8 w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 px-10 py-8 shadow-lg sm:m-0 sm:px-12 sm:py-10"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        ref={ref}
      >
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-neutral-100 sm:text-2xl">
              Contact
            </h2>
            <p className="text-xs text-neutral-400 sm:text-sm">
              I’m always open to expanding my network and also hearing about
              work opportunities. Drop me an email or a DM and I’ll get back to
              you ASAP.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xs font-semibold text-neutral-100 sm:text-sm">
                  Email
                </h3>
                <p className="text-xs text-neutral-400 sm:text-sm">
                  hello@reece.so
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={() => router.push("mailto:hello@reece.so")}>
                  Send Email
                  <IconMail height={16} width={16} />
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText("hello@reece.so");
                    setEmailCheck(true);
                    setTimeout(() => {
                      setEmailCheck(false);
                    }, 1000); // this is lazy but it will do for now
                  }}
                >
                  Copy
                  {emailCheck ? (
                    <IconCheck
                      height={16}
                      width={16}
                      className="text-green-500"
                    />
                  ) : (
                    <IconCopy height={16} width={16} />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xs font-semibold text-neutral-100 sm:text-sm">
                  Discord
                </h3>
                <p className="text-xs text-neutral-400 sm:text-sm">
                  Reece#9999
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() =>
                    router.push("https://discord.com/users/480435502445756429")
                  }
                >
                  Add Discord
                  <IconBrandDiscord
                    height={16}
                    width={16}
                    className="text-indigo-400"
                  />
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText("Reece#9999");
                    setDiscordCheck(true);
                    setTimeout(() => {
                      setDiscordCheck(false);
                    }, 1000);
                  }}
                >
                  Copy
                  {discordCheck ? (
                    <IconCheck
                      height={16}
                      width={16}
                      className="text-green-500"
                    />
                  ) : (
                    <IconCopy height={16} width={16} />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="sm:text-smfont-semibold text-xs text-neutral-100">
                  Socials
                </h3>
                <p className="text-xs text-neutral-400 sm:text-sm">
                  Connect with me on different platforms
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => router.push("https://twitter.com/reece_pm")}
                >
                  Twitter
                  <IconBrandTwitter
                    height={16}
                    width={16}
                    className="text-sky-500"
                  />
                </Button>
                <Button
                  onClick={() => router.push("https://github.com/cascoid")}
                >
                  GitHub
                  <IconBrandGithub
                    height={16}
                    width={16}
                    className="text-purple-500"
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactModal;
