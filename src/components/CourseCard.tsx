import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";

import { useTranslation } from "react-i18next";

export interface KartingCourseCardProps {
  title: string;
  description: string;
  price: number;
  duration: string;
  imageUrl: string;
  labels: {
    cardTitle: string;
    duration: string;
    registerButton: string;
  };
}

const KartingCourseCard: React.FC<KartingCourseCardProps> = ({
  title,
  description,
  price,
  duration,
  imageUrl,
  labels,
}) => {
  const { t } = useTranslation("courses");

  return (
    <Card className="w-full max-w-full sm:max-w-2/3 mx-auto overflow-hidden rounded-2xl shadow-md bg-white dark:bg-neutral-800 flex flex-col md:flex-row p-4 md:p-6">
      <div className="relative w-full h-48 2xl:h-82 md:h-auto md:w-1/2">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>

      <div className="flex flex-col justify-between p-4 md:w-1/2">
        <CardHeader className="p-0 space-y-1 ">
          <p className="uppercase text-xs text-gray-500 dark:text-white font-medium">
            {labels.cardTitle}
          </p>
          <CardTitle className="text-xl text-gray-800 dark:text-green-400">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-white text-sm">
            {description}
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col items-start p-0 mt-3 space-y-2">
          <p className="text-sm text-gray-800 dark:text-white">
            <span className="font-semibold">{labels.duration}:</span> {duration}
          </p>
          <p className="text-lg font-bold text-green-600">
            ${price.toFixed(2)}
          </p>
          <Button className="bg-green-600 text-white hover:bg-green-700 w-40 cursor-pointer">
            {labels.registerButton}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default KartingCourseCard;
