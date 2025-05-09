import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Instagram,
} from "lucide-react";
import { IconMap } from "@/interfaces/Navs";
import { NAV_LINKS } from "@/constants/NavigationLinks";
import { useTranslation } from "next-i18next";

export const Footer = () => {
  const { t } = useTranslation("layout");

  return (
    <footer className="font-body text-white p-4">
      <div className="container mx-auto px-4 py-12 sm:py-14 md:py-16 lg:py-18 xl:py-20 2xl:py-24">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:grid-cols-4 xl:gap-12 2xl:gap-14">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mt-2">
              <Image
                src="/icon.svg"
                width={24}
                height={24}
                alt="Go Kart Cluj Logo"
                style={{ objectFit: "contain" }}
                className="rounded border-2 border-black dark:bg-white dark:border-primary p-1 object-contain
                                   w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20
                                   transition-transform duration-300 hover:scale-105"
              />
              <h3 className="text-md text-black dark:text-white font-bold xl:text-lg 2xl:text-lg">
                Go Kart Cluj
              </h3>
            </div>
            <p className="font-body text-black dark:text-white text-sm xl:text-md 2xl:text-lg">
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
              making it over 2000 years old.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-400 p-2 dark:text-gray-800 rounded-full hover:bg-primary transition-colors duration-300"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="https://www.instagram.com/gokartcluj"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-400 p-2 dark:text-gray-800 rounded-full hover:bg-primary transition-colors duration-300"
              >
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg text-black font-semibold dark:text-white">
              Our Page Links
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => {
                const IconComponent = IconMap[link.icon];
                return (
                  <li
                    key={link.name}
                    className="list-none text-black dark:text-white hover:text-green-400 dark:hover:text-green-400 transition-colors duration-200"
                  >
                    <Link href={link.href} className="flex items-center">
                      {IconComponent && (
                        <IconComponent size={16} className="mr-1" />
                      )}
                      {t(`nav.${link.name}`)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg text-black font-semibold dark:text-white">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start text-black dark:text-white hover:text-green-400 dark:hover:text-green-400">
                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0" />
                <Link
                  target="_blank"
                  href="https://www.google.com/maps/place/Go+Kart+Cluj/@46.8183974,23.4213158,786m/data=!3m2!1e3!4b1!4m6!3m5!1s0x474905073188ead7:0x2aecf95b71cf390c!8m2!3d46.8183938!4d23.4238907!16s%2Fg%2F11pcrt_czw?entry=ttu&g_ep=EgoyMDI1MDQwOS4wIKXMDSoASAFQAw%3D%3D"
                >
                  <span>407280, Nadaselu, Romania</span>
                </Link>
              </li>

              <li className="flex items-center text-black dark:text-white hover:text-green-400 dark:hover:text-green-400">
                <Phone size={20} className="mr-2 flex-shrink-0" />
                <Link target="_blank" href="tel:+40739 853 530">
                  <span>+40 739 853 530</span>
                </Link>
              </li>
              <li className="flex items-center text-black dark:text-white hover:text-green-400 dark:hover:text-green-400">
                <Mail
                  target="_blank"
                  size={20}
                  className="mr-2 flex-shrink-0"
                />
                <Link href="mailto:rezervari@clujkartingcircuit.ro">
                  <span>rezervari@clujkartingcircuit.ro</span>
                </Link>
              </li>
              <li className="flex items-start text-black dark:text-white hover:text-green-400 dark:hover:text-green-400 pt-2">
                <Clock size={20} className="mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Program:</p>
                  <p>11:00 - 20:00</p>
                  <p>10:00 - 20:00</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Newsletter
            </h3>
            <p className="text-sm text-black dark:text-white">
              Contrary to popular belief, Lorem Ipsum is not simply random text
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Email address"
                  className="rounded border-gray-700 text-black dark:text-white focus-visible:ring-white"
                />
                <Button className="rounded-l-none bg-green-400 hover:bg-primary">
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
            <div className="pt-4">
              <h4 className="font-medium mb-2 text-black dark:text-white">
                Make a reservation
              </h4>
              <Button className="w-full bg-green-400 hover:bg-primary">
                Reserve a session
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-black dark:text-white">
              © Go Kart Cluj {new Date().getFullYear()}
            </div>
            <div className="flex space-x-6 text-sm text-black dark:text-white">
              <Link
                href="/terms-and-conditions"
                className="hover:text-green-400 dark:hover:text-green-400"
              >
                Terms and Conditions
              </Link>
              <Link
                href="/policy"
                className="hover:text-green-400 dark:hover:text-green-400"
              >
                Privacy Policy
              </Link>
              <Link
                href="/cookies"
                className="hover:text-green-400 dark:hover:text-green-400"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
