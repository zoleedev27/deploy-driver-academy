import { fetchData} from "@/hooks/useData";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import AnimatedTrack from "@/components/AnimatedTrack";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

export default function Home() {


  return (
      <div className="min-h-screen bg-black">
        <AnimatedTrack />
      </div>


  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const translations = await serverSideTranslations(locale ?? "en", ["common","layout"]);


  return {
    props: {
      ...translations,
    },
  };
};

