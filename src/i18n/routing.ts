import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
  localeDetection: false,
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/gonulluol': {
      tr: '/gonulluol',
      en: '/become-a-volunteer',
    },
    '/kariyer': {
      tr: '/kariyer',
      en: '/careers',
    },
    '/haberler': {
      tr: '/haberler',
      en: '/news',
    },
    '/haberler/[id]': {
      tr: '/haberler/[id]',
      en: '/news/[id]',
    },
    '/iletisim': {
      tr: '/iletisim',
      en: '/contact',
    },
    '/interaktif': {
      tr: '/interaktif',
      en: '/interactive',
    },
    '/interaktif/[id]': {
      tr: '/interaktif/[id]',
      en: '/interactive/[id]',
    },
    '/kvkk': {
      tr: '/kvkk',
      en: '/privacy-policy',
    },
    '/elektronik-ileti': {
      tr: '/elektronik-ileti',
      en: '/electronic-communication',
    },
    // Hakkımızda
    '/hakkimizda/biz-kimiz': {
      tr: '/hakkimizda/biz-kimiz',
      en: '/about/who-we-are',
    },
    '/hakkimizda/hikayemiz': {
      tr: '/hakkimizda/hikayemiz',
      en: '/about/our-story',
    },
    '/hakkimizda/ekibimiz': {
      tr: '/hakkimizda/ekibimiz',
      en: '/about/our-team',
    },
    '/hakkimizda/basin-odasi': {
      tr: '/hakkimizda/basin-odasi',
      en: '/about/press-center',
    },
    '/hakkimizda/kurumsal-kimlik': {
      tr: '/hakkimizda/kurumsal-kimlik',
      en: '/about/corporate-identity',
    },
    '/hakkimizda/sss': {
      tr: '/hakkimizda/sss',
      en: '/about/faq',
    },
    // Markalarımız
    '/markalarimiz/cezeri-robot-ligi': {
      tr: '/markalarimiz/cezeri-robot-ligi',
      en: '/brands/cezeri-robot-league',
    },
    '/markalarimiz/robonex-robot-ligi': {
      tr: '/markalarimiz/robonex-robot-ligi',
      en: '/brands/robonex-robot-league',
    },
    '/markalarimiz/intechne-akademi': {
      tr: '/markalarimiz/intechne-akademi',
      en: '/brands/intechne-academy',
    },
    '/markalarimiz/tech-chill-fest': {
      tr: '/markalarimiz/tech-chill-fest',
      en: '/brands/tech-chill-fest',
    },
    '/markalarimiz/hack-the-future-marathons': {
      tr: '/markalarimiz/hack-the-future-marathons',
      en: '/brands/hack-the-future-marathons',
    },
    '/markalarimiz/intechne-gaming-hub': {
      tr: '/markalarimiz/intechne-gaming-hub',
      en: '/brands/intechne-gaming-hub',
    },
    '/markalarimiz/drone-cup': {
      tr: '/markalarimiz/drone-cup',
      en: '/brands/drone-cup',
    },
    '/markalarimiz/intechne-girisim-kulubu': {
      tr: '/markalarimiz/intechne-girisim-kulubu',
      en: '/brands/intechne-venture-club',
    },
    // Projelerimiz
    '/projelerimiz/cezeri-robot-ligi': {
      tr: '/projelerimiz/cezeri-robot-ligi',
      en: '/projects/cezeri-robot-league',
    },
    '/projelerimiz/intechne-akademi': {
      tr: '/projelerimiz/intechne-akademi',
      en: '/projects/intechne-academy',
    },
    '/projelerimiz/robonex-robot-ligi': {
      tr: '/projelerimiz/robonex-robot-ligi',
      en: '/projects/robonex-robot-league',
    },
  },
});
