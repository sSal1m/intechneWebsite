'use client';

import { useMemo, useState } from 'react';
import { brands } from '@/src/data/brands';
import { Play, Image as ImageIcon, Award, Calendar, Users, Cpu, Rocket, BookOpen, Joystick, Zap, X } from 'lucide-react';

interface BrandPageContentProps {
  slug: string;
  locale: string;
}

// Custom descriptions and sections for each brand
const brandDetails: Record<
  string,
  {
    tr: {
      nedir: string;
      vizyon: string;
      kapsam: string;
      sections: { title: string; content: string }[];
      statusMessage?: string;
    };
    en: {
      nedir: string;
      vizyon: string;
      kapsam: string;
      sections: { title: string; content: string }[];
      statusMessage?: string;
    };
    icon: any;
    videoUrl?: string;
    gallery?: string[];
  }
> = {
  'cezeri-robot-ligi': {
    icon: Cpu,
    videoUrl: 'https://www.youtube.com/embed/lwVJD7K-LT8',
    gallery: [
      '/gallery/Cezeri-Robot-Ligi-Galeri-Gorselleri/Cezeri-Robot-Ligi-Galeri-Gorseli-1.JPG',
      '/gallery/Cezeri-Robot-Ligi-Galeri-Gorselleri/Cezeri-Robot-Ligi-Galeri-Gorseli-2.JPG',
      '/gallery/Cezeri-Robot-Ligi-Galeri-Gorselleri/Cezeri-Robot-Ligi-Galeri-Gorseli-3.JPG'
    ],
    tr: {
      nedir: 'Intechne ekosisteminin güçlü bir parçası olan Cezeri Robot Ligi; uluslararası standartlardaki robotik yarışmaları, kıyasıya geçen otonom donanım mücadeleleri, teknoloji atölyeleri ve inovasyon odaklı etkinlikler gibi birçok faaliyete ev sahipliği yaparak gençlerde mühendisliğe olan ilgiyi heyecan verici bir spor tutkusuna dönüştürmeyi ve yeteneklerin potansiyelini sahada keşfetmeyi amaçlamaktadır.',
      vizyon: 'Ligi’n temel amacı; genç yeteneklerin potansiyelini kağıt üzerindeki sınavlardan çıkarıp sahadaki kriz anlarında ölçmek, mühendisliği kıyasıya bir spora dönüştürmek ve "Maker" ruhuyla "Teknoloji Üreten Bir Türkiye" hedefine doğrudan yetenek kazandırmaktır.',
      kapsam: 'Cezeri Robot Ligi, mühendislik disiplinleri ile e-spor dinamiklerini bir araya getiren yenilikçi bir yapıya sahiptir. Yarışmalar; otonom araçlar, sensör kalibrasyonu, modüler robotik sistemler, aerodinamik tasarım ve yapay zeka tabanlı görüntü işleme gibi geleceğin odak alanlarında düzenlenmektedir.',
      sections: [
        { title: 'Cezeri Robot Ligi Nedir?', content: 'Cezeri Robot Ligi, Türkiye’de yeni nesil donanım ve yapay zeka teknolojilerinin geliştirilmesinde kritik bir rol üstlenen, mühendisliği sahanın gerçekliğiyle buluşturan ve Intechne vizyonuyla hayata geçirilen devasa bir robotik arenasıdır. Kurulduğu günden bu yana simülasyonları ve teorik sınırları rafa kaldıran lig; yüksek tempolu otonom sistem mücadeleleri, kriz yönetimi simülasyonları, interaktif atölyeler ve dijital yetenek keşfi alanlarıyla teknoloji tutkunu gençleri arenada bir araya getirmektedir. Cezeri Robot Ligi, yarışmacıların sadece kod yazıp mekanik tasarladığı değil, geliştirdikleri sistemlerin sınırlarını stres ve zaman baskısı altında test ettiği "gerçek dünya" mühendislik platformudur.' },
        { title: 'Cezeri Robot Ligi’nin Amacı ve Vizyonu', content: 'Ligi’n temel amacı; genç yeteneklerin potansiyelini kağıt üzerindeki sınavlardan çıkarıp sahadaki kriz anlarında ölçmek, mühendisliği kıyasıya bir spora dönüştürmek ve "Maker" ruhuyla "Teknoloji Üreten Bir Türkiye" hedefine doğrudan yetenek kazandırmaktır. Cezeri Robot Ligi, donanım ve Uç Bilişim (Edge-AI) teknolojilerini tabana yaymayı, lise ve üniversite seviyesindeki gençlerin kendi otonom robotlarını üretebilecekleri sürdürülebilir bir ekosistem yaratmayı amaçlamaktadır. Bu vizyon doğrultusunda lig, "Phygital" (fiziksel ve dijital) yetenek platformu olarak geleceğin derin teknoloji (deep-tech) girişimcilerini ve donanım mühendislerini keşfetmeye öncülük eder.' },
        { title: 'Cezeri Robot Ligi Hangi Alanları Kapsar?', content: 'Cezeri Robot Ligi, mühendislik disiplinleri ile e-spor dinamiklerini bir araya getiren yenilikçi bir yapıya sahiptir. Yarışmalar; otonom araçlar, sensör kalibrasyonu, modüler robotik sistemler, aerodinamik tasarım ve yapay zeka tabanlı görüntü işleme gibi geleceğin odak alanlarında düzenlenmektedir. Arena alanında ise nefes kesen teknoloji finallerinin ve kriz yönetimi hackathonlarının yanı sıra; donanım sergileri, maker atölyeleri, sektör buluşmaları ve TechApp altyapısıyla desteklenen interaktif veri analizi ekranları ziyaretçilere sunulmaktadır. Bu yapı, mühendisliği izleyici için bir şova, yarışmacı için ise profesyonel bir deneyime dönüştürür.' },
        { title: 'Cezeri Robot Ligi Yarışmaları Nelerdir?', content: 'Cezeri Robot Ligi yarışmaları, farklı seviyelere hitap eden ve donanım sınırlarını zorlayan spesifik kategorilerden oluşur. Bunlar arasında; ileri seviye çizgi izleyen ve engelden kaçan otonom sistemler, labirent çözen algoritmalar, mini otopilot görevleri ve takımların anlık donanım arızalarını sahada çözmesini gerektiren "Arena Hackathon" formatları yer almaktadır. Yarışmacılar, geliştirdikleri prototipleri masa başında değil, binlerce seyircinin önünde devasa arenalarda test eder. Final aşamalarında robotların kararlılığı, hızı ve takımın kriz anındaki müdahale yeteneği TechApp altyapısı ve Uç Bilişim (Edge-AI) hakemliği ile sıfır hatayla ölçümlenir.' },
        { title: 'Kimler Katılabilir?', content: 'Cezeri Robot Ligi; algoritmik düşünce becerisine sahip ortaokul öğrencilerinden, derin teknoloji projeleri geliştiren lise ve üniversite takımlarına kadar geniş bir profile açıktır. Yarışmalar "Takım" ruhunu temel alır; her takım mekanikçi, yazılımcı ve takım kaptanı gibi profesyonel rollere ayrılarak başvuru yapar. Yaş ve eğitim seviyesine göre farklılaşan zorluk dereceleri sayesinde, her yetenek kendi klasmanında yarışma ve küresel arenaya hazırlanma fırsatı bulur.' },
        { title: 'Başvuru Süreci Nasıl İşler?', content: 'Yarışmalara başvurular, Intechne ekosisteminin dijital platformları üzerinden çevrim içi olarak kabul edilmektedir. Süreçte takımlar; yarışmak istedikleri kategoriyi seçer, takım üyelerinin rollerini belirler ve otonom sistemlerinin teknik tasarım raporlarını (prototip aşamalarını) sisteme yükler. Ön elemeyi geçen takımlar, Intechne Akademi mentorları tarafından incelenir ve teknik yeterliliği onaylanan ekipler fiziksel arenada düzenlenecek büyük finallere davet edilir.' },
        { title: 'Cezeri Robot Ligi’nde Sunulan Fırsatlar ve Destekler', content: 'Cezeri Robot Ligi, takımlara sadece bir kupa değil, kariyerlerini dönüştürecek gerçek bir "Yetenek Keşfi" (HR-Tech) ekosistemi sunar. TechApp altyapısı sayesinde sahadaki hız, arıza çözme ve takım içi iletişim verileri doğrulanmış yetenek CV\'lerine dönüştürülür. Finalist takımlara yarışma süresince teknik malzeme ve mentorluk desteği sağlanır. Dereceye giren öğrenciler; Intechne Girişim Kulübü kapsamında kendi Start-up\'larını kurma, yatırımcılarla (Pitching) buluşma ve ekosistemdeki donanım partnerlerinde staj yapma fırsatı yakalar.' }
      ]
    },
    en: {
      nedir: 'As a strong part of the Intechne ecosystem, Cezeri Robot League aims to transform the interest in engineering into an exciting sports passion in young people and discover the potential of talents in the field by hosting many activities such as robotics competitions at international standards, fierce autonomous hardware challenges, technology workshops, and innovation-oriented events.',
      vizyon: 'The main goal of the league is to take the potential of young talents out of paper-based exams and measure it in on-field crisis situations, to transform engineering into a fierce sport, and to bring talent directly to the target of a "Technology Producing Turkey" with a "Maker" spirit.',
      kapsam: 'Cezeri Robot League has an innovative structure that combines engineering disciplines with e-sports dynamics. Competitions are organized in the focus areas of the future such as autonomous vehicles, sensor calibration, modular robotic systems, aerodynamic design, and AI-based image processing.',
      sections: [
        { title: 'What is Cezeri Robot League?', content: 'Cezeri Robot League is a massive robotics arena that plays a critical role in the development of next-generation hardware and artificial intelligence technologies in Turkey, bringing engineering together with the reality of the field and implemented with the vision of Intechne. Shelving simulations and theoretical boundaries since its inception, the league gathers tech-enthusiast youth in the arena with high-paced autonomous system challenges, crisis management simulations, interactive workshops, and digital talent discovery areas. Cezeri Robot League is a "real-world" engineering platform where competitors do not just write code and design mechanics, but test the limits of their developed systems under stress and time pressure.' },
        { title: 'Purpose and Vision of Cezeri Robot League', content: 'The main purpose of the league is to take the potential of young talents out of paper-based exams and measure it in on-field crisis situations, to transform engineering into a fierce sport, and to bring talent directly to the target of a "Technology Producing Turkey" with a "Maker" spirit. Cezeri Robot League aims to spread hardware and Edge-AI technologies to the grassroots, and to create a sustainable ecosystem where high school and university students can produce their own autonomous robots. In line with this vision, the league leads the way in discovering future deep-tech entrepreneurs and hardware engineers as a "Phygital" (physical and digital) talent platform.' },
        { title: 'What Fields Does Cezeri Robot League Cover?', content: 'Cezeri Robot League has an innovative structure that combines engineering disciplines with e-sports dynamics. Competitions are organized in the focus areas of the future such as autonomous vehicles, sensor calibration, modular robotic systems, aerodynamic design, and AI-based image processing. In the arena area, along with breathtaking technology finals and crisis management hackathons, hardware exhibitions, maker workshops, sector meetings, and interactive data analysis displays supported by TechApp infrastructure are presented to visitors. This structure transforms engineering into a show for the audience and a professional experience for the competitor.' },
        { title: 'What are Cezeri Robot League Competitions?', content: 'Cezeri Robot League competitions consist of specific categories addressing different levels and pushing the boundaries of hardware. These include advanced line follower and obstacle avoidance autonomous systems, maze-solving algorithms, mini autopilot missions, and "Arena Hackathon" formats where teams must resolve instantaneous hardware failures in the field. Competitors test their developed prototypes not at the desk but in huge arenas in front of thousands of spectators. During final stages, the stability, speed of the robots, and the team\'s crisis response capabilities are measured with zero error using TechApp infrastructure and Edge-AI refereeing.' },
        { title: 'Who Can Participate?', content: 'Cezeri Robot League is open to a wide profile, from middle school students with algorithmic thinking skills to high school and university teams developing deep tech projects. Competitions are based on the "Team" spirit; each team applies by separating into professional roles like mechanist, programmer, and team captain. Thanks to difficulty levels that vary according to age and education level, each talent finds the opportunity to compete in their own class and prepare for the global arena.' },
        { title: 'How Does the Application Process Work?', content: 'Applications for the competitions are accepted online through the digital platforms of the Intechne ecosystem. In the process, teams select the category they want to compete in, determine the roles of team members, and upload the technical design reports of their autonomous systems (prototype stages) to the system. Teams passing the pre-elimination are reviewed by Intechne Academy mentors, and teams whose technical qualifications are approved are invited to the grand finals to be held in the physical arena.' },
        { title: 'Opportunities and Supports Offered in Cezeri Robot League', content: 'Cezeri Robot League offers teams not just a trophy, but a real "Talent Discovery" (HR-Tech) ecosystem that will transform their careers. Thanks to the TechApp infrastructure, on-field speed, troubleshooting, and in-team communication data are turned into verified talent CVs. Finalist teams are provided with technical materials and mentorship support throughout the competition. Winning students get the opportunity to establish their own startups within the scope of Intechne Entrepreneurship Club, meet with investors (Pitching), and intern at hardware partners in the ecosystem.' }
      ]
    }
  },
  'robonex-robot-ligi': {
    icon: Cpu,
    videoUrl: 'https://www.youtube.com/embed/62cl95cEm4A',
    gallery: [
      '/gallery/Robonex-Robot-Ligi-Galeri-Gorselleri/Robonex-Robot-Ligi-Galeri-Gorseli-1.JPG',
      '/gallery/Robonex-Robot-Ligi-Galeri-Gorselleri/Robonex-Robot-Ligi-Galeri-Gorseli-2.JPG',
      '/gallery/Robonex-Robot-Ligi-Galeri-Gorselleri/Robonex-Robot-Ligi-Galeri-Gorseli-3.JPG'
    ],
    tr: {
      nedir: 'Intechne\'nin yeni nesil teknoloji vizyonunu sahaya yansıtan Robonex Robot Ligi; fütüristik otonom sistem mücadeleleri, yapay zeka destekli robotik yarışmaları ve ileri teknoloji etkinlikleri gibi birçok faaliyete ev sahipliği yaparak genç mühendisleri geleceğin global inovasyon yarışına en iyi şekilde hazırlamayı temel alır.',
      vizyon: 'Ligi’n vizyonu; Türkiye\'nin küresel ölçekte derin teknoloji (deep-tech) üreten öncü bir topluma dönüşmesine katkı sağlamak ve geleceğin donanım mimarlarını bugünden keşfetmektir.',
      kapsam: 'Robonex; Uç Bilişim (Edge-AI), bilgisayarlı görü (Computer Vision), ileri düzey nesne takibi, fütüristik araç tasarımları ve akıllı şehir çözümlerine entegre olabilen otonom sistemler gibi geleceğin en kritik mühendislik alanlarını kapsar.',
      sections: [
        { title: 'Robonex Robot Ligi Nedir?', content: 'Robonex Robot Ligi, klasik robotik algısını yıkarak yapay zeka, makine öğrenmesi ve yeni nesil (next-gen) donanım mimarilerini arenaya taşıyan fütüristik bir teknoloji platformudur. Geleneksel yarışma formatlarının ötesine geçen Robonex; sürü teknolojileri (swarm robotics), görüntü işleme tabanlı otonom araçlar ve ileri düzey sensör füzyonu gerektiren görevlerle mühendislik sınırlarını zorlar. Katılımcıların yalnızca kod yazması değil, geliştirdikleri sistemlerin "kendi kendine karar verebilme" yeteneklerini test ettiği dinamik bir teknoloji şovudur.' },
        { title: 'Robonex Robot Ligi’nin Amacı ve Vizyonu', content: 'Ligi’n vizyonu; Türkiye\'nin küresel ölçekte derin teknoloji (deep-tech) üreten öncü bir topluma dönüşmesine katkı sağlamak ve geleceğin donanım mimarlarını bugünden keşfetmektir. Robonex, genç yetenekleri ezberlenmiş algoritmaların dışına çıkarıp, belirsizlik altında otonom kararlar alabilen akıllı sistemler tasarlamaya teşvik eder.' },
        { title: 'Robonex Robot Ligi Hangi Alanları Kapsar?', content: 'Robonex; Uç Bilişim (Edge-AI), bilgisayarlı görü (Computer Vision), ileri düzey nesne takibi, fütüristik araç tasarımları ve akıllı şehir çözümlerine entegre olabilen otonom sistemler gibi geleceğin en kritik mühendislik alanlarını kapsar. Arena alanında rekabetçi finallerin yanı sıra, yapay zeka atölyeleri ve yeni nesil donanım sergileri de yer alır.' },
        { title: 'Robonex Yarışmaları Nelerdir?', content: 'Yarışmalar; yapay zeka destekli labirent çözücüler, otonom hedef tanıma ve takip sistemleri, görev tabanlı insansız kara araçları (İKA) ve ileri düzey otopilot simülasyonları gibi kategorilerden oluşur. Bu arenalarda robotların hızı kadar, sahadaki engelleri analiz etme ve algoritmik karar alma süreleri de puanlanır.' },
        { title: 'Kimler Katılabilir?', content: 'Temel robotik bilgisine sahip olup sistemlerini yapay zeka ile entegre etmek isteyen lise, üniversite öğrencileri ve genç profesyonellere açıktır. İleri seviye kodlama ve donanım tecrübesi olan takımlar için tasarlanmıştır.' },
        { title: 'Başvuru Süreci Nasıl İşler?', content: 'Başvurular, Intechne dijital platformları üzerinden alınır. Takımlar, otonom sistemlerinin mimarisini, kullanacakları sensör teknolojilerini ve yapay zeka algoritmalarını detaylandıran teknik tasarım raporlarını sisteme yükler. Ön elemeyi geçen projeler, vizyoner final arenalarında yarışmaya hak kazanır.' },
        { title: 'Sunulan Fırsatlar ve Destekler', content: 'Finalistlere ileri düzey donanım (mini bilgisayarlar, endüstriyel sensörler vb.) ve mentorluk destekleri sunulur. Başarılı ekiplerin sahadaki veri analizi, Intechne TechApp üzerinden profillenerek global teknoloji şirketlerinin İnsan Kaynakları departmanlarına "Doğrulanmış Yetenek" olarak sunulur.' }
      ]
    },
    en: {
      nedir: 'Reflecting Intechne\'s new generation technology vision in the field, Robonex Robot League is based on preparing young engineers for the future global innovation race in the best way by hosting many activities such as futuristic autonomous system challenges, AI-supported robotics competitions, and high-tech events.',
      vizyon: 'The vision of the league is to contribute to Turkey\'s transformation into a pioneering society producing deep technology (deep-tech) on a global scale and to discover the hardware architects of the future starting today.',
      kapsam: 'Robonex covers the most critical engineering areas of the future, such as Edge-AI, computer vision, advanced object tracking, futuristic vehicle designs, and autonomous systems that can integrate into smart city solutions.',
      sections: [
        { title: 'What is Robonex Robot League?', content: 'Robonex Robot League is a futuristic technology platform that shatters classical robotics perception and brings artificial intelligence, machine learning, and next-generation hardware architectures to the arena. Going beyond traditional competition formats, Robonex pushes engineering limits with tasks requiring swarm robotics, image processing-based autonomous vehicles, and advanced sensor fusion. It is a dynamic technology show where participants do not just write code, but test the "self-decision-making" capabilities of the systems they develop.' },
        { title: 'Purpose and Vision of Robonex Robot League', content: 'The vision of the league is to contribute to Turkey\'s transformation into a pioneering society producing deep technology (deep-tech) on a global scale and to discover the hardware architects of the future starting today. Robonex encourages young talents to step out of memorized algorithms and design smart systems that can make autonomous decisions under uncertainty.' },
        { title: 'What Fields Does Robonex Robot League Cover?', content: 'Robonex covers the most critical engineering areas of the future, such as Edge-AI, computer vision, advanced object tracking, futuristic vehicle designs, and autonomous systems that can integrate into smart city solutions. In the arena area, alongside competitive finals, artificial intelligence workshops and next-generation hardware exhibitions are also featured.' },
        { title: 'What are Robonex Competitions?', content: 'Competitions consist of categories such as AI-powered maze solvers, autonomous target recognition and tracking systems, mission-based unmanned ground vehicles (UGV), and advanced autopilot simulations. In these arenas, the speed of the robots is scored along with their obstacle analysis and algorithmic decision-making times.' },
        { title: 'Who Can Participate?', content: 'It is open to high school, university students, and young professionals who have basic robotics knowledge and want to integrate their systems with artificial intelligence. It is designed for teams with advanced coding and hardware experience.' },
        { title: 'How Does the Application Process Work?', content: 'Applications are received through Intechne digital platforms. Teams upload technical design reports detailing the architecture of their autonomous systems, the sensor technologies they will use, and their AI algorithms. Projects passing the pre-elimination earn the right to compete in visionary final arenas.' },
        { title: 'Opportunities and Supports Offered', content: 'Finalists are offered advanced hardware (mini-computers, industrial sensors, etc.) and mentoring support. The on-field data analysis of successful teams is profiled via Intechne TechApp and presented as "Verified Talent" to the Human Resources departments of global technology companies.' }
      ]
    }
  },
  'tech-chill-fest': {
    icon: Zap,
    tr: {
      nedir: 'Intechne ekosisteminin amiral gemisi etkinliği olan Tech & Chill Fest; gündüzleri teknoloji hackathonları, robotik finalleri and inovasyon atölyeleri, akşamları ise canlı müzik performansları ve e-spor turnuvaları gibi birçok faaliyete ev sahipliği yaparak teknolojinin sosyal yaşamla kusursuzca bütünleştiği dinamik bir buluşma noktası yaratır.',
      vizyon: 'Festivalin vizyonu, teknolojiyi sadece "ciddi ve laboratuvarlara hapsolmuş" bir disiplin olmaktan çıkarıp, gençlerin sosyal hayatının merkezine, bir "yaşam tarzı" olarak yerleştirmektir.',
      kapsam: 'Festival alanı iki ana kutba ayrılır: "Tech" bölgesi ve "Chill" bölgesi. Tech alanı; donanım prototiplerinin sergilendiği, Cezeri ve Robonex final maçlarının yapıldığı, 3D yazıcı atölyelerinin ve yatırımcı sunumlarının gerçekleştirildiği inovasyon merkezidir. Chill alanı ise; oyun stüdyolarının (Intechne Gaming Hub), VR/AR deneyim alanlarının, e-spor sahnelerinin, dinlenme alanlarının dev konser sahnelerinin yer aldığı sosyal etkileşim merkezidir.',
      statusMessage: 'Festival Çok Yakında!',
      sections: [
        { title: 'Tech & Chill Fest Nedir?', content: 'Tech & Chill Fest, "gündüz üret, gece kutla" mottosuyla hayata geçirilen, Türkiye’nin en yeni nesil ve eğlenceli teknoloji festivalidir. Gelenekselleşmiş, sıkıcı fuar konseptlerini yıkarak teknolojiyi dinamik bir gençlik festivaliyle harmanlar. Ziyaretçiler ve yarışmacılar gündüz saatlerinde otonom robotların finallerini izleyip derin teknoloji (deep-tech) hackathonlarında ter dökerken; akşam saatlerinde konserler, ışık şovları, DJ performansları ve dev ekranlarda oynanan e-spor turnuvalarıyla stres atarlar.' },
        { title: 'Amacı ve Vizyonu', content: 'Festivalin vizyonu, teknolojiyi sadece "ciddi ve laboratuvarlara hapsolmuş" bir disiplin olmaktan çıkarıp, gençlerin sosyal hayatının merkezine, bir "yaşam tarzı" olarak yerleştirmektir. Tech & Chill Fest, inovasyon yapan gençlerin aynı zamanda eğlenmeyi de bilen, çok yönlü ve vizyoner bir Maker toplumu oluşturmasına öncülük etmeyi amaçlar.' },
        { title: 'Hangi Alanları Kapsar?', content: 'Festival alanı iki ana kutba ayrılır: "Tech" bölgesi ve "Chill" bölgesi. Tech alanı; donanım prototiplerinin sergilendiği, Cezeri ve Robonex final maçlarının yapıldığı, 3D yazıcı atölyelerinin ve yatırımcı sunumlarının gerçekleştirildiği inovasyon merkezidir. Chill alanı ise; oyun stüdyolarının (Intechne Gaming Hub), VR/AR deneyim alanlarının, e-spor sahnelerinin, dinlenme alanlarının ve dev konser sahnelerinin yer aldığı sosyal etkileşim merkezidir.' },
        { title: 'Festival Kapsamındaki Etkinlikler Nelerdir?', content: '• Gündüz Kuşağı: Hack The Future Maratonları finalleri, Intechne Girişim Kulübü "Demo Day" sunumları, donanım toplulukları buluşmaları, dron yarışları. \n• Gece Kuşağı: Ulusal sanatçıların canlı konserleri, e-spor şampiyonluk maçları, açık hava sineması, dijital sanat (Mapping) gösterileri.' },
        { title: 'Kimler Katılabilir?', content: 'Lise ve üniversite öğrencilerinden genç profesyonellere, oyun tutkunlarından (Gamer) donanım üreticilerine kadar teknolojiyi ve eğlenceyi bir arada arayan herkes festivalin bir parçası olabilir.' },
        { title: 'Başvuru ve Katılım Süreci', content: 'Festival biletleri ve etkinlik kayıtları resmi web sitesi üzerinden gerçekleştirilir. Hackathon ve robotik yarışmaların finalistleri doğrudan festivalin VIP katılımcıları arasında yer alırken, genel ziyaretçiler belirlenen dönemlerde online biletleme veya kampüs içi davetiyeler aracılığıyla alana giriş sağlar.' },
        { title: 'Sunulan Fırsatlar ve Destekler', content: 'Katılımcılar tek bir biletle/giriş hakkıyla hem sektörün önde gelen teknoloji firmalarıyla ağ kurma (Networking) imkanı bulur hem de sanatsal ve dijital eğlenceye doyarlar. Girişimciler için sahne önü yatırımcı buluşmaları düzenlenirken, yarışma şampiyonlarına ödülleri gece düzenlenen özel sahnelerde binlerce kişinin önünde alkışlarla takdim edilir.' }
      ]
    },
    en: {
      nedir: 'Tech & Chill Fest, the flagship event of the Intechne ecosystem, hosts many activities such as technology hackathons, robotics finals, and innovation workshops during the day, and live music performances and e-sports tournaments in the evening, creating a dynamic meeting point where technology integrates seamlessly with social life.',
      vizyon: 'The vision of the festival is to lift technology from being just a serious, laboratory-bound discipline and place it at the center of youth\'s social life as a lifestyle.',
      kapsam: 'The festival area is divided into two main poles: the "Tech" zone and the "Chill" zone.',
      statusMessage: 'Festival Coming Very Soon!',
      sections: [
        { title: 'What is Tech & Chill Fest?', content: 'Tech & Chill Fest, launched under the motto "produce by day, celebrate by night," is Turkey\'s newest and most entertaining technology festival. It shatters traditional, boring fair concepts by blending technology with a dynamic youth festival. Visitors and competitors watch the finals of autonomous robots and sweat it out in deep-tech hackathons during the day, while relieving stress in the evening with concerts, light shows, DJ performances, and e-sports tournaments played on giant screens.' },
        { title: 'Goal and Vision', content: 'The vision of the festival is to lift technology from being just a serious, laboratory-bound discipline and place it at the center of youth\'s social life as a lifestyle. Tech & Chill Fest aims to lead the creation of a versatile and visionary Maker community of youth who innovate while knowing how to have fun.' },
        { title: 'What Fields Do It Cover?', content: 'The festival area is divided into two main poles: the "Tech" zone and the "Chill" zone. The Tech area is the innovation center where hardware prototypes are exhibited, Cezeri and Robonex final matches are held, 3D printer workshops, and investor pitches are conducted. The Chill area is the social interaction center housing game studios (Intechne Gaming Hub), VR/AR experience zones, e-sports stages, lounge areas, and giant concert stages.' },
        { title: 'What are the Events Within the Scope of the Festival?', content: '• Daytime Program: Hack The Future Marathons finals, Intechne Entrepreneurship Club "Demo Day" presentations, hardware community meetups, drone races. \n• Nighttime Program: Live concerts by national artists, e-sports championship matches, open-air cinema, digital art (mapping) shows.' },
        { title: 'Who Can Participate?', content: 'From high school and university students to young professionals, gaming enthusiasts (gamers) to hardware manufacturers, anyone looking for technology and entertainment together can be a part of the festival.' },
        { title: 'Application and Participation Process', content: 'Festival tickets and event registrations are carried out through the official website. While the finalists of the hackathon and robotics competitions are directly among the VIP participants of the festival, general visitors enter the area via online ticketing or on-campus invitations during designated periods.' },
        { title: 'Opportunities and Supports Offered', content: 'Participants find the opportunity to network with leading technology firms in the industry and enjoy artistic and digital entertainment with a single ticket/entry right. While on-stage investor meetings are organized for entrepreneurs, competition champions receive their awards on special stages set up at night in front of thousands of people under applause.' }
      ]
    }
  },
  'intechne-akademi': {
    icon: BookOpen,
    gallery: [
      '/gallery/Intechne-Akademi-Galeri-Gorselleri/Intechne-Akademi-Galeri-Gorseli-1.JPG',
      '/gallery/Intechne-Akademi-Galeri-Gorselleri/Intechne-Akademi-Galeri-Gorseli-2.JPG',
      '/gallery/Intechne-Akademi-Galeri-Gorselleri/Intechne-Akademi-Galeri-Gorseli-3.JPG'
    ],
    tr: {
      nedir: 'Intechne ekosisteminin uygulamalı eğitim üssü olan Intechne Akademi; inovasyon atölyeleri, donanım ve yazılım eğitimleri, maker kampları ve proje odaklı mentorluk programları gibi birçok faaliyete ev sahipliği yaparak gençlerin teorik bilgilerini sahanın gerçekliğiyle harmanlayan yenilikçi bir öğrenme ortamı sunar.',
      vizyon: 'Temel amaç; çocukları yalnızca teknoloji tüketicisi olmaktan çıkarıp, kendi donanımını üretebilen "Maker" kültürüne sahip yenilikçi bireylere dönüştürmektir.',
      kapsam: 'Akademi müfredatı, teknolojinin en kritik ve uygulamalı alanlarını kapsar. İlkokul seviyesinde algoritmik düşünce, çarklar/dişliler ve blok kodlama ile başlayan süreç; lisede endüstriyel sensör okuma ve otonom drone dinamiklerine uzanır.',
      sections: [
        { title: 'Intechne Akademi Nedir?', content: 'Intechne Akademi, geleceğin mühendislerini ve derin teknoloji kurucularını laboratuvarlardan çıkarıp gerçek dünya projeleriyle buluşturmak amacıyla kurulan "A Plus" bir teknoloji ve girişimcilik okuludur. İlkokuldan liseye kadar uzanan eğitim modeliyle Akademi; geleneksel tahta başı ezberini reddeder. Bunun yerine 3D tasarım, lehimleme, sensör entegrasyonu, uç bilişim (Edge-AI) ve girişimcilik gibi yetkinlikleri, öğrencilerin bizzat dokunarak ve hata yaparak öğrendiği haftalık yoğun Bootcamp (Kamp) formatlarıyla sunar.' },
        { title: 'Intechne Akademi’nin Amacı ve Vizyonu', content: 'Temel amaç; çocukları yalnızca teknoloji tüketicisi olmaktan çıkarıp, kendi donanımını üretebilen "Maker" kültürüne sahip yenilikçi bireylere dönüştürmektir. Intechne Akademi, yetenekleri erken yaşta tespit ederek onlara Start-up disiplini aşılamayı ve milli teknoloji hamlesine donanımlı, kriz yönetebilen, ticari vizyona sahip küresel çapta mühendisler kazandırmayı hedefler.' },
        { title: 'Intechne Akademi Hangi Alanları Kapsar?', content: 'Akademi müfredatı, teknolojinin en kritik ve uygulamalı alanlarını kapsar. İlkokul seviyesinde algoritmik düşünce, çarklar/dişliler ve blok kodlama ile başlayan süreç; ortaokulda gerçek elektronik kartlar, güvenli lehimleme ve şase mukavemeti tasarımıyla devam eder. Lise seviyesinde ise endüstriyel sensör okuma, otonom drone dinamikleri, yapay zeka tabanlı görüntü işleme ve Business Model Canvas (İş Modeli) gibi tamamen sektörün içinden alanları kapsar.' },
        { title: 'Akademi Programları Nelerdir?', content: 'Eğitimler, yaş gruplarının bilişsel ve fiziksel becerilerine göre üç ana programda birleşir:\n• Robocube Kaşifleri (7-10 Yaş): Algoritma mantığı, motorsal beceriler, temel 3D üretim ve bilgisayarsız/blok kodlama üzerine kurulu merak uyandırıcı atölyeler.\n• Arena Mühendisleri (11-14 Yaş): Elektronik lehimleme, mikrodenetleyiciler (Arduino vb.), C/C++ metin kodlama ve Cezeri Robot Ligi simülasyonlarına hazırlık odaklı yoğun teknik eğitimler.\n• Deep-Tech Kurucuları (15-18 Yaş): Raspberry Pi/Jetson kullanımı, Python ile bilgisayarlı görü, drone mekaniği ve laboratuvar projelerini "Pitch Deck" hazırlayarak ticari bir ürüne dönüştürme (Start-up) eğitimleri.' },
        { title: 'Kimler Katılabilir?', content: 'Intechne Akademi, teknolojiye, üretmeye ve donanıma meraklı 7-18 yaş arası tüm öğrencilere açıktır. Bilgi seviyesinden bağımsız olarak, öğrenmeye ve takım çalışmasına yatkın olan her çocuk/genç, kendi yaş grubuna ve yetkinlik seviyesine uygun "Bootcamp" veya uzun dönemli eğitim programlarına dahil olabilir.' },
        { title: 'Başvuru Süreci Nasıl İşler?', content: 'Veliler ve öğrenciler, akademi kayıt takvimini web sitesi ve Instagram hesabı (@intechneakademi) üzerinden takip edebilir. Ön kayıt formunun doldurulmasının ardından, öğrencilerin ilgi alanlarını ve seviyelerini belirlemek amacıyla kısa bir mülakat/oryantasyon süreci gerçekleştirilir. Uygun program belirlendikten sonra aylık/sezonluk atölye kayıtları tamamlanır.' },
        { title: 'Sunulan Fırsatlar ve Destekler', content: 'Intechne Akademi öğrencileri, yalnızca eğitim almakla kalmaz, Intechne’nin devasa etkinlik ekosisteminin doğrudan bir parçası olurlar. Öğrenciler, Cezeri, Robonex ve Drone Cup arenalarına öncelikli katılım hakkı kazanır. Lise grubu öğrencileri "Demo Day" etkinliklerinde geliştirdikleri projeleri profesyonel jürilere sunarak melek yatırımcı ekosistemiyle erken yaşta tanışır. Başarılı mezunlara, Intechne teknoloji liglerinde staj, asistan eğitmenlik fırsatları ve portfolyolarını güçlendirecek proje doğrulama sertifikaları sunulur.' }
      ]
    },
    en: {
      nedir: 'Intechne Academy, the applied training hub of the Intechne ecosystem, offers an innovative learning environment that blends theoretical knowledge with the reality of the field by hosting many activities such as innovation workshops, hardware and software training, maker camps, and project-oriented mentorship programs.',
      vizyon: 'The primary goal is to turn children from just being technology consumers into innovative individuals with a "Maker" culture who can produce their own hardware.',
      kapsam: 'The academy curriculum covers the most critical and applied areas of technology. Starting from algorithmic thinking and block coding in primary school, it extends to industrial sensor reading and autonomous drone dynamics in high school.',
      sections: [
        { title: 'What is Intechne Academy?', content: 'Intechne Academy is an "A Plus" technology and entrepreneurship school established to bring future engineers and deep-tech founders out of labs and meet them with real-world projects. With a curriculum spanning from primary to high school, the Academy rejects traditional chalkboard memorization. Instead, it offers competencies like 3D design, soldering, sensor integration, Edge-AI, and entrepreneurship in weekly intensive Bootcamp formats where students learn by touching and making mistakes.' },
        { title: 'Purpose and Vision of Intechne Academy', content: 'The primary goal is to turn children from just being technology consumers into innovative individuals with a "Maker" culture who can produce their own hardware. Intechne Academy aims to identify talents at an early age, instill a startup discipline, and supply the national technology move with equipped global engineers who can manage crises and have commercial vision.' },
        { title: 'What Fields Does Intechne Academy Cover?', content: 'The academy curriculum covers the most critical and applied areas of technology. The process begins with algorithmic thinking, gears/wheels, and block coding at the primary school level, continuing in middle school with real electronic cards, safe soldering, and chassis durability design. At the high school level, it covers industrial sensor reading, autonomous drone dynamics, computer vision, and business model canvas directly from the industry.' },
        { title: 'What are the Academy Programs?', content: 'Education is combined under three main programs based on the cognitive and physical skills of age groups:\n• Robocube Explorers (Ages 7-10): Curiosity-inducing workshops built on algorithm logic, motor skills, basic 3D production, and computerless/block coding.\n• Arena Engineers (Ages 11-14): Intensive technical training focusing on electronic soldering, microcontrollers (Arduino, etc.), C/C++ text coding, and preparation for Cezeri Robot League simulations.\n• Deep-Tech Founders (Ages 15-18): Training on Raspberry Pi/Jetson usage, computer vision with Python, drone mechanics, and transforming laboratory projects into commercial products (Startups) by preparing a "Pitch Deck".' },
        { title: 'Who Can Participate?', content: 'Intechne Academy is open to all students between the ages of 7-18 who are interested in technology, producing, and hardware. Independent of their prior knowledge level, any child or youth prone to learning and teamwork can be included in Bootcamps or long-term training programs suitable for their age and competence level.' },
        { title: 'How Does the Application Process Work?', content: 'Parents and students can follow the academy registration calendar on the website and Instagram account (@intechneakademi). After filling out the pre-registration form, a short interview/orientation process is conducted to determine the interests and levels of the students. Once the appropriate program is determined, monthly/seasonal workshop registrations are completed.' },
        { title: 'Opportunities and Supports Offered', content: 'Intechne Academy students not only receive training but also become direct parts of Intechne\'s massive event ecosystem. Students gain priority participation rights in Cezeri, Robonex, and Drone Cup arenas. High school students present their developed projects to professional juries during "Demo Day" events and meet the angel investor ecosystem at an early age. Successful graduates are offered internships in Intechne technology leagues, assistant instructor opportunities, and project validation certificates to strengthen their portfolios.' }
      ]
    }
  },
  'drone-cup': {
    icon: Rocket,
    tr: {
      nedir: 'Intechne ekosisteminin gökyüzündeki fütüristik rekabet arenası olan Drone Cup; yüksek hızlı profesyonel drone yarışları, tamamen havada oynanan nefes kesici drone futbolu mücadeleleri, aerodinamik tasarım atölyeleri ve ileri mühendislik etkinlikleri gibi birçok faaliyete ev sahipliği yaparak gençlerdeki havacılık tutkusunu teknolojiyle buluşturun benzersiz bir deneyim sunmaktadır.',
      vizyon: 'Temel amaç; havacılık tutkusunu erken yaşlarda bir inovasyon kıvılcımına dönüştürmek ve Türkiye’yi otonom hava araçları (İHA) alanında küresel liderlerden biri yapacak insan kaynağını yetiştirmektir.',
      kapsam: 'Radyo frekans (RF) sistemleri, fırçasız motor teknolojileri, aerodinamik şase tasarımı, FPV görüntü aktarım sistemleri ve "Drone Futbolu" gibi yeni nesil havacılık sporlarını kapsar.',
      statusMessage: '1.Sezon 2026’da!',
      sections: [
        { title: 'Drone Cup Nedir?', content: 'Drone Cup, geleneksel yer çekimi sınırlarını aşarak otonom ve manuel uçuş teknolojilerini profesyonel bir spora dönüştüren ulusal drone şampiyonasıdır. Hızın ve reflekslerin sınırlarını zorlayan FPV (First Person View) yarışlarından, strateji ve takım çalışması gerektiren yüksek temaslı "Drone Futbolu"na (Drone Soccer) kadar geniş bir yelpazeyi barındırır. Katılımcılar, kendi tasarlayıp lehimledikleri hava araçlarıyla özel olarak tasarlanmış kafesli arenalarda ter dökerler.' },
        { title: 'Amacı ve Vizyonu', content: 'Temel amaç; havacılık tutkusunu erken yaşlarda bir inovasyon kıvılcımına dönüştürmek ve Türkiye’yi otonom hava araçları (İHA) alanında küresel liderlerden biri yapacak insan kaynağını yetiştirmektir. Drone Cup, gençleri hazır drone\'lar kullanmak yerine; aerodinamik hesaplamalar yapmaya, motor-ESC (Hız kontrolcüsü) optimizasyonlarını kurmaya ve havacılık mühendisliğine teşvik eder.' },
        { title: 'Hangi Alanları Kapsar?', content: 'Radyo frekans (RF) sistemleri, fırçasız motor teknolojileri, aerodinamik şase tasarımı, FPV görüntü aktarım sistemleri ve "Drone Futbolu" gibi yeni nesil havacılık sporlarını kapsar. Aynı zamanda etkinlik alanlarında simülasyon uçuşları ve lehimleme atölyelerine ev sahipliği yapar.' },
        { title: 'Yarışmaları Nelerdir?', content: 'Engelli parkurlarda saniyelerle yarışılan FPV Hız Yarışları ve takımların havada asılı kalarak rakiplerini bloklayıp özel çemberlerden (kalelerden) geçmeye çalıştığı, tamamen stratejiye dayalı Drone Futbolu Ligi bu organizasyonun kalbidir.' },
        { title: 'Kimler Katılabilir?', content: 'Havacılık ve drone sistemlerine ilgi duyan ortaokul, lise ve üniversite öğrencileri ile lisanslı/lisanssız profesyonel FPV pilotları, takımlarını kurarak kendi yaş ve klasman gruplarında turnuvaya katılabilirler.' },
        { title: 'Başvuru Süreci Nasıl İşler?', content: 'Drone Cup resmi portalı üzerinden takım ve pilot kayıtları gerçekleştirilir. Güvenlik yönergelerine ve belirlenen donanım kısıtlamalarına (motor gücü, şase boyutu, pervane tipi) uygun olarak hazırlanan teknik şartname onaylarının ardından takımlar fikstüre dahil edilir.' },
        { title: 'Sunulan Fırsatlar ve Destekler', content: 'Katılımcılara yarışma öncesi simülasyon destekleri ve montaj eğitimleri sunulur. Dereceye giren pilotlar, global yarışmalarda (örneğin FAI organizasyonları) Türkiye\'yi temsil etme vizyonu doğrultusunda desteklenir ve sektördeki İHA/SİHA üreticisi şirketlerin yetenek radarına doğrudan dahil olurlar.' }
      ]
    },
    en: {
      nedir: 'Hosting many activities such as high-speed professional drone races, breathtaking drone soccer matches played entirely in the air, aerodynamic design workshops, and advanced engineering events, Drone Cup, the futuristic competition arena of the Intechne ecosystem in the sky, offers a unique experience that combines the passion for aviation in youth with technology.',
      vizyon: 'The primary goal is to turn the passion for aviation into an innovation spark at an early age and to raise the human resource that will make Turkey one of the global leaders in the field of autonomous aerial vehicles (UAVs).',
      kapsam: 'It covers new generation aviation sports such as radio frequency (RF) systems, brushless motor technologies, aerodynamic chassis design, FPV image transmission systems, and "Drone Soccer".',
      statusMessage: 'Season 1 in 2026!',
      sections: [
        { title: 'What is Drone Cup?', content: 'Drone Cup is a national drone championship that transcends traditional gravity boundaries, turning autonomous and manual flight technologies into a professional sport. It spans a wide range from FPV (First Person View) races that push the limits of speed and reflexes, to high-contact "Drone Soccer" that requires strategy and teamwork. Participants sweat it out in specially designed caged arenas with aircraft they design and solder themselves.' },
        { title: 'Purpose and Vision', content: 'The primary goal is to turn the passion for aviation into an innovation spark at an early age and to raise the human resource that will make Turkey one of the global leaders in the field of autonomous aerial vehicles (UAVs). Drone Cup encourages young people to make aerodynamic calculations, set up motor-ESC (speed controller) optimizations, and pursue aerospace engineering rather than using off-the-shelf drones.' },
        { title: 'What Fields Do It Cover?', content: 'It covers new generation aviation sports such as radio frequency (RF) systems, brushless motor technologies, aerodynamic chassis design, FPV image transmission systems, and "Drone Soccer". It also hosts simulation flights and soldering workshops in the event areas.' },
        { title: 'What are Its Competitions?', content: 'FPV Speed Races, where competitors race against seconds on obstacle courses, and the fully strategy-based Drone Soccer League, where teams try to hover, block their opponents, and pass through special rings (goals), are the heart of this organization.' },
        { title: 'Who Can Participate?', content: 'Middle school, high school, and university students interested in aviation and drone systems, as well as licensed/unlicensed professional FPV pilots, can join the tournament in their own age and class groups by forming their teams.' },
        { title: 'How Does the Application Process Work?', content: 'Team and pilot registrations are carried out through the official Drone Cup portal. Teams are included in the fixture after approvals of the technical specifications (motor power, chassis size, propeller type) prepared in accordance with safety guidelines and determined hardware restrictions.' },
        { title: 'Opportunities and Supports Offered', content: 'Participants are offered simulation support and assembly training before the competition. Winning pilots are supported with the vision of representing Turkey in global competitions (such as FAI organizations) and are directly included in the talent radar of UAV/UCAV manufacturer companies in the sector.' }
      ]
    }
  },
  'intechne-girisim-kulubu': {
    icon: Rocket,
    tr: {
      nedir: 'Intechne Girişim Kulübü, teknolojik projelerin ticarileşmesini ve sürdürülebilir iş modellerine dönüşmesini hedefleyen bir kuluçka ve girişimcilik merkezidir.',
      vizyon: 'Gençlerin teknoloji odaklı fikirlerini küresel pazara hitap eden start-up\'lara dönüştürmesini sağlamaktır.',
      kapsam: 'Mentorluk desteği, yatırımcı buluşmaları, iş geliştirme eğitimleri ve girişimcilik zirveli.',
      statusMessage: '1.Dönem Başvuruları Yakında Başlıyor!',
      sections: [
        { title: 'Intechne Girişim Kulübü Nedir?', content: 'Intechne Girişim Kulübü, teknoloji tabanlı fikirleri olan öğrencileri ve genç girişimcileri iş dünyasıyla buluşturan, projelerini ticarileştirilebilir iş modellerine dönüştürmelerine yardım eden bir inkübasyon ekosistemidir. Kulüp bünyesinde girişimcilik eğitimleri, finansal ve hukuki mentorluk destekleri sağlanır.' },
        { title: 'Fikirden Küresel Girişime', content: 'Teknoloji üreten gençlerin en büyük zorluklarından biri olan projenin ticarileşmesi sürecine odaklanan kulüp, yıl boyunca düzenlediği Demo Day etkinlikleri ve yatırımcı buluşmaları ile start-up\'ların tohum yatırımlara ulaşmasını kolaylaştırır.' }
      ]
    },
    en: {
      nedir: 'Intechne Entrepreneurship Club is an incubation and entrepreneurship center that aims to commercialize technological projects and transform them into sustainable business models.',
      vizyon: 'To enable young people to transform their technology-oriented ideas into start-ups that appeal to the global market.',
      kapsam: 'Mentorship support, investor meetups, business development training, and entrepreneurship summits.',
      statusMessage: 'Term 1 Applications Starting Soon!',
      sections: [
        { title: 'What is Intechne Entrepreneurship Club?', content: 'Intechne Entrepreneurship Club is an incubation ecosystem that brings students and young entrepreneurs with technology-based ideas together with the business world, helping them transform their projects into commercializable business models. Entrepreneurship training, financial and legal mentoring support are provided within the club.' },
        { title: 'From Idea to Global Startup', content: 'Focusing on the project commercialization process, one of the biggest challenges for tech-producing youth, the club facilitates startups\' access to seed investments through Demo Day events and investor meetups organized throughout the year.' }
      ]
    }
  },
  'intechne-gaming-hub': {
    icon: Joystick,
    tr: {
      nedir: 'Intechne ekosisteminin dijital dünyadaki interaktif rekabet ve üretim üssü olan Intechne Gaming Hub; strateji odaklı e-spor turnuvaları, oyun geliştirme maratonları (game jams), sanal gerçeklik (VR) atölyeleri ve dijital inovasyon etkinlikleri gibi birçok faaliyete ev sahipliği yaparak gençlerdeki oyun oynama tutkusunu teknoloji tasarlama gücüne dönüştürmeyi amaçlamaktadır.',
      vizyon: 'Hub\'ın vizyonu; Türkiye’yi küresel oyun sektöründe (Gaming Industry) sadece bir pazar değil, aynı zamanda güçlü bir üretici konumuna getirmektir.',
      kapsam: 'Profesyonel e-spor turnuvaları, oyun motoru (Unity/Unreal Engine) eğitimleri, oyun tasarımı (Game Design), karakter animasyonu, sanal/artırılmış gerçeklik (VR/AR) teknolojileri ve oyun sektörü odaklı Start-up girişimciliğini kapsar.',
      statusMessage: '1.Sezon Yakında Başlıyor!',
      sections: [
        { title: 'Intechne Gaming Hub Nedir?', content: 'Intechne Gaming Hub, e-sporun rekabetçi doğasını oyun geliştirmenin (Game Dev) yaratıcı süreciyle tek bir çatı altında birleştiren dijital bir ekosistemdir. Sadece oyun oynayanları değil, oyunun evrenini tasarlayanları, kodlayanları ve dijital sanatçıları bir araya getirir. Büyük e-spor arenalarında finaller düzenlerken, arka planda "Game Jam" etkinlikleriyle Türkiye\'nin yeni nesil oyun stüdyolarının temellerini atar.' },
        { title: 'Amacı ve Vizyonu', content: 'Hub\'ın vizyonu; Türkiye’yi küresel oyun sektöründe (Gaming Industry) sadece bir pazar değil, aynı zamanda güçlü bir üretici konumuna getirmektir. Tüketici profilindeki gençlerin e-spor tutkusunu bir kıvılcım olarak kullanıp, onları yazılım, 3D modelleme ve dijital hikaye anlatıcılığı alanlarına yönlendirmeyi hedefler.' },
        { title: 'Hangi Alanları Kapsar?', content: 'Profesyonel e-spor turnuvaları, oyun motoru (Unity/Unreal Engine) eğitimleri, oyun tasarımı (Game Design), karakter animasyonu, sanal/artırılmış gerçeklik (VR/AR) teknolojileri ve oyun sektörü odaklı Start-up girişimciliğini kapsar. Aynı zamanda oyun stüdyolarına altyapı ve donanım destekleri sunar.' },
        { title: 'Etkinlikleri Nelerdir?', content: 'Lise ve üniversiteler arası ulusal e-spor şampiyonaları, 48 saatlik "Game Jam" (oyun geliştirme) maratonları, oyun sektörü profesyonelleriyle (Publisher/Developer) söyleşiler ve Tech & Chill Fest bünyesindeki dev sahnelerde oynanan gösteri maçları.' },
        { title: 'Kimler Katılabilir?', content: 'Profesyonel ve amatör e-spor oyuncuları, oyun geliştiriciler, yazılımcılar, 3D sanatçılar, ses tasarımcıları ve oyun dünyasına ilgi duyan tüm gençler katılabilir.' },
        { title: 'Başvuru Süreci Nasıl İşler?', content: 'E-spor turnuvaları için takımlar online fikstürlere kayıt olur ve dijital elemelerden geçerek fiziksel finallere ulaşır. Oyun geliştirme etkinlikleri için ise geliştirici veya tasarımcı rolleriyle online platformlar üzerinden başvuru yapılır.' },
        { title: 'Sunulan Fırsatlar ve Destekler', content: 'E-sporculara profesyonel arenada kendilerini kanıtlama ve kupa kazanma şansı verilir. Oyun geliştiriciler için ise başarılı prototipleri yatırımcılara ve yayıncı (Publisher) şirketlere sunma, Intechne çatısı altında oyunlarını ticarileştirme mentörlüğü sağlanır.' }
      ]
    },
    en: {
      nedir: 'Intechne Gaming Hub, the interactive competition and production base of the Intechne ecosystem in the digital world, aims to transform the passion for gaming in youth into the power of technology design by hosting activities such as strategy-oriented e-sports tournaments, game jams, VR workshops, and digital innovation events.',
      vizyon: 'The hub\'s vision is to make Turkey not just a market but a powerful producer in the global gaming industry.',
      kapsam: 'It covers professional e-sports tournaments, game engine (Unity/Unreal Engine) training, game design, character animation, virtual/augmented reality (VR/AR) technologies, and game-centric Startup entrepreneurship.',
      statusMessage: 'Season 1 Starting Soon!',
      sections: [
        { title: 'What is Intechne Gaming Hub?', content: 'Intechne Gaming Hub is a digital ecosystem combining the competitive nature of e-sports with the creative process of game development under a single roof. It brings together game players, universe designers, programmers, and digital artists. While organizing finals in huge e-sports arenas, it lays the foundations of Turkey\'s new generation game studios behind the scenes through Game Jam events.' },
        { title: 'Purpose and Vision', content: 'The hub\'s vision is to make Turkey not just a market but a powerful producer in the global gaming industry. Using the e-sports passion of young consumers as a spark, it aims to direct them to software, 3D modeling, and digital storytelling.' },
        { title: 'What Fields Do It Cover?', content: 'It covers professional e-sports tournaments, game engine (Unity/Unreal Engine) training, game design, character animation, virtual/augmented reality (VR/AR) technologies, and game-centric Startup entrepreneurship. It also offers infrastructure and hardware support to game studios.' },
        { title: 'What are Its Events?', content: 'National e-sports championships between high schools and universities, 48-hour Game Jam (game development) marathons, talks with game industry professionals (Publishers/Developers), and show matches played on giant stages within Tech & Chill Fest.' },
        { title: 'Who Can Participate?', content: 'Professional and amateur e-sports players, game developers, programmers, 3D artists, sound designers, and all youth interested in the gaming world can join.' },
        { title: 'How Does the Application Process Work?', content: 'Teams register for online fixtures for e-sports tournaments and reach physical finals by passing digital eliminations. For game development events, applications are made through online platforms with developer or designer roles.' },
        { title: 'Opportunities and Supports Offered', content: 'E-sports athletes are given the chance to prove themselves in the professional arena and win trophies. For game developers, mentorship for commercializing their games under the Intechne umbrella and presenting successful prototypes to investors and publishers is provided.' }
      ]
    }
  },
  'hack-the-future-marathons': {
    icon: Zap,
    tr: {
      nedir: 'Intechne ekosisteminin sınırları zorlayan vizyoner yazılım ve üretim arenası olan Hack the Future Maratonları; kesintisiz kodlama hackathonları, derin teknoloji (deep-tech) odaklı hızlı prototipleme yarışmaları, yapay zeka geliştirme kampları ve ileri düzey problem çözme etkinlikleri gibi birçok faaliyete ev sahipliği yaparak gençlerin analitik zekasını inovatif projelere dönüştürmeyi amaçlamaktadır.',
      vizyon: 'Temel amaç; geleceğin sorunlarına bugünden teknolojik çözümler üreten yenilikçi bir nesil yetiştirmektir.',
      kapsam: 'Maratonlar; Nesnelerin İnterneti (IoT), akıllı şehirler, siber güvenlik, finansal teknolojiler (FinTech), sağlık teknolojileri, oyunlaştırma ve sürdürülebilirlik odaklı yazılım-donanım entegrasyonu alanlarını kapsar.',
      statusMessage: '1.Sezon Yakında Başlıyor!',
      sections: [
        { title: 'Hack The Future Maratonları Nedir?', content: 'Hack the Future, yazılımcıları, tasarımcıları ve mühendisleri 24 ila 48 saat süren kesintisiz geliştirme kamplarında bir araya getiren "Hızlı Üretim ve İnovasyon" etkinlikleri serisidir. Katılımcılar, kendilerine verilen global veya sektörel bir problemi kısıtlı bir süre içinde çözmek için uykusuz kalarak kod yazar, 3D tasarımlar yapar ve fikirlerini çalışan bir prototipe dönüştürürler. Bu etkinlikler, stres altında takım çalışmasının ve hızlı karar almanın en üst düzeyde test edildiği teknoloji maratonlarıdır.' },
        { title: 'Amacı ve Vizyonu', content: 'Temel amaç; geleceğin sorunlarına bugünden teknolojik çözümler üreten yenilikçi bir nesil yetiştirmektir. Hack the Future, gençleri uzun süren teorik planlamalardan sıyırıp, "Hemen Başla ve Üret" (Lean Start-up) felsefesiyle hızlı prototipleme yapmaya teşvik eder.' },
        { title: 'Hangi Alanları Kapsar?', content: 'Maratonlar; Nesnelerin İnterneti (IoT), akıllı şehirler, siber güvenlik, finansal teknolojiler (FinTech), sağlık teknolojileri, oyunlaştırma ve sürdürülebilirlik odaklı yazılım-donanım entegrasyonu alanlarını kapsar.' },
        { title: 'Etkinlikleri Nelerdir?', content: 'Tema odaklı Hackathonlar, yeni fikirlerin yarıştığı Ideathonlar, Makeathon (Donanım üretim) maratonları ve kodlama kampları (Bootcamps) bu serinin ana etkinlikleridir. Süreç boyunca alanında uzman sektör profesyonelleri takımlara mentorluk yapar.' },
        { title: 'Kimler Katılabilir?', content: 'Yazılım geliştiriciler, UI/UX tasarımcıları, donanım meraklıları, veri bilimciler ve bir fikri koda/donanıma dökmek isteyen lise ve üniversite öğrencileri ile tüm "Maker"lar bireysel veya takım halinde katılabilir.' },
        { title: 'Başvuru Süreci Nasıl İşler?', content: 'İnternet sitesi üzerinden açılan etkinlik temasına göre takımlar kayıt oluşturur. Etkinliğin kapasitesine bağlı olarak katılımcıların GitHub profilleri, portfolyoları veya projeye yaklaşımlarını anlattıkları kısa formlar değerlendirilerek alana kabul sağlanır.' },
        { title: 'Sunulan Fırsatlar ve Destekler', content: 'Maraton süresince katılımcıların tüm donanım, internet, gıda ve dinlenme ihtiyaçları Intechne tarafından karşılanır. Dereceye giren projelere ödül havuzundan destek verilir ve başarılı fikirler doğrudan Intechne Girişim Kulübü inkübasyon merkezine davet edilerek ticarileşme şansı yakalar.' }
      ]
    },
    en: {
      nedir: 'Hack the Future Marathons, the visionary software and production arena of the Intechne ecosystem that pushes boundaries, aims to transform the analytical intelligence of youth into innovative projects by hosting activities such as non-stop coding hackathons, deep-tech rapid prototyping competitions, AI development bootcamps, and advanced problem-solving events.',
      vizyon: 'The primary goal is to raise an innovative generation that produces technological solutions to future problems starting today.',
      kapsam: 'Marathons cover areas of software-hardware integration focused on Internet of Things (IoT), smart cities, cybersecurity, financial technologies (FinTech), health technologies, gamification, and sustainability.',
      statusMessage: 'Season 1 Starting Soon!',
      sections: [
        { title: 'What are Hack the Future Marathons?', content: 'Hack the Future is a series of "Rapid Production and Innovation" events bringing together programmers, designers, and engineers in continuous development camps lasting 24 to 48 hours. Participants stay awake, write code, make 3D designs, and transform their ideas into working prototypes to solve a designated global or industrial problem within a limited time. These events are technology marathons where teamwork under stress and rapid decision-making are tested at the highest level.' },
        { title: 'Goal and Vision', content: 'The primary goal is to raise an innovative generation that produces technological solutions to future problems starting today. Hack the Future strips young people of lengthy theoretical planning and encourages them to do rapid prototyping with a "Start Now and Produce" (Lean Start-up) philosophy.' },
        { title: 'What Fields Do They Cover?', content: 'Marathons cover areas of software-hardware integration focused on Internet of Things (IoT), smart cities, cybersecurity, financial technologies (FinTech), health technologies, gamification, and sustainability.' },
        { title: 'What are Their Events?', content: 'Theme-oriented Hackathons, Ideathons where new ideas compete, Makeathon (hardware production) marathons, and coding Bootcamps are the main events of this series. Throughout the process, industry professionals who are experts in their fields mentor the teams.' },
        { title: 'Who Can Participate?', content: 'Software developers, UI/UX designers, hardware enthusiasts, data scientists, high school and university students who want to turn an idea into code/hardware, and all "Makers" can participate individually or as a team.' },
        { title: 'How Does the Application Process Work?', content: 'Teams register according to the event theme launched on the website. Based on the event\'s capacity, participants are admitted to the area by evaluating their GitHub profiles, portfolios, or short forms explaining their approach to the project.' },
        { title: 'Opportunities and Supports Offered', content: 'During the marathon, all hardware, internet, food, and rest needs of the participants are covered by Intechne. Winning projects are supported from the prize pool, and successful ideas are directly invited to the Intechne Entrepreneurship Club incubation center, gaining a chance of commercialization.' }
      ]
    }
  }
};

export function BrandPageContent({ slug, locale }: BrandPageContentProps) {
  const isEn = locale === 'en';
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const brand = useMemo(() => {
    return brands.find((b) => b.slug === slug);
  }, [slug]);

  const details = useMemo(() => {
    return brandDetails[slug];
  }, [slug]);

  if (!brand || !details) {
    return (
      <div className="py-12 text-center text-slate-500 font-bold">
        {isEn ? 'Brand content not found.' : 'Marka içeriği bulunamadı.'}
      </div>
    );
  }

  const activeDetails = isEn ? details.en : details.tr;
  const accentColor = brand.accentColor || '#15a3b0';
  const BrandIcon = details.icon;

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* 1. Main visual banner placeholder / Logo showcase */}
      <div 
        className="w-full h-[262px] rounded-2xl relative overflow-hidden flex flex-col justify-center items-center text-white px-6 shadow-sm border border-slate-100"
        style={{
          backgroundColor: accentColor
        }}
      >
        {/* Decorative Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10 bg-repeat bg-center" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Crect width='24' height='24' fill='none' stroke='%23808080' stroke-width='1'/%3E%3C/svg%3E")`
          }}
        />
        
        {brand.logoUrl ? (
          <img
            src={brand.logoUrl}
            alt={brand.name}
            className="w-28 h-28 md:w-36 md:h-36 object-contain mb-3 relative z-10 transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <>
            <BrandIcon className="w-16 h-16 mb-4 relative z-10 animate-pulse text-white/90" />
            <span className="text-xs font-semibold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full relative z-10 mb-2">
              {isEn ? 'BRAND VISUAL REPRESENTATION' : 'MARKA TEMSİLİ GÖRSELİ'}
            </span>
          </>
        )}

      </div>

      {/* 2. Dynamic statistics bar / Status message */}
      {((brand.stats && brand.stats.length > 0) || activeDetails.statusMessage) && (
        <div 
          className="rounded-2xl py-6 px-4 md:px-8 text-white shadow-md relative overflow-hidden flex items-center justify-center bg-cover bg-no-repeat bg-center min-h-[92px]"
          style={{
            backgroundColor: accentColor
          }}
        >
          {activeDetails.statusMessage ? (
            <div className="text-center font-black text-lg md:text-2xl tracking-wide uppercase select-none">
              {activeDetails.statusMessage}
            </div>
          ) : (
            /* Inner stats columns */
            <div className="grid grid-cols-3 w-full max-w-4xl mx-auto gap-4 divide-x divide-white/20 text-center">
              {brand.stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center">
                  <span className="text-xs md:text-sm font-semibold uppercase text-white/80 block mb-1">
                    {stat.label || (isEn ? 'LEAGUE YEAR' : 'LİG YILI')}
                  </span>
                  <span className="text-xl md:text-3xl font-black tracking-tight block">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Main introduction and custom brand text sections */}
      <div className="prose prose-slate max-w-none text-slate-600 space-y-8">
        {/* Large lead shortDescription */}
        <p className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed border-l-4 pl-4" style={{ borderLeftColor: accentColor }}>
          {brand.shortDescription}
        </p>

        {/* Dynamic subsections */}
        <div className="space-y-6">
          {activeDetails.sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-lg md:text-xl font-black text-slate-800" style={{ color: accentColor }}>
                {section.title}
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-justify text-slate-600">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. YouTube Embed Video */}
      {details.videoUrl && (
        <div className="space-y-4">
          <h3 className="text-lg md:text-xl font-black text-slate-800" style={{ color: accentColor }}>
            {isEn ? 'Introduction Video' : 'Tanıtım Videosu'}
          </h3>
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-100 shadow-lg">
            <iframe
              src={details.videoUrl}
              title={isEn ? 'Introduction Video' : 'Tanıtım Videosu'}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* 5. Photo Gallery */}
      <div className="space-y-4">
        <h3 className="text-lg md:text-xl font-black text-slate-800" style={{ color: accentColor }}>
          {isEn ? 'Photo Gallery' : 'Fotoğraf Galerisi'}
        </h3>
        
        {/* Gallery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {details.gallery && details.gallery.length > 0 ? (
            details.gallery.map((imgUrl, val) => (
              <div 
                key={val}
                onClick={() => setSelectedImage(imgUrl)}
                className="h-48 rounded-2xl relative overflow-hidden bg-slate-100 border border-slate-200/60 group cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
              >
                <img
                  src={imgUrl}
                  alt={isEn ? `Gallery Image ${val + 1}` : `Galeri Görseli ${val + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-300"></div>
              </div>
            ))
          ) : (
            [1, 2, 3].map((val) => (
              <div 
                key={val}
                className="h-48 rounded-2xl relative overflow-hidden bg-slate-100 border border-slate-200/60 flex items-center justify-center group cursor-default shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-300"></div>
                <ImageIcon className="w-10 h-10 text-slate-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[999] flex items-center justify-center p-4 transition-all duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-slate-300 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors duration-200"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div 
            className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged gallery view"
              className="w-full h-full object-contain max-h-[85vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
