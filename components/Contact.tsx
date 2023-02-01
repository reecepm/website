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
import { useRouter } from "next/router";

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
      className="absolute inset-0 z-50 flex h-full w-full items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.15,
      }}
    >
      <motion.div
        className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 px-12 py-10 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        ref={ref}
      >
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-neutral-100">Contact</h2>
            <p className="text-sm text-neutral-400">
              I’m always open to expanding my network and also hearing about
              work opportunities. Drop me an email or a DM and I’ll get back to
              you ASAP.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-100">
                  Email
                </h3>
                <p className="text-sm text-neutral-400">hello@reece.so</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push("mailto:hello@reece.so", "_blank")}
                >
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-100">
                  Discord
                </h3>
                <p className="text-sm text-neutral-400">Reece#9999</p>
              </div>
              <div className="flex gap-3">
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-100">
                  Socials
                </h3>
                <p className="text-sm text-neutral-400">
                  Connect with me on different platforms
                </p>
              </div>
              <div className="flex gap-3">
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
