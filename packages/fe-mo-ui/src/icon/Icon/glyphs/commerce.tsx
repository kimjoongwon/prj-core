import { Line, Path, Rect } from "react-native-svg";
import { BrandedSvg } from "./shared";
import type { IconGlyphProps } from "./types";

export const CreditCardGlyph = (props: IconGlyphProps) => (
  <BrandedSvg {...props}>
    <Rect height="12.5" rx="3" width="17" x="3.5" y="6" />
    <Path d="M3.8 10h16.4" />
    <Path d="M7.2 15h3" />
    <Path d="M13.2 15h2.4" />
  </BrandedSvg>
);

export const ReceiptGlyph = (props: IconGlyphProps) => (
  <BrandedSvg {...props}>
    <Path d="M6.5 4.5h11v15l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2-2 1.2v-15Z" />
    <Line x1="9" x2="15" y1="9" y2="9" />
    <Line x1="9" x2="15" y1="12.5" y2="12.5" />
    <Line x1="9" x2="12.5" y1="16" y2="16" />
  </BrandedSvg>
);

export const TicketCheckGlyph = (props: IconGlyphProps) => (
  <BrandedSvg {...props}>
    <Path d="M4.5 8.1c0-.9.7-1.6 1.6-1.6h11.8c.9 0 1.6.7 1.6 1.6v2.2c-1.3.3-2.2 1-2.2 1.7s.9 1.4 2.2 1.7v2.2c0 .9-.7 1.6-1.6 1.6H6.1c-.9 0-1.6-.7-1.6-1.6v-2.2c1.3-.3 2.2-1 2.2-1.7s-.9-1.4-2.2-1.7V8.1Z" />
    <Path d="m9.4 12.3 1.7 1.6 3.5-3.6" />
  </BrandedSvg>
);

export const WalletCardsGlyph = (props: IconGlyphProps) => (
  <BrandedSvg {...props}>
    <Path d="M5.4 7.2 15.8 4c1-.3 2 .4 2 1.5v1.7" />
    <Rect height="12" rx="3" width="17" x="3.5" y="7.2" />
    <Path d="M16 12.2h4.2v3.8H16c-1.1 0-1.9-.8-1.9-1.9s.8-1.9 1.9-1.9Z" />
    <Path d="M6.8 10.8h4.4" />
  </BrandedSvg>
);
