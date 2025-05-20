import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { slugify } from "@/lib/utils";

export interface KartingCourseCardProps {
  title: string;
  description: string;
  teacherName: string;
  price: number;
  maxParticipants: number;
  difficulty: string;
  images: string[];
  labels: {
    cardTitle: string;
    registerButton: string;
  };
}

const KartingCourseCard: React.FC<KartingCourseCardProps> = ({
  title,
  description,
  teacherName,
  price,
  maxParticipants,
  difficulty,
  images,
  labels,
}) => {
  return (
    <Card className="w-full max-w-full sm:max-w-2/3 mx-auto overflow-hidden rounded-2xl shadow-md bg-white dark:bg-neutral-800 flex flex-col md:flex-row p-4 md:p-6">
      <div className="relative w-full h-48 2xl:h-82 md:h-auto md:w-1/2">
        <Image
          src={images?.length > 0 ? images[0] : "/images/course-mock.png"}
          alt={title}
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>

      <div className="flex flex-col justify-between p-4 md:w-1/2">
        <CardHeader className="p-0 space-y-1 ">
          <CardTitle className="text-xl text-gray-800 dark:text-green-400">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-white text-sm">
            {description}
          </CardDescription>
        </CardHeader>

        <div className="flex items-center gap-2 pt-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Difficulty:
          </span>
          <span className="text-sm text-gray-800 dark:text-gray-100">
            {difficulty}
          </span>
        </div>

        <CardFooter className="flex flex-col items-start p-0 mt-3 space-y-2">
          <p className="text-lg font-bold text-green-600">{price} Lei</p>
          <Link href={`/courses/${slugify(title)}`} className="w-40">
            <Button className="bg-green-600 text-white hover:bg-green-700 w-40 cursor-pointer">
              {labels.registerButton}
            </Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
};

export default KartingCourseCard;
