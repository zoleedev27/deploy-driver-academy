import {useState, useEffect} from "react"
import Link from "next/link"
import Image from "next/image"
import {NAV_LINKS} from "@/constants/NavigationLinks"
import {Button} from "@/components/ui/button"
import {KeySquare, LogIn, LogOut, Menu, User} from "lucide-react"
import {IconMap} from "@/interfaces/Navs"
import {Avatar, AvatarImage} from "@/components/ui/avatar"
import {Drawer, DrawerContent, DrawerTitle, DrawerTrigger,} from "@/components/ui/drawer"
import {ModeToggle} from "@/components/theme/ThemeToggle";
import LanguageSelector from "../shared/LanguageSelector";
import { useTranslation } from "next-i18next"

export const Header = () => {
    const {t} = useTranslation("layout");
    const [isOpen, setIsOpen] = useState(false)
    const [isLogged, setIsLogged] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isOpen]);

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            <header
                className="sticky top-0 z-50 bg-background border-b border-black dark:border-white w-full transition-all duration-300 space-2">
                <div className="px-4 flex h-14 items-center justify-between sm:h-12 md:h-14 lg:h-16 xl:h-18 2xl:h-20">
                    <div className="flex items-center gap-1 sm:gap-2 md:gap-2 lg:gap-3 xl:gap-4 2xl:gap-5">
                        <Link href="/" className="flex items-center">
                            <Image src="/icon.svg" width={4} height={4} alt="Go Kart Cluj Logo"
                                   className="rounded border-2 border-black dark:bg-white dark:border-primary p-1 object-contain
                                   w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16
                                   transition-transform duration-300 hover:scale-105"/>
                        </Link>
                        <Link href="/"
                              className="font-body font-bold text-sm sm:text-md md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl">
                            {t("header.brand")}
                        </Link>
                    </div>

                    <nav
                        className="hidden md:flex items-center justify-center flex-1 md:space-x-3 lg:space-x-5 xl:space-x-8 2xl:space-x-10 mr-2">
                        {NAV_LINKS.map((item) => {
                            const IconComponent = IconMap[item.icon]
                            return (
                                <Link key={item.name} href={item.href}
                                      className="font-body text-sm font-medium transition-colors hover:text-green-400 dark:hover:text-green-400
                                      xl:text-md 2xl:text-lg flex md:flex-col lg:flex-row items-center text-center">
                                    {IconComponent && (
                                        <IconComponent size={20} className="md:mb-1 lg:mb-0 lg:mr-2 xl:mr-2 2xl:mr-3"/>
                                    )}
                                    <span>{t(`nav.${item.name}`)}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="hidden md:flex md:items-center md:gap-4">
                        {mounted && (
                            <div className="flex items-center gap-2">
                                <LanguageSelector/>
                                <ModeToggle/>
                            </div>
                        )}
                        <div className="hidden">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Menu className="h-5 w-5 xl:h-6 xl:w-6 2xl:h-7"/>
                            </Button>
                        </div>

                        {isLogged ? (
                                <div className="hidden md:flex md:items-center md:gap-2">
                                    <Link href="/logout">
                                        <Button variant="ghost" size="sm" className="text-sm">
                                            {t("header.auth.logout")}
                                        </Button>
                                    </Link>
                                    <Avatar
                                        className="h-8 w-8 xl:h-9 xl:w-9 2xl:h-9 2xl:w-9 cursor-pointer hover:scale-105">
                                        <AvatarImage src="/avatar.jpeg" alt="Profile"/>
                                    </Avatar>
                                </div>) :
                            (
                                <div className="hidden md:flex md:items-center md:gap-2">
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
                                <LanguageSelector/>
                                <ModeToggle/>
                            </div>
                            )}
                        <div>
                            <Drawer direction="bottom" open={isOpen} onOpenChange={setIsOpen}>
                                <DrawerTrigger asChild>
                                    <div
                                        className="rounded-l-md p-2 flex flex-col items-center justify-center cursor-pointer">
                                        <Menu className="h-6 w-6 text-black dark:text-white"/>
                                    </div>
                                </DrawerTrigger>
                                <DrawerContent className="h-auto max-h-[80%] p-2 flex flex-col">
                                    <div className="w-full flex-1 overflow-y-auto px-4 py-3">
                                        {isLogged &&
                                            (
                                                <div className="text-base flex flex-col items-center gap-1">
                                                    <Avatar className="h-14 w-14 mt-2">
                                                        <AvatarImage src="/avatar.jpeg" alt="Profile"/>
                                                    </Avatar>
                                                    <DrawerTitle>{t("header.auth.user.name")}</DrawerTitle>
                                                </div>
                                            )
                                        }
                                        {isLogged ?
                                            (
                                                <div className="grid grid-cols-2 gap-2 w-full mt-3">
                                                    <Link href="/profile"
                                                          className="text-base font-medium py-2 px-3 transition-colors hover:text-green-400 dark:hover:text-green-400 flex items-center justify-center border rounded-md"
                                                          onClick={toggleMenu}>
                                                        <User size={20} className="mr-2"/>
                                                        <span>{t("header.auth.profile")}</span>
                                                    </Link>

                                                    <Link href="/logout"
                                                          className="text-base font-medium py-2 px-3 transition-colors hover:text-green-400 dark:hover:text-green-400 flex items-center justify-center border rounded-md"
                                                          onClick={() => {
                                                              setIsLogged(false);
                                                              toggleMenu();
                                                          }}>
                                                        <LogOut size={20} className="mr-2"/>
                                                        <span>{t("header.auth.logout")}</span>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-2 w-full mt-3">
                                                    <Link href="/login"
                                                          className="text-base font-medium py-2 px-3 transition-colors hover:text-green-400 dark:hover:text-green-400 flex items-center justify-center border rounded-md"
                                                          onClick={toggleMenu}>
                                                        <LogIn size={20} className="mr-2"/>
                                                        <span>{t("header.auth.login")}</span>
                                                    </Link>

                                                    <Link href="/signup"
                                                          className="text-base font-medium py-2 px-3 transition-colors hover:text-green-400 dark:hover:text-green-400 flex items-center justify-center border rounded-md"
                                                          onClick={toggleMenu}>
                                                        <KeySquare size={20} className="mr-2"/>
                                                        <span>{t("header.auth.signup")}</span>
                                                    </Link>
                                                </div>
                                            )}
                                        <div>
                                            <div className="grid grid-cols-2 gap-3 w-full mb-3 mt-3">

                                                {NAV_LINKS.map((item) => {
                                                    const IconComponent = IconMap[item.icon]
                                                    return (
                                                        <Link key={item.name} href={item.href}
                                                              className="text-base font-medium py-2 px-3 transition-colors hover:text-green-400 dark:hover:text-green-400 flex items-center justify-center border rounded-md"
                                                              onClick={toggleMenu}>
                                                            {IconComponent &&
                                                                <IconComponent size={18} className="mr-2"/>}
                                                            <span>{t(`nav.${item.name}`)}</span>
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    </div>
                </div>
            </header>
            <div className="fixed bottom-4 right-4 z-50">
                <Button variant="outline" size="sm" onClick={() => setIsLogged(!isLogged)} className="text-xs">
                    {isLogged ? "Demo: Logout" : "Demo: Login"}
                </Button>
            </div>
        </>
    )
}
