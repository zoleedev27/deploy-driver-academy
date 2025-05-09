import { useTranslation } from "next-i18next";
import Image from "next/image";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import AnimatedTrack from "@/components/AnimatedTrack.tsx";
import Marquee from "react-fast-marquee";
import TrackStats from "@/components/TrackStats";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["landing-page", "layout"])),
    },
  };
}

export default function HomePage() {
  const { t } = useTranslation("landing-page");
  const sponsors = [
    "sponsor1.png",
    "sponsor2.png",
    "sponsor3.png",
    "sponsor4.png",
  ];
  const repeatedSponsors = [...sponsors, ...sponsors, ...sponsors];

  return (
    <main className="max-w-7xl mx-auto px-4 pt-0 pb-0 space-y-24 font-body">
      <TrackStats />

      <section className="flex flex-col md:flex-row items-center md:items-start gap-12">
        <div className="md:w-1/2 w-full">
          <AnimatedTrack />
        </div>
        <div className="md:w-1/2 w-full flex flex-col justify-center text-center md:text-left space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground futuristic-text">
            {t("track")}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis.
          </p>
        </div>
      </section>

      <section className="w-full py-6 bg-background border-t border-border">
        <Marquee
          speed={60}
          gradient={false}
          pauseOnHover={true}
          loop={0}
          className="w-full"
        >
          {repeatedSponsors.map((file, index) => (
            <div
              key={`${file}-${index}`}
              className="flex items-center justify-center h-[80px] min-w-[120px] px-6"
            >
              <Image
                src={`/sponsors/${file}`}
                alt={`Sponsor ${index + 1}`}
                width={120}
                height={80}
                className="object-contain h-full w-auto"
              />
            </div>
          ))}
        </Marquee>
      </section>

      <section className="flex flex-col md:flex-row gap-16 items-start">
        <div className="flex-1">
          <iframe
            title="Google Maps"
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2804.94068714879!2d23.42131577625703!3d46.818397442073795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474905073188ead7%3A0x2aecf95b71cf390c!2sGo%20Kart%20Cluj!5e1!3m2!1sro!2sro!4v1745394032664!5m2!1sro!2sro"
          />
        </div>
        <div className="flex-1 space-y-8 text-muted-foreground">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {t("location")}
            </h2>
            <p className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {t("address")}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {t("schedule")}
            </h2>
            <p className="flex items-start gap-2 whitespace-pre-line">
              <Clock className="w-5 h-5 mt-1 text-primary" />
              {"11:00 - 20:00\n10:00 - 20:00"}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {"Contact"}
            </h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+40739853530" className="hover:underline">
                  +40 739 853 530
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <a
                  href="mailto:rezervari@clujkartingcircuit.ro"
                  className="hover:underline"
                >
                  rezervari@clujkartingcircuit.ro
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
