import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

interface CounterProps {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
  delay?: number;
  onComplete?: () => void;
}

const Counter = ({
  from,
  to,
  duration = 1500,
  suffix = "",
  delay = 0,
  onComplete,
}: CounterProps) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = Date.now();
      const step = () => {
        const progress = Math.min((Date.now() - start) / duration, 1);
        const current = Math.floor(from + (to - from) * progress);
        setCount(current);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else if (onComplete) {
          onComplete();
        }
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [from, to, duration, delay, onComplete]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

interface TrackStatsProps {
  className?: string;
}

export default function TrackStats({ className = "" }: TrackStatsProps) {
  const [showBest, setShowBest] = useState(false);
  const { t } = useTranslation("landing-page");

  return (
    <div
      className={`w-full flex flex-col md:flex-row justify-center items-center gap-8 md:gap-24 ${className}`}
    >
      <div className="text-center min-w-[180px] space-y-2">
        <p className="uppercase font-bold text-sm md:text-base tracking-wide text-white">
          {t("track length")}
        </p>
        <p className="text-4xl md:text-5xl font-extrabold text-red-600">
          <Counter from={0} to={500} suffix="M" />
        </p>
      </div>
      <div className="text-center min-w-[180px] space-y-2">
        <p className="uppercase font-bold text-sm md:text-base tracking-wide text-white">
          {t("karts")}
        </p>
        <p className="text-4xl md:text-5xl font-extrabold text-red-600 font-mono tabular-nums">
          <Counter from={0} to={36} />
        </p>
      </div>
      <div className="text-center min-w-[180px] space-y-2">
        <p
          className={`uppercase font-bold text-sm md:text-base tracking-wide ${
            showBest ? "text-red-600" : "text-white"
          }`}
        >
          {showBest ? t("best record") : t("average record")}
        </p>
        <p
          className={`text-4xl md:text-5xl font-extrabold ${
            showBest ? "text-white" : "text-red-600"
          } font-mono tabular-nums`}
        >
          {showBest ? (
            <Counter from={43} to={37} suffix="s" />
          ) : (
            <Counter
              from={0}
              to={43}
              suffix="s"
              delay={500}
              onComplete={() => {
                setTimeout(() => setShowBest(true), 3000);
              }}
            />
          )}
        </p>
      </div>
    </div>
  );
}
