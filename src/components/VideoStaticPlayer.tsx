import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import styles from "./VideoStaticPlayer.module.css";

interface VideoStaticPlayerProps {
  url: string;
  className?: string;
}

export default function VideoStaticPlayer({ url }: VideoStaticPlayerProps) {
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  // only render <video> on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={styles.loadingPlayer}>
        {t("signup.loading", "Loading...")}
      </div>
    );
  }

  return (
    <div className={styles.videoContainer}>
      <div className={styles.overlay}></div>
      <video
        className={styles.videoElement}
        src={url}
        preload="auto"
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
}
