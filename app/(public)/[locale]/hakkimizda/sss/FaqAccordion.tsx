'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  id: number;
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
}

const faqItems: FaqItem[] = [
  {
    id: 1,
    question: 'Intechne nedir ve ne yapar?',
    questionEn: 'What is Intechne and what does it do?',
    answer: 'Intechne, derin teknoloji çözümleri geliştiren bir Ar-Ge şirketi ile uluslararası robotik ligleri organize eden, yapay zeka destekli otonom hakemlik sistemleri üreten ve genç yetenekleri şirketlerle buluşturan bir teknoloji ekosistemidir.',
    answerEn: 'Intechne is a technology ecosystem that is both an R&D company developing deep tech solutions, and an organization running international robotics leagues, producing AI-supported autonomous refereeing systems, and bridging young talents with companies.',
  },
  {
    id: 2,
    question: 'Cezeri Robot Ligi nedir?',
    questionEn: 'What is Cezeri Robot League?',
    answer: 'Cezeri Robot Ligi, gençlerin mekanik tasarım, otonom yazılım ve strateji becerilerini sergilediği, mühendisliği rekabetçi bir spora dönüştüren Türkiye\'nin en büyük robotik liglerinden biridir.',
    answerEn: 'Cezeri Robot League is one of Turkey\'s largest robotics leagues that turns engineering into a competitive sport, allowing young minds to showcase their mechanical design, autonomous programming, and strategic skills.',
  },
  {
    id: 3,
    question: 'Intechne Akademi nedir ve kimler katılabilir?',
    questionEn: 'What is Intechne Academy and who can join?',
    answer: 'Intechne Akademi, genç yetenekleri gerçek dünya projeleriyle buluşturmak ve sektöre donanımlı mühendisler kazandırmak amacıyla kurulan uygulamalı bir teknoloji okuludur. STEM ve robotik alanlarına ilgi duyan tüm öğrenciler katılabilir.',
    answerEn: 'Intechne Academy is an applied technology school established to connect young talents with real-world projects and supply the sector with well-equipped engineers. All students interested in STEM and robotics are welcome to join.',
  },
  {
    id: 4,
    question: 'Otonom Hakemlik Sistemi nasıl çalışır?',
    questionEn: 'How does the Autonomous Refereeing System work?',
    answer: 'Geliştirdiğimiz yapay zeka destekli otonom hakemlik sistemi, robotik müsabaka sahalarındaki tüm hareketleri yüksek çözünürlüklü kameralar ve sensörler aracılığıyla gerçek zamanlı izler. Bu sayede insan hatasını sıfıra indirerek adil ve hızlı bir oyun yönetimi sağlar.',
    answerEn: 'Our AI-assisted autonomous refereeing system tracks all moves on the robotics competition fields in real-time via high-resolution cameras and sensors, eliminating human error and providing fair, fast game management.',
  },
  {
    id: 5,
    question: 'Intechne ile nasıl iş birliği yapabiliriz?',
    questionEn: 'How can we partner with Intechne?',
    answer: 'Şirketler sponsorluk, yetenek eşleştirme (sahadaki gençlerin verilerini analiz etme) veya ortak Ar-Ge projeleri ile ekosistemimize dahil olabilirler. Bizimle iletişime geçmek için İletişim sayfamızdaki formu doldurabilirsiniz.',
    answerEn: 'Companies can join our ecosystem through sponsorships, talent matching (analyzing the data of competing youth), or collaborative R&D projects. You can fill out the form on our Contact page to get in touch with us.',
  },
  {
    id: 6,
    question: 'Yarışmalara ve etkinliklere katılım ücretli midir?',
    questionEn: 'Is participation in competitions and events paid?',
    answer: 'Lig organizasyonlarımız ve sosyal festivallerimizdeki katılımlar, gençlerin teknolojiye erişimini kolaylaştırmak amacıyla genellikle ücretsizdir veya paydaş kurumların destekleriyle organize edilmektedir.',
    answerEn: 'Access and participation in our leagues and social festivals are generally free or organized with the support of partner institutions to make technology accessible to all young minds.',
  },
];

export function FaqAccordion({ isEn }: { isEn: boolean }) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      {faqItems.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`border rounded-2xl transition-all duration-300 ${
              isOpen 
                ? 'bg-slate-50 border-primary/30 shadow-md shadow-primary/5' 
                : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left font-bold text-base md:text-lg text-brand-navy focus:outline-none transition-colors"
            >
              <div className="flex items-center gap-3">
                <span>{isEn ? item.questionEn : item.question}</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-5 pt-1 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100/50 mt-1">
                {isEn ? item.answerEn : item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
