import { Download, Image as ImageIcon, FileText } from 'lucide-react';

export interface CorporateIdentityItem {
  id: string;
  title_tr: string;
  title_en: string;
  type: string;
  file_url: string;
  thumbnail_url?: string;
  order_index?: number;
}

interface BrandAsset {
  title: string;
  titleEn: string;
  type: 'logo' | 'guide';
  downloadUrl: string;
  thumbnailUrl?: string;
}

export function CorporateIdentityGrid({ 
  isEn, 
  initialAssets 
}: { 
  isEn: boolean; 
  initialAssets?: CorporateIdentityItem[]; 
  }) {
  const assets: BrandAsset[] = initialAssets && initialAssets.length > 0
    ? [...initialAssets]
        .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
        .map((item) => ({
          title: item.title_tr,
          titleEn: item.title_en,
          type: item.type as 'logo' | 'guide',
          downloadUrl: item.file_url,
          thumbnailUrl: item.thumbnail_url,
        }))
    : [];

  return (
    <div className="w-full">
      <h2 className="text-3xl font-black text-brand-navy mb-8 text-center md:text-left">
        {isEn ? 'Corporate Identity' : 'Kurumsal Kimlik'}
      </h2>
      
      {assets.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
          <p className="text-slate-500 font-medium">
            {isEn ? 'No corporate identity assets uploaded yet.' : 'Henüz kurumsal kimlik dosyası eklenmedi.'}
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
