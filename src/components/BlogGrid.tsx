import { Post } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "next-i18next";

export default function BlogGrid({ posts }: { posts: Post[] }) {
  const categories = [
    "all",
    "tracks",
    "karts",
    "gear",
    "techniques",
    "events",
    "interviews",
  ];
  const [active, setActive] = useState("all");

  const filtered = useMemo(
    () =>
      active === "all" ? posts : posts.filter((p) => p.category === active),
    [active, posts]
  );

  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center mx-auto max-w-3xl space-y-4 py-12 text-center">
        <h2 className="text-3xl font-extrabold bg-clip-text">
          {t("blog:insights")}
        </h2>
        <p className="text-lg text-muted-foreground">{t("blog:explore")}</p>
      </div>

      <div className="hidden md:block w-full">
        <Tabs value={active} onValueChange={setActive} className="w-full">
          <TabsList>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {t(`blog:${cat}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="md:hidden px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex justify-between items-center px-4 py-2 bg-input rounded">
              <span className="capitalize">{t(`blog:${active}`)}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            {categories.map((cat) => (
              <DropdownMenuItem
                key={cat}
                className="capitalize"
                onSelect={() => setActive(cat)}
              >
                {t(`blog:${cat}`)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`} passHref>
            <Card className="overflow-hidden relative group cursor-pointer transition hover:shadow-lg">
              <div className="relative h-64">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent dark:from-white/60 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 left-4 space-y-0.5">
                  <p className="text-lg font-semibold text-black dark:text-white">
                    {post.author.name}
                  </p>
                  <p className="text-sm text-black dark:text-white">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="absolute top-4 right-4 text-xs font-medium uppercase px-2 py-1 rounded bg-white dark:bg-black text-black dark:text-white">
                  {t(`blog:${post.category}`)}
                </span>
              </div>
              <CardContent>
                <h3 className="text-lg font-bold">{post.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {post.description}
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-sm font-medium underline text-primary">
                  {t("blog:readPost")} &rarr;
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
