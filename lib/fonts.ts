import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";

export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const ruderPlakat = localFont({
  src: "../public/fonts/Plakat Bold.woff2",
  variable: "--font-ruder-plakat",
  display: "swap",
  fallback: ["Plus Jakarta Sans", "sans-serif"],
});
