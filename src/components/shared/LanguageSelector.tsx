import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Globe } from "lucide-react";

export default function LanguageSelector() {
  const { i18n } = useTranslation("common");
  const router = useRouter();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value).then(() => {
      router.push(router.pathname, undefined, { locale: value });
    });
  };

  return (
    <Select onValueChange={handleLanguageChange} value={i18n.language}>
      <SelectTrigger className="w-fit px-3 py-2 text-sm text-black dark:text-white border-none bg-transparent focus:ring-0">
        <Globe className="w-4 h-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ro">RO</SelectItem>
        <SelectItem value="en">EN</SelectItem>
      </SelectContent>
    </Select>
  );
}
