import type { Brand, HeroSlide } from '@/src/types/brand.types';

export const brands: Brand[] = [
  {
    id: '1',
    name: 'Cezeri Robot Ligi',
    slug: 'cezeri-robot-ligi',
    shortDescription: 'Intechne ekosisteminin güçlü bir parçası olan Cezeri Robot Ligi; uluslararası standartlardaki robotik yarışmaları, kıyasıya geçen otonom donanım mücadeleleri, teknoloji atölyeleri ve inovasyon odaklı etkinlikler gibi birçok faaliyete ev sahipliği yaparak gençlerde mühendisliğe olan ilgiyi heyecan verici bir spor tutkusuna dönüştürmeyi ve Türkiye’nin küresel ölçekte yüksek teknoloji üreten yenilmez bir topluma dönüşmesi konusunda güçlü bir farkındalık oluşturmayı hedeflemektedir.',
    stats: [
      { value: '3. Yıl', label: '' },
      { value: '6', label: 'Yarışma' },
      { value: '10.000', label: 'Yarışmacı' },
    ],
    logoAlt: 'Cezeri Robot Ligi Logo',
    accentColor: '#E30713',
  },
  {
    id: '2',
    name: 'Robonex Robot Ligi',
    slug: 'robonex-robot-ligi',
    shortDescription: 'Intechne\'nin yeni nesil teknoloji vizyonunu sahaya yansıtan Robonex Robot Ligi; fütüristik otonom sistem mücadeleleri, yapay zeka destekli robotik yarışmaları ve ileri teknoloji etkinlikleri gibi birçok faaliyete ev sahipliği yaparak genç mühendisleri geleceğin global inovasyon yarışına en iyi şekilde hazırlayı temel alır.',
    stats: [
      { value: '1. Yıl', label: '' },
      { value: '3', label: 'Yarışma' },
      { value: '6000', label: 'Yarışmacı' },
    ],
    logoAlt: 'Robonex Robot Ligi Logo',
    accentColor: '#4F46E5',
  },
  {
    id: '3',
    name: 'Tech & Chill Fest',
    slug: 'tech-chill-fest',
    shortDescription: 'Intechne ekosisteminin amiral gemisi etkinliği olan Tech & Chill Fest; gündüzleri teknoloji hackathonları, robotik finalleri ve inovasyon atölyeleri, akşamları ise canlı müzik performansları ve e-spor turnuvaları gibi many faaliyete ev sahipliği yaparak teknolojinin sosyal yaşamla kusursuzca bütünleştiği dinamik bir buluşma noktası yaratır.',
    stats: [
      { value: '1. Yıl', label: '' },
      { value: '4', label: 'Etkinlik' },
      { value: '8000+', label: 'Katılımcı' },
    ],
    logoAlt: 'Tech & Chill Fest Logo',
    accentColor: '#D97706',
  },
  {
    id: '4',
    name: 'Intechne Akademi',
    slug: 'intechne-akademi',
    shortDescription: 'Intechne ekosisteminin uygulamalı eğitim üssü olan Intechne Akademi; inovasyon atölyeleri, donanım ve yazılım eğitimleri, maker kampları ve proje odaklı mentorluk programları gibi birçok faaliyete ev sahipliği yaparak gençlerin teorik bilgilerini sahanın gerçekliğiyle harmanlayan yenilikçi bir öğrenme ortamı sunar.',
    stats: [
      { value: '5', label: 'İl' },
      { value: '30+', label: 'Atölye' },
      { value: '5.000+', label: 'Öğrenci' },
    ],
    logoAlt: 'Intechne Akademi Logo',
    accentColor: '#7C3AED',
  },
  {
    id: '5',
    name: 'Drone Cup',
    slug: 'drone-cup',
    shortDescription: 'Intechne ekosisteminin gökyüzündeki fütüristik rekabet arenası olan Drone Cup; yüksek hızlı profesyonel drone yarışları, tamamen havada oynanan nefes kesici drone futbolu mücadeleleri, aerodinamik tasarım atölyeleri ve ileri mühendislik etkinlikleri gibi birçok faaliyete ev sahipliği yaparak gençlerdeki havacılık tutkusunu teknolojiyle buluşturan benzersiz bir deneyim sunmaktadır.',
    stats: [
      { value: '4. Yıl', label: '' },
      { value: '120', label: 'Pilot' },
      { value: '2500', label: 'Ziyaretçi' },
    ],
    logoAlt: 'Drone Cup Logo',
    accentColor: '#0D9488',
  },
  {
    id: '6',
    name: 'Intechne Girişim Kulübü',
    slug: 'intechne-girisim-kulubu',
    shortDescription: 'Intechne ekosisteminin yenilikçi fikirleri küresel projelere dönüştüren vizyoner mutfağı olan Intechne Girişim Kulübü; ideathonlar, yatırımcı buluşmaları, start-up zirveleri ve stratejik mentorluk programları gibi birçok faaliyete ev sahipliği yaparak gençlerdeki teknoloji üretme tutkusunu sürdürülebilir iş modelleriyle buluşturmayı ve sahanın zorlu şartlarından doğan projelerin küresel çapta başarılı derin teknoloji girişimleri olarak ekosisteme kazandırılmasını amaçlamaktadır.',
    stats: [
      { value: '200+', label: 'Girişim' },
      { value: '50+', label: 'Mentor' },
      { value: '5+', label: 'Yıl' },
    ],
    logoAlt: 'Intechne Girişim Kulübü Logo',
    accentColor: '#0ac8da',
  },
  {
    id: '7',
    name: 'Intechne Gaming Hub',
    slug: 'intechne-gaming-hub',
    shortDescription: 'Intechne ekosisteminin dijital dünyadaki interaktif rekabet ve üretim üssü olan Intechne Gaming Hub; strateji odaklı e-spor turnuvaları, oyun geliştirme maratonları (game jams), sanal gerçeklik (VR) atölyeleri ve dijital inovasyon etkinlikleri gibi birçok faaliyete ev sahipliği yaparak gençlerdeki oyun oynama tutkusunu teknoloji tasarlama gücüne dönüştürmeyi ve yetenekli geliştiricileri küresel oyun ekosistemine kazandırmayı amaçlamaktadır.',
    stats: [
      { value: '15', label: 'Turnuva' },
      { value: '500+', label: 'Geliştirici' },
      { value: '4', label: 'Game Jam' },
    ],
    logoAlt: 'Intechne Gaming Hub Logo',
    accentColor: '#0369A1',
  },
  {
    id: '8',
    name: 'Hack the Future Maratonları',
    slug: 'hack-the-future-marathons',
    shortDescription: 'Intechne ekosisteminin sınırları zorlayan vizyoner yazılım ve üretim arenası olan Hack the Future Maratonları; kesintisiz kodlama hackathonları, derin teknoloji (deep-tech) odaklı hızlı prototipleme yarışmaları, yapay zeka geliştirme kampları ve ileri düzey problem çözme etkinlikleri gibi birçok faaliyete ev sahipliği yaparak gençlerin analitik zekasını inovatif projelere dönüştürmeyi ve geleceğin küresel sorunlarına bugünden güçlü teknolojik çözümler üreten yenilikçi bir nesil yetiştirmeyi amaçlamaktadır.',
    stats: [
      { value: '24 Saat', label: 'Kodlama' },
      { value: '1500+', label: 'Geliştirici' },
      { value: '50+', label: 'Mentor' },
    ],
    logoAlt: 'Hack the Future Maratonları Logo',
    accentColor: '#1D4ED8',
  },
];

export const heroSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'Cezeri Robot Ligi',
    description: 'Mühendisliği kıyasıya bir spora dönüştürmek ve Türkiye\'deki genç yetenekleri küresel rekabete hazırlamak hedefiyle düzenlenen devasa bir robotik ligidir.',
    href: '/projelerimiz/cezeri-robot-ligi',
    buttonLabel: 'Daha Fazla Bilgi',
    stats: [
      { value: '3. Yıl', label: '' },
      { value: '6', label: 'Yarışma' },
      { value: '10.000', label: 'Yarışmacı' },
    ],
  },
  {
    id: '2',
    title: 'Intechne Akademi',
    description: 'Genç yetenekleri teorik eğitimin sınırlarından çıkarıp gerçek dünya projeleriyle buluşturmak ve sektöre donanımlı mühendisler kazandırmak hedefiyle kurulan uygulamalı teknoloji akademisidir.',
    href: '/projelerimiz/intechne-akademi',
    buttonLabel: 'Daha Fazla Bilgi',
    stats: [
      { value: '5', label: 'İl' },
      { value: '30+', label: 'Atölye' },
      { value: '5.000+', label: 'Öğrenci' },
    ],
  },
  {
    id: '3',
    title: '2026 Vex Robotics Türkiye Şampiyonası',
    description: 'Dünyanın en prestijli STEM programlarından birini Türkiye arenasına taşıyarak, genç yeteneklerin mekanik tasarım ve takım çalışması becerilerini küresel standartlarda test ettiği ulusal robotik şampiyonasıdır.',
    href: '/projelerimiz/cezeri-robot-ligi',
    buttonLabel: 'Daha Fazla Bilgi',
    stats: [
      { value: '18', label: 'şehir' },
      { value: '3500', label: 'Yarışmacı' },
    ],
  },
  {
    id: '4',
    title: 'Robonex Robot Ligi',
    description: 'Yeni nesil otonom sistemler ve robotik teknolojilerin kıyasıya yarıştığı, genç mühendisleri geleceğin teknolojilerine hazırlamak hedefiyle düzenlenen dinamik bir rekabet arenasıdır.',
    href: '/projelerimiz/robonex-robot-ligi',
    buttonLabel: 'Daha Fazla Bilgi',
    stats: [
      { value: '1. Yıl', label: '' },
      { value: '3', label: 'Yarışma' },
      { value: '6000', label: 'Yarışmacı' },
    ],
  },
];
