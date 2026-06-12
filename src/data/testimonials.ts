import type { TestimonialItem } from '@/src/types/common.types';

export const testimonials: TestimonialItem[] = [
  {
    id: '1',
    name: 'Elif Yıldız',
    role: 'DENEYAP Mezunu',
    quote: 'Bu vakfın sunduğu imkânlar sayesinde hem kendimi geliştirdim hem de ülkeme katkı sağlayacak projelerde yer aldım. Bu deneyim hayatımın en değerli kazanımlarından biri oldu ve beni geleceğe hazırladı.',
    avatarAlt: 'Elif Yıldız Avatar',
    variant: 'featured',
  },
  {
    id: '2',
    name: 'Mehmet Demir',
    role: 'Bursiyer',
    quote: 'Ülkemizin geleceğini şekillendirecek neslin bir parçası olmak büyük bir onur ve sorumluluk. Bu programa katılmak kariyer hedeflerime ulaşmamı kolaylaştırdı.',
    avatarAlt: 'Mehmet Demir Avatar',
    variant: 'secondary',
  },
  {
    id: '3',
    name: 'Zeynep Kaya',
    role: 'Gönüllü',
    quote: 'Vakfın yürüttüğü projeler ve oluşturduğu toplumsal etki sayesinde gençlerimize gerçek anlamda ilham veriliyor. Geleceğe olan umut her geçen gün artıyor.',
    avatarAlt: 'Zeynep Kaya Avatar',
    variant: 'secondary',
  },
];
