export type NewsVariant = 'featured' | 'secondary';

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  href: string;
  tag?: string;
  imageAlt: string;
}

export interface MediaItem {
  id: string;
  date: string;
  category: string;
  title: string;
  subtitle?: string;
  type: 'video' | 'audio' | 'article' | 'report' | 'interactive';
  href: string;
  imageAlt: string;
  imageUrl?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role?: string;
  quote: string;
  avatarAlt: string;
  variant: 'featured' | 'secondary';
}

export interface StatItem {
  id: string;
  value: string;
  title: string;
  description: string;
  bgColor: string;
  circleBg: string;
  textColor: string;
}
