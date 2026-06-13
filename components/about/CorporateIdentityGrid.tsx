import { Download, Image as ImageIcon, FileText } from 'lucide-react';

export interface CorporateIdentityItem {
  id: string;
  title_tr: string;
  title_en: string;
  type: string;
  file_url: string;
  thumbnail_url?: string;
}

interface BrandAsset {
  title: string;
  titleEn: string;
  type: 'logo' | 'guide';
  downloadUrl: string;
  thumbnailUrl?: string;
}

const staticAssets: BrandAsset[] = [
  {
    title: 'Intechne Logo',
    titleEn: 'Intechne Logo',
    type: 'logo',
    downloadUrl: 'https://cdnv2.t3vakfi.org/media/uploaded/tKaytpNNCgZDfg5AfqjShfrLQbSh6juk.jpg',
  },
  {
    title: 'Intechne Kurumsal Kimlik',
    titleEn: 'Intechne Corporate Identity',
    type: 'guide',
    downloadUrl: 'https://cdnv2.t3vakfi.org/media/uploaded/tKaytpNNCgZDfg5AfqjShfrLQbSh6juk.jpg',
  },
  {
    title: 'Cezeri Robot Ligi Logo',
    titleEn: 'Cezeri Robot League Logo',
    type: 'logo',
    downloadUrl: 'https://cdnv2.t3vakfi.org/media/uploaded/tKaytpNNCgZDfg5AfqjShfrLQbSh6juk.jpg',
  },
  {
    title: 'Robonex Robot Ligi Logo',
    titleEn: 'Robonex Robot League Logo',
    type: 'logo',
    downloadUrl: 'https://cdnv2.t3vakfi.org/media/uploaded/tKaytpNNCgZDfg5AfqjShfrLQbSh6juk.jpg',
  },
  {
    title: 'Tech & Chill Fest Logo',
    titleEn: 'Tech & Chill Fest Logo',
    type: 'logo',
    downloadUrl: 'https://cdnv2.t3vakfi.org/media/uploaded/tKaytpNNCgZDfg5AfqjShfrLQbSh6juk.jpg',
  },
  {
    title: 'Intechne Akademi Logo',
    titleEn: 'Intechne Academy Logo',
    type: 'logo',
    downloadUrl: 'https://cdnv2.t3vakfi.org/media/uploaded/tKaytpNNCgZDfg5AfqjShfrLQbSh6juk.jpg',
  },
];

export function CorporateIdentityGrid({ 
  isEn, 
  initialAssets 
}: { 
  isEn: boolean; 
  initialAssets?: CorporateIdentityItem[]; 
}) {
  const assets: BrandAsset[] = initialAssets && initialAssets.length > 0
    ? initialAssets.map((item) => ({
        title: item.title_tr,
        titleEn: item.title_en,
        type: item.type as 'logo' | 'guide',
        downloadUrl: item.file_url,
        thumbnailUrl: item.thumbnail_url,
      }))
    : staticAssets;

  return (
    <div className="w-full">
      <h2 className="text-3xl font-black text-brand-navy mb-8 text-center md:text-left">
        {isEn ? 'Corporate Identity' : 'Kurumsal Kimlik'}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset, index) => (
          <div 
            key={index}
            className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
          >
            {/* Image/File Preview */}
            <div className="w-full h-48 bg-slate-50 border-b border-slate-100 flex items-center justify-center group-hover:bg-slate-100 transition-colors duration-300 relative">
              {asset.thumbnailUrl ? (
                <img 
                  src={asset.thumbnailUrl} 
                  alt={isEn ? asset.titleEn : asset.title} 
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" 
                />
              ) : asset.type === 'logo' && asset.downloadUrl && asset.downloadUrl !== '#' ? (
                <img 
                  src={asset.downloadUrl} 
                  alt={isEn ? asset.titleEn : asset.title} 
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" 
                />
              ) : asset.type === 'logo' ? (
                <ImageIcon className="w-16 h-16 text-slate-300 group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <FileText className="w-16 h-16 text-slate-300 group-hover:scale-110 transition-transform duration-300" />
              )}
            </div>
            
            {/* Content Area */}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-bold text-lg text-brand-navy mb-6 text-center leading-snug">
                {isEn ? asset.titleEn : asset.title}
              </h3>
              
              {/* Download Button */}
              <a 
                href={asset.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-auto flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-white bg-[#15a3b0] hover:bg-[#128a95] transition-colors"
              >
                <Download className="w-5 h-5" />
                {isEn ? 'Download' : 'İndir'}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
