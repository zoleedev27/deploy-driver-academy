"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/constants/NavigationLinks";
import { Button } from "@/components/ui/button";
import { KeySquare, LogIn, LogOut, Menu, User } from "lucide-react";
import { IconMap } from "@/interfaces/Navs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ModeToggle } from "@/components/theme/ThemeToggle";
import LanguageSelector from "../shared/LanguageSelector";
import { useTranslation } from "next-i18next";
import { useAuth } from "@/hooks/useAuth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export const Header = () => {
  const { t } = useTranslation("layout");
  const [isOpen, setIsOpen] = useState(false);
  const { isLogged, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  const getLetter = () => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("currentEmail");
      return email ? email.charAt(0).toUpperCase() : "U";
    }
    return "U";
  };

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-black dark:border-white w-full transition-all duration-300">
      <div className="px-4 flex h-14 items-center justify-between sm:h-12 md:h-14 lg:h-16 xl:h-18 2xl:h-20">
        <div className="flex items-center gap-2 sm:gap-2 md:gap-3 lg:gap-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/icon.svg"
              width={32}
              height={32}
              alt="Go Kart Cluj Logo"
              className="rounded border-2 border-black dark:bg-white dark:border-primary p-1 object-contain w-8 h-8 md:w-10 md:h-10 xl:w-12 xl:h-12 transition-transform duration-300 hover:scale-105"
            />
          </Link>
          <Link
            href="/"
            className="font-body font-bold text-sm sm:text-md md:text-lg xl:text-xl"
          >
            {t("header.brand")}
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center flex-1 space-x-6 mr-2">
          {NAV_LINKS.map((item) => {
            const IconComponent = IconMap[item.icon];
            return (
              <Link
                key={item.name}
                href={item.href}
                className="font-body text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary flex items-center"
              >
                {IconComponent && <IconComponent size={20} className="mr-2" />}
                <span>{t(`nav.${item.name}`)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {mounted && (
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ModeToggle />
            </div>
          )}
          {isLogged ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm"
                onClick={logout}
              >
                {t("header.auth.logout")}
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-8 w-8 cursor-pointer hover:scale-105">
                      <AvatarFallback>{getLetter()}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{localStorage.getItem("currentEmail")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-sm">
                  {t("header.auth.login")}
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="default" size="sm" className="text-sm">
                  {t("header.auth.signup")}
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="md:hidden z-40 flex gap-2">
          {mounted && (
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ModeToggle />
            </div>
          )}
          <Drawer direction="bottom" open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <div className="p-2 cursor-pointer">
                <Menu className="h-6 w-6 text-black dark:text-white" />
              </div>
            </DrawerTrigger>
            <DrawerContent className="h-auto max-h-[80%] p-2 flex flex-col">
              <div className="w-full flex-1 overflow-y-auto px-4 py-3">
                {isLogged && (
                  <div className="text-base flex flex-col items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="h-14 w-14 mt-2">
                            <AvatarFallback>{getLetter()}</AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>{localStorage.getItem("currentEmail")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 w-full mt-3">
                  {isLogged ? (
                    <>
                      <Link
                        href="/profile"
                        className="py-2 px-3 flex items-center justify-center border rounded-md hover:text-primary"
                        onClick={toggleMenu}
                      >
                        <User size={20} className="mr-2" />
                        <span>{t("header.auth.profile")}</span>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => {
                          logout();
                          toggleMenu();
                        }}
                        className="py-2 px-3 flex items-center justify-center"
                      >
                        <LogOut size={20} className="mr-2" />
                        <span>{t("header.auth.logout")}</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="py-2 px-3 flex items-center justify-center border rounded-md hover:text-primary"
                        onClick={toggleMenu}
                      >
                        <LogIn size={20} className="mr-2" />
                        <span>{t("header.auth.login")}</span>
                      </Link>
                      <Link
                        href="/signup"
                        className="py-2 px-3 flex items-center justify-center border rounded-md hover:text-primary"
                        onClick={toggleMenu}
                      >
                        <KeySquare size={20} className="mr-2" />
                        <span>{t("header.auth.signup")}</span>
                      </Link>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 w-full my-4">
                  {NAV_LINKS.map((item) => {
                    const IconComponent = IconMap[item.icon];
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="py-2 px-3 flex items-center justify-center border rounded-md hover:text-primary"
                        onClick={toggleMenu}
                      >
                        {IconComponent && (
                          <IconComponent size={18} className="mr-2" />
                        )}
                        <span>{t(`nav.${item.name}`)}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
};
