import type { NewsItem } from '@/src/types/common.types';

export const newsItems: NewsItem[] = [
  {
    id: '1',
    date: '11 Haziran 2026',
    title: 'Yıldız Robot Yarışları Tasarım Hackathon’u Başlıyor!',
    excerpt: 'Genç tasarımcıların ve yazılımcıların sınırlarını zorlayacağı Yıldız Robot Yarışları Tasarım Hackathon’u heyecanı başlıyor.',
    href: '/haberler/1',
    tag: 'Öne Çıkan',
    imageAlt: 'Tasarım Hackathonu',
  },
  {
    id: '2',
    date: '12 Haziran 2026',
    title: 'Gaziantep Drone Fest 26-27 Haziran’da Festival Park’ta!',
    excerpt: 'Hız, teknoloji ve heyecan dolu Gaziantep Drone Fest, bu yıl 26-27 Haziran tarihlerinde Festival Park’ta kapılarını açıyor.',
    href: '/haberler/2',
    imageAlt: 'Drone Fest',
  },
  {
    id: '3',
    date: '08 Haziran 2026',
    title: 'Intechne Akademi Yeni Dönem Başvuruları Kabul Edilmeye Başlandı',
    excerpt: 'Uygulamalı eğitimlerle donanımlı teknoloji uzmanları yetiştiren Intechne Akademi yeni dönem kayıt detayları duyuruldu.',
    href: '/haberler/3',
    imageAlt: 'Intechne Akademi Başvuru',
  },
  {
    id: '4',
    date: '05 Haziran 2026',
    title: 'Robonex Robot Ligi Bölgesel Eleme Sonuçları Açıklandı',
    excerpt: 'Türkiye genelinde düzenlenen bölgesel elemelerin ardından büyük finale katılmaya hak kazanan robot takımları belli oldu.',
    href: '/haberler/4',
    imageAlt: 'Robonex Sonuçlar',
  },
  {
    id: '5',
    date: '01 Haziran 2026',
    title: 'Tech & Chill Fest 2026 Biletleri Biletix Üzerinden Satışa Sunuldu',
    excerpt: 'Sosyal yaşam ile teknolojinin harmanlandığı, e-spor ve konserlerle dolu festivalde yerinizi şimdiden alın.',
    href: '/haberler/5',
    imageAlt: 'Tech Chill Fest Biletleri',
  },
];
