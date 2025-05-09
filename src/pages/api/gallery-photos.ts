import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const campaigns = [
  "Promo X",
  "Promo Y",
  "Promo Z",
  "Promo Alpha",
  "Promo Beta",
];
const courses = ["Course A", "Course B"];
const years = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const directoryPath = path.join(process.cwd(), "public/uploads");
    const files = fs.readdirSync(directoryPath);

    const images = files.map((name, index) => ({
      name,
      ext: path.extname(name).slice(1),
      campaign: campaigns[index % campaigns.length],
      course: courses[index % courses.length],
      year: years[index % years.length],
    }));

    res.status(200).json(images);
  } catch (error) {
    res.status(500).json([error]);
  }
}
