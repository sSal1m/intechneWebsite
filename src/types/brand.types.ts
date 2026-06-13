export interface BrandStat {
  value: string;
  label: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  stats: BrandStat[];
  logoAlt: string;
  accentColor?: string;
  logoUrl?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  stats: BrandStat[];
}
