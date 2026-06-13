import type { NavigationConfig } from '@/src/types/navigation.types';

export const trNavigation: NavigationConfig = {
  main: [
    {
      label: 'HAKKIMIZDA',
      items: [
        { label: 'Biz Kimiz?', href: '/hakkimizda/biz-kimiz' },
        { label: 'Hikayemiz', href: '/hakkimizda/hikayemiz' },
        { label: 'Ekibimiz', href: '/hakkimizda/ekibimiz' },
        { label: 'Basın Odası', href: '/hakkimizda/basin-odasi' },
        { label: 'Kurumsal Kimlik', href: '/hakkimizda/kurumsal-kimlik' },
        { label: 'Sıkça Sorulan Sorular', href: '/hakkimizda/sss' },
      ],
    },
    {
      label: 'MARKALARIMIZ',
      items: [
        { label: 'Cezeri Robot Ligi', href: '/markalarimiz/cezeri-robot-ligi' },
        { label: 'Robonex Robot Ligi', href: '/markalarimiz/robonex-robot-ligi' },
        { label: 'Intechne Akademi', href: '/markalarimiz/intechne-akademi' },
        { label: 'Tech & Chill Fest', href: '/markalarimiz/tech-chill-fest' },
        { label: 'Hack The Future Marathons', href: '/markalarimiz/hack-the-future-marathons' },
        { label: 'Intechne Gaming Hub', href: '/markalarimiz/intechne-gaming-hub' },
        { label: 'Drone Cup', href: '/markalarimiz/drone-cup' },
        { label: 'Intechne Girişim Kulübü', href: '/markalarimiz/intechne-girisim-kulubu' },
      ],
    },
    { label: 'İŞBİRLİKLERİMİZ', href: '/isbirliklerimiz' },
    { label: 'HABERLER', href: '/haberler' },
    { label: 'İLETİŞİM', href: '/iletisim' },
  ],
  ctaButtons: [
    { label: 'KARİYER', href: '/kariyer', variant: 'primary' },
    { label: 'GÖNÜLLÜ OL', href: '/gonulluol', variant: 'secondary' },
  ],
};

export const enNavigation: NavigationConfig = {
  main: [
    {
      label: 'ABOUT US',
      items: [
        { label: 'Who We Are', href: '/hakkimizda/biz-kimiz' },
        { label: 'Our Story', href: '/hakkimizda/hikayemiz' },
        { label: 'Our Team', href: '/hakkimizda/ekibimiz' },
        { label: 'Press Center', href: '/hakkimizda/basin-odasi' },
        { label: 'Corporate Identity', href: '/hakkimizda/kurumsal-kimlik' },
        { label: 'FAQ', href: '/hakkimizda/sss' },
      ],
    },
    {
      label: 'OUR BRANDS',
      items: [
        { label: 'Cezeri Robot League', href: '/markalarimiz/cezeri-robot-ligi' },
        { label: 'Robonex Robot League', href: '/markalarimiz/robonex-robot-ligi' },
        { label: 'Intechne Academy', href: '/markalarimiz/intechne-akademi' },
        { label: 'Tech & Chill Fest', href: '/markalarimiz/tech-chill-fest' },
        { label: 'Hack The Future Marathons', href: '/markalarimiz/hack-the-future-marathons' },
        { label: 'Intechne Gaming Hub', href: '/markalarimiz/intechne-gaming-hub' },
        { label: 'Drone Cup', href: '/markalarimiz/drone-cup' },
        { label: 'Intechne Venture Club', href: '/markalarimiz/intechne-girisim-kulubu' },
      ],
    },
    { label: 'COLLABORATIONS', href: '/isbirliklerimiz' },
    { label: 'NEWS', href: '/haberler' },
    { label: 'CONTACT', href: '/iletisim' },
  ],
  ctaButtons: [
    { label: 'CAREER', href: '/kariyer', variant: 'primary' },
    { label: 'VOLUNTEER', href: '/gonulluol', variant: 'secondary' },
  ],
};
