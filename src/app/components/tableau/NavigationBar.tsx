import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeftRightIcon,
  BarChart3Icon,
  Clock4Icon,
  LayoutDashboard,
  HelpCircleIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const variants = {
  expanded: { width: "220px" },
  nonexpanded: { width: "60px" },
};

const navLinks = [
  {
    link: "/dashboard",
    label: "Utilisateurs",
    icon: LayoutDashboard,
  },
  {
    link: "/annonces",
    label: "Activity",
    icon: Clock4Icon,
  },
  {
    link: "/analytics",
    label: "Analytics",
    icon: BarChart3Icon,
  },
  {
    link: "/transactions",
    label: "Transactions",
    icon: ArrowLeftRightIcon,
  },
  {
    link: "/support",
    label: "Support",
    icon: HelpCircleIcon,
  },
];

function Navbar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (windowWidth < 768) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth]);

  return (
    <motion.div
      animate={isExpanded ? "expanded" : "nonexpanded"}
      variants={variants}
      className={
        "py-10 h-screen flex flex-col border border-r-1 bg-[#FDFDFD] relative" +
        (isExpanded ? " px-10" : " px-2 duration-500")
      }
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer absolute -right-3 top-10 rounded-full w-6 h-6 bg-[#0a5c36] md:flex hidden justify-center items-center"
      >
        <Image src="/images/right-arrow.svg" alt="Right Arrow" width={8} height={8} />
      </div>

      <div className="logo-div flex space-x-4 items-center">
        <Image src="/images/logo3.png" alt="Logo" className="ml-2" width={150} height={150} />
        <span className={!isExpanded ? "hidden" : "block"}></span>
      </div>

      <div className="flex flex-col space-y-8 mt-12">
        {navLinks.map((item, index) => (
          <Link href={item.link} key={index}>
            <div
              onClick={() => setActiveIndex(index)}
              className={
                "flex space-x-3 w-full p-2 rounded " +
                (activeIndex === index
                  ? "bg-[#0a5c36] text-white"
                  : " text-black") +
                (!isExpanded ? " pl-3" : "")
              }
            >
              <item.icon className="md:w-6 w-4" />
              <span className={!isExpanded ? "hidden" : "block"}>
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default Navbar;
