export type Post = {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  category: string;
  author: {
    name: string;
  };
};
