/* eslint-disable @next/next/no-img-element */

type Props = {
  uid: string | number;
  category: string;
  hue: number;
  name: string;
  imageUrl?: string | null;
};

const BODY = "#1c2130";
const BODY_LIGHT = "#2c3345";

/** Ilustración vectorial por categoría: el catálogo se ve completo sin depender de imágenes externas. */
export function ProductArt({ uid, category, hue, name, imageUrl }: Props) {
  if (imageUrl) {
    return <img className="product-art" src={imageUrl} alt={name} loading="lazy" />;
  }

  const bg = `bg-${uid}`;
  const scr = `scr-${uid}`;
  const screen = `url(#${scr})`;

  return (
    <svg className="product-art" viewBox="0 0 240 180" role="img" aria-label={name}>
      <defs>
        <linearGradient id={bg} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 75% 92%)`} />
          <stop offset="1" stopColor={`hsl(${(hue + 45) % 360} 70% 82%)`} />
        </linearGradient>
        <linearGradient id={scr} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 85% 62%)`} />
          <stop offset="1" stopColor={`hsl(${(hue + 50) % 360} 80% 42%)`} />
        </linearGradient>
      </defs>
      <rect width="240" height="180" fill={`url(#${bg})`} />
      <circle cx="120" cy="90" r="70" fill="#fff" opacity="0.35" />
      <Device category={category} screen={screen} />
    </svg>
  );
}

function Device({ category, screen }: { category: string; screen: string }) {
  switch (category) {
    case "laptops":
      return (
        <g>
          <rect x="50" y="36" width="140" height="90" rx="8" fill={BODY} />
          <rect x="58" y="44" width="124" height="74" rx="3" fill={screen} />
          <path d="M32 126 H208 L198 140 H42 Z" fill={BODY_LIGHT} />
          <rect x="104" y="126" width="32" height="4" rx="2" fill={BODY} />
        </g>
      );
    case "celulares":
      return (
        <g>
          <rect x="88" y="22" width="64" height="136" rx="14" fill={BODY} />
          <rect x="94" y="29" width="52" height="122" rx="9" fill={screen} />
          <rect x="110" y="34" width="20" height="5" rx="2.5" fill={BODY} />
        </g>
      );
    case "tablets":
      return (
        <g>
          <rect x="48" y="28" width="144" height="124" rx="14" fill={BODY} />
          <rect x="56" y="36" width="128" height="108" rx="7" fill={screen} />
          <rect x="196" y="40" width="5" height="96" rx="2.5" fill={BODY_LIGHT} transform="rotate(8 198 88)" />
        </g>
      );
    case "monitores":
      return (
        <g>
          <rect x="30" y="24" width="180" height="108" rx="8" fill={BODY} />
          <rect x="37" y="31" width="166" height="94" rx="3" fill={screen} />
          <rect x="112" y="132" width="16" height="20" fill={BODY_LIGHT} />
          <rect x="84" y="150" width="72" height="8" rx="4" fill={BODY_LIGHT} />
        </g>
      );
    case "audio":
      return (
        <g>
          <path
            d="M72 108 V88 a48 48 0 0 1 96 0 V108"
            fill="none"
            stroke={BODY}
            strokeWidth="12"
            strokeLinecap="round"
          />
          <rect x="56" y="96" width="34" height="56" rx="14" fill={screen} />
          <rect x="150" y="96" width="34" height="56" rx="14" fill={screen} />
          <rect x="62" y="104" width="8" height="40" rx="4" fill={BODY} opacity="0.35" />
          <rect x="170" y="104" width="8" height="40" rx="4" fill={BODY} opacity="0.35" />
        </g>
      );
    case "wearables":
      return (
        <g>
          <rect x="98" y="14" width="44" height="152" rx="12" fill={BODY_LIGHT} />
          <rect x="80" y="50" width="80" height="80" rx="22" fill={BODY} />
          <rect x="88" y="58" width="64" height="64" rx="15" fill={screen} />
          <rect x="160" y="76" width="6" height="18" rx="3" fill={BODY} />
        </g>
      );
    default:
      // accesorios: teclado + mouse
      return (
        <g>
          <rect x="22" y="70" width="146" height="62" rx="8" fill={BODY} />
          {Array.from({ length: 30 }, (_, i) => (
            <rect
              key={i}
              x={30 + (i % 10) * 13.4}
              y={78 + Math.floor(i / 10) * 13}
              width="10"
              height="10"
              rx="2"
              fill={screen}
              opacity={0.55 + ((i * 7) % 5) * 0.09}
            />
          ))}
          <rect x="62" y="118" width="66" height="8" rx="2" fill={screen} opacity="0.8" />
          <rect x="180" y="76" width="38" height="58" rx="19" fill={BODY} />
          <line x1="199" y1="80" x2="199" y2="98" stroke={screen} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
  }
}
