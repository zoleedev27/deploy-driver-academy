import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";

/** Shown while the real player is loading */
const LoadingComponent = () => {
  const { t } = useTranslation("common");
  return (
    <div className="text-center py-8">
      {t("signup.loading", "Loading video player...")}
    </div>
  );
};

// Dynamically import the actual player (no SSR)
const VideoPlayerComponent = dynamic(() => import("./VideoPlayer.tsx"), {
  ssr: false,
  loading: LoadingComponent,
});

export interface DynamicVideoPlayerProps {
  url: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A simple wrapper that displays a heading + video player,
 * and lets you size/center via className/style props.
 */
const DynamicVideoPlayer: React.FC<DynamicVideoPlayerProps> = ({
  url,
  className = "",
  style,
}) => {
  const { t } = useTranslation("common");

  return (
    <div
      className={`flex flex-col items-center py-4 ${className}`}
      style={style}
    >
      <h2 className="text-3xl font-bold mb-2">
        {t("signup.featuredVideo", "Featured Video")}
      </h2>
      <div className="w-full">
        <VideoPlayerComponent url={url} />
      </div>
    </div>
  );
};

export default DynamicVideoPlayer;
