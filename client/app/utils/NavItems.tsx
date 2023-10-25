import Link from "next/link";
import React from "react";

export const NavItemsData = [
  {
    name: "home",
    url: "/",
  },
  {
    name: "courses",
    url: "/courses",
  },
  {
    name: "policy",
    url: "/policy",
  },
  {
    name: "FAQ",
    url: "/faq",
  },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
  return (
    <>
      <div className="hidden 800px:flex">
        {/* currently hiddn after 800 px it is flex */}

        {NavItemsData &&
          NavItemsData.map((item, index) => (
            <Link href={`${item.url}`} key={index} passHref>
              <span
                className={`${
                  activeItem === index
                    ? "dark:text-[#37a39a] text-[#dc143cf4]"
                    : "dark:text-white text-black"
                } tex-[18px] px-6 font-Poppins font-[400]`}
              >
                {item.name}
              </span>
            </Link>
          ))}
      </div>
      {isMobile && (
        <div className="800px:hidden mt-5">

            <div className="w-full text-center py-6">
                <Link href={'/'} passHref>
                    <span
                    className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
                    ></span>
                </Link>
            </div>
          
            {NavItemsData &&
              NavItemsData.map((item, index) => (
                <Link href="/" key={index} passHref>
                  <span
                    className={`${
                      activeItem === index
                        ? "dark:text-[#37a39a] text-[crimson]"
                        : "dark:text-white text-black"
                    } block py-5 text-[18px] px-6 font-Poppins font-[400]`}
                  >{item.name}</span>
                </Link>
              ))}
          </div>
        
      )}
    </>
  );
};

export default NavItems;
