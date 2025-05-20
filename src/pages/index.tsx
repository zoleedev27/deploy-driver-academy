import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import AnimatedTrack from "@/components/AnimatedTrack";
import Marquee from "react-fast-marquee";
import TrackStats from "@/components/TrackStats";
import VideoStaticPlayer from "@/components/VideoStaticPlayer";
import DynamicVideoPlayer from "@/components/DynamicVideoPlayer";
import Calendar from "@/components/Calendar";

const youtubeUrl =
  "https://www.youtube.com/watch?v=60BHloXKPME&pp=ygUHZ28ta2FydA%3D%3D";

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
    <main className="w-full mx-auto px-4 pt-0 pb-0 space-y-24 font-body">
      <section className="relative w-full min-h-screen md:h-[90vh]">
        <VideoStaticPlayer
          className="absolute inset-0 w-full h-full object-cover"
          url={"videoPlayer/5638369-sd_640_360_25fps.mp4"}
        />

        <div className="relative z-10 w-full h-full flex flex-col min-h-screen justify-between bg-black/30 p-5 md:p-8">
          <div className="w-full flex justify-center items-center pt-8 md:pt-12">
            <div className="w-full md:w-[90%] px-2 md:px-0">
              <TrackStats className="transform scale-100 md:scale-125 text-white w-full" />
            </div>
          </div>

          <div className="mb-6 md:mb-10" />

          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-y-6 md:gap-y-0 md:gap-x-8">
            <div className="w-full md:w-1/2 flex justify-center overflow-hidden">
              <AnimatedTrack className="bg-transparent drop-shadow-lg w-full h-auto -translate-x-2.5 md:-translate-x-10 -mb-40 md:-mb-12 transition-transform duration-300" />
            </div>

            <div className="w-full md:w-1/2 text-white text-center md:text-left px-4 md:px-8">
              <h2 className="text-2xl md:text-5xl font-bold futuristic-text mb-2 md:mb-4">
                {t("track")}
              </h2>
              <p className="text-sm md:text-lg leading-tight md:leading-relaxed md:mb-125">
                {t("description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-screen left-1/2 right-1/2 transform -translate-x-1/2 justify-center overflow-hidden px-4 md:px-0">
        <DynamicVideoPlayer
          url={youtubeUrl}
          style={{
            width: "1000px",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        />
      </section>

      <section className="w-full py-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          {t("calendar.title", "Event Calendar")}
        </h2>
        <Calendar />
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

      <section className="flex flex-col md:flex-row gap-16 items-start px-4 md:px-16">
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const translations = await serverSideTranslations(locale ?? "en", [
    "common",
    "layout",
    "calendar",
    "landing-page",
  ]);

  return {
    props: {
      ...translations,
    },
  };
};
