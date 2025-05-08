import { useQuery } from "@tanstack/react-query";

export const fetchData = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!res.ok) {
    throw new Error("Failed to fetch data from the api");
  }
  return res.json();
};

export const useData = () => {
  return useQuery({
    queryKey: ["data"],
    queryFn: fetchData,
  });
};
