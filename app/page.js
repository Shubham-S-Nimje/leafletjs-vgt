import { promises as fs } from "fs";
import Mapdata from "@/components/Map/Mapdata";

export default async function Home() {
  const file = await fs.readFile(
    process.cwd() + "/GeoJsonData.geojson",
    "utf8"
  );
  const GeoJsonData = JSON.parse(file);

  // console.log(data);
  return (
    <div className="min-h-screen">
      <Mapdata GeoJsonData={GeoJsonData} />
    </div>
  );
}
