import Link from "next/link";
import Image from "next/image";
import { Facebook, MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";
import { NAV_LINKS } from "@/constants/NavigationLinks";
import { useTranslation } from "next-i18next";
import { IconMap } from "@/interfaces/Navs";

export const Footer = () => {
  const { t } = useTranslation("layout");

  return (
    <footer className="font-body text-white p-4 bg-background">
      <div className="container mx-auto px-4 py-12 sm:py-14 md:py-16 lg:py-18 xl:py-20 2xl:py-24">
        <div className="flex flex-wrap justify-between gap-x-10 gap-y-12 text-left">
          <div className="space-y-4 min-w-[260px] max-w-sm">
            <div className="flex items-center gap-3 mt-2">
              <Image
                src="/icon.svg"
                width={24}
                height={24}
                alt={t("footer.brand")}
                className="rounded border-2 border-black dark:bg-white dark:border-primary p-1 object-contain
                  w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20
                  transition-transform duration-300 hover:scale-105"
              />
              <h3 className="text-md text-black dark:text-white font-bold xl:text-lg 2xl:text-lg">
                {t("footer.brand")}
              </h3>
            </div>
            <p className="text-black dark:text-white text-sm xl:text-md 2xl:text-lg">
              {t("footer.description")}
            </p>
            <div className="flex space-x-4 pt-2">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#ED1C24] p-2 rounded-full hover:bg-[#B9181E] transition-colors duration-300"
              >
                <Facebook
                  size={20}
                  aria-label={t("footer.social.media.facebook")}
                />
              </Link>
              <Link
                href="https://www.instagram.com/gokartcluj"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#ED1C24] p-2 rounded-full hover:bg-[#B9181E] transition-colors duration-300"
              >
                <Instagram
                  size={20}
                  aria-label={t("footer.social.media.instagram")}
                />
              </Link>
            </div>
          </div>

          <div className="space-y-4 min-w-[200px]">
            <h3 className="text-lg text-black font-semibold dark:text-white">
              {t("nav.links.title")}
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => {
                const IconComponent = IconMap[link.icon];
                return (
                  <li
                    key={link.name}
                    className="list-none text-black dark:text-white hover:text-[#ED1C24] dark:hover:text-[#ED1C24] transition-colors duration-200"
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

          <div className="space-y-4 min-w-[240px]">
            <h3 className="text-lg text-black font-semibold dark:text-white">
              {t("footer.contact.title")}
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start text-black dark:text-white hover:text-[#ED1C24] dark:hover:text-[#ED1C24]">
                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0" />
                <Link
                  target="_blank"
                  href="https://www.google.com/maps/place/Go+Kart+Cluj/"
                >
                  <span>{t("footer.contact.address")}</span>
                </Link>
              </li>

              <li className="flex items-center text-black dark:text-white hover:text-[#ED1C24] dark:hover:text-[#ED1C24]">
                <Phone size={20} className="mr-2 flex-shrink-0" />
                <Link target="_blank" href="tel:+40739853530">
                  <span>{t("footer.contact.phone")}</span>
                </Link>
              </li>
              <li className="flex items-center text-black dark:text-white hover:text-[#ED1C24] dark:hover:text-[#ED1C24]">
                <Mail size={20} className="mr-2 flex-shrink-0" />
                <Link href="mailto:rezervari@clujkartingcircuit.ro">
                  <span>{t("footer.contact.email")}</span>
                </Link>
              </li>
              <li className="flex items-start text-black dark:text-white hover:text-[#ED1C24] dark:hover:text-[#ED1C24] pt-2">
                <Clock size={20} className="mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t("footer.contact.program")}</p>
                  <p>{t("footer.contact.hours.0")}</p>
                  <p>{t("footer.contact.hours.1")}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-black dark:text-white">
              {t("footer.footer.bottom.copyright")} {new Date().getFullYear()}
            </div>
            <div className="flex space-x-6 text-sm text-black dark:text-white">
              <Link
                href="/terms-and-conditions"
                className="hover:text-[#ED1C24] dark:hover:text-[#ED1C24]"
              >
                {t("footer.footer.bottom.terms")}
              </Link>
              <Link
                href="/policy"
                className="hover:text-[#ED1C24] dark:hover:text-[#ED1C24]"
              >
                {t("footer.footer.bottom.privacy")}
              </Link>
              <Link
                href="/cookies"
                className="hover:text-[#ED1C24] dark:hover:text-[#ED1C24]"
              >
                {t("footer.footer.bottom.cookies")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
