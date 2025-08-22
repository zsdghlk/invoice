// src/pdf/fonts.ts
import { Font } from "@react-pdf/renderer";

Font.register({
  family: "NotoSansJP",
  fonts: [
    { src: "/fonts/NotoSansJP-Regular.otf", fontWeight: 400 },
    { src: "/fonts/NotoSansJP-Bold.otf", fontWeight: 700 },
  ],
});
