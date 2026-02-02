import type { Metadata } from "next";
import { KartControls } from "../components/KartControls";

export const metadata: Metadata = {
  title: "Kart Controls",
};

export default function Page() {

  return (
    <div className="w-full h-full flex items-center justify-center">
      <KartControls />
    </div>
  );
}
