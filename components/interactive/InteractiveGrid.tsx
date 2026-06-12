'use client';

import { useState } from 'react';
import { ArrowRight, BookOpen, MonitorPlay, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface InteractiveItem {
  id: number;
  title: string;
  titleEn: string;
  category: string;
  categoryEn: string;
  description: string;
  descriptionEn: string;
  type: 'report' | 'video' | 'interactive';
  imageUrl?: string;
}

const categories = [
  { id: 'all', label: 'Tümü', labelEn: 'All' },
  { id: 'projeler', label: 'Projeler', labelEn: 'Projects' },
  { id: 'raporlar', label: 'Raporlar', labelEn: 'Reports' },
  { id: 'egitimler', label: 'Eğitimler', labelEn: 'Trainings' },
];

const mockItems: InteractiveItem[] = [
  {
    id: 1,
    title: 'Geleceğin Teknolojileri Raporu 2026',
    titleEn: 'Future Technologies Report 2026',
    category: 'raporlar',
    categoryEn: 'Reports',
    description: 'Intechne vizyonuyla hazırlanan teknoloji ekosistemi ve gelecek öngörülerini içeren kapsamlı analiz raporu.',
    descriptionEn: 'Comprehensive analysis report containing technology ecosystem and future predictions prepared with Intechne vision.',
    type: 'report',
  },
  {
    id: 2,
    title: 'Intechne Akademi Sanal Tur',
    titleEn: 'Intechne Academy Virtual Tour',
    category: 'interaktif',
    categoryEn: 'Interactive',
    description: 'Eğitim kampüsümüzü 360 derece sanal tur ile keşfedin, atölyelerimizde dijital bir gezintiye çıkın.',
    descriptionEn: 'Discover our training campus with a 360-degree virtual tour, take a digital stroll in our workshops.',
    type: 'interactive',
  },
  {
    id: 3,
    title: 'Otonom Sistemler Eğitim Serisi',
    titleEn: 'Autonomous Systems Training Series',
    category: 'egitimler',
    categoryEn: 'Trainings',
    description: 'Temel ve ileri seviye otonom sistemler video eğitim serisi ve interaktif simülasyon araçları.',
    descriptionEn: 'Basic and advanced autonomous systems video training series and interactive simulation tools.',
    type: 'video',
  },
  {
    id: 4,
    title: 'Hack The Future 2025 Analizi',
    titleEn: 'Hack The Future 2025 Analysis',
    category: 'projeler',
    categoryEn: 'Projects',
    description: 'Geçtiğimiz yılın en çarpıcı projeleri ve geliştirilen yenilikçi çözümlerin teknik incelemeleri.',
    descriptionEn: 'Technical reviews of the most striking projects of the past year and the innovative solutions developed.',
    type: 'report',
  },
];

export function InteractiveGrid({ isEn }: { isEn: boolean }) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredItems = mockItems.filter(
    (item) => activeTab === 'all' || item.category === activeTab
  );

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      {/* Hero Section */}
      <div className="bg-[#15a3b0] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              {isEn ? 'Intechne Interactive' : 'Intechne İnteraktif'}
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
              {isEn
                ? 'Access educational, entertaining, and informative interactive content regarding our projects ranging from robotics to digital technologies.'
                : 'Robotikten dijital teknolojilere kadar birçok alandaki projelerimize dair eğitici, eğlendirici ve bilgilendirici interaktif içeriklerimize buradan ulaşabilirsiniz.'}
            </p>
          </div>
          <div className="flex-1 w-full flex justify-center md:justify-end">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl max-w-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-orange-400" />
              <p className="italic text-lg font-medium leading-relaxed mb-4">
                {isEn
                  ? '"Technology is only meaningful when shared and developed with the community. Let\'s build the future together."'
                  : '"Teknoloji ancak toplumla paylaşıldıkça ve birlikte geliştikçe anlam kazanır. Geleceği hep birlikte inşa edelim."'}
              </p>
              <strong className="block text-white font-bold">Ömer Akbulut</strong>
              <span className="text-sm text-white/80">{isEn ? 'General Coordinator' : 'Genel Koordinatör'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-slate-200 pb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                activeTab === category.id
                  ? 'bg-[#15a3b0] text-white shadow-md scale-105'
                  : 'text-slate-500 hover:text-[#15a3b0] hover:bg-[#15a3b0]/10'
              }`}
            >
              {isEn ? category.labelEn : category.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
            >
              <div className="h-48 md:h-64 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                {/* Fallback pattern background */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#15a3b0_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {item.type === 'report' && <FileText className="w-20 h-20 text-[#15a3b0]/40 group-hover:scale-110 transition-transform duration-500" />}
                {item.type === 'video' && <MonitorPlay className="w-20 h-20 text-[#15a3b0]/40 group-hover:scale-110 transition-transform duration-500" />}
                {item.type === 'interactive' && <BookOpen className="w-20 h-20 text-[#15a3b0]/40 group-hover:scale-110 transition-transform duration-500" />}
                
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#15a3b0] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                  {isEn ? item.categoryEn : item.category}
                </span>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-brand-navy mb-4 group-hover:text-[#15a3b0] transition-colors">
                  {isEn ? item.titleEn : item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-8 flex-1">
                  {isEn ? item.descriptionEn : item.description}
                </p>
                
                <div className="flex items-center text-[#15a3b0] font-bold mt-auto group/btn">
                  <span>{isEn ? 'Review' : 'İncele'}</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Placeholder */}
        <div className="flex items-center justify-center gap-2">
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#15a3b0] hover:bg-[#15a3b0]/10 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#15a3b0] text-white font-bold shadow-md">
            1
          </button>
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 font-bold hover:bg-slate-100 transition-colors">
            2
          </button>
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#15a3b0] hover:bg-[#15a3b0]/10 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
