import { User, Mail } from 'lucide-react';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface TeamMember {
  name: string;
  role: string;
  roleEn: string;
  linkedin: string;
  email: string;
  image_url?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Ömer Akbulut',
    role: 'Genel Koordinatör',
    roleEn: 'General Coordinator',
    linkedin: 'https://linkedin.com/',
    email: 'mailto:omer.akbulut@intechne.com.tr',
  },
  {
    name: 'Seha Salim',
    role: 'Teknik Koordinatör',
    roleEn: 'Technical Coordinator',
    linkedin: 'https://linkedin.com/',
    email: 'mailto:seha.salim@intechne.com.tr',
  },
];

interface TeamGridProps {
  isEn: boolean;
  initialMembers?: any[];
}

export function TeamGrid({ isEn, initialMembers = [] }: TeamGridProps) {
  const members = initialMembers && initialMembers.length > 0
    ? initialMembers.map((m: any) => ({
        name: m.name,
        role: m.role_tr || m.role,
        roleEn: m.role_en || m.roleEn || m.role,
        linkedin: m.linkedin_url || m.linkedin || '#',
        email: m.email ? (m.email.startsWith('mailto:') ? m.email : `mailto:${m.email}`) : '#',
        image_url: m.image_url,
      }))
    : [];

  return (
    <div className="w-full">
      <h2 className="text-3xl font-black text-brand-navy mb-8">
        {isEn ? 'Our Team' : 'Ekibimiz'}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((member, index) => (
          <div 
            key={index} 
            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group"
          >
            {/* Avatar Image or Placeholder */}
            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center mb-6 overflow-hidden group-hover:scale-105 transition-transform duration-300 ring-4 ring-[#15a3b0]/10">
              {member.image_url ? (
                <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-slate-300" />
              )}
            </div>
            
            <h3 className="text-xl font-bold text-brand-navy mb-2">
              {member.name}
            </h3>
            
            <div className="w-12 h-1 bg-[#15a3b0] rounded-full mb-3" />
            
            <p className="text-slate-600 font-medium mb-6">
              {isEn ? member.roleEn : member.role}
            </p>
            
            <div className="flex items-center gap-3 mt-auto">
              <a 
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#15a3b0] hover:text-white transition-colors duration-300"
                aria-label={`${member.name} LinkedIn`}
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a 
                href={member.email}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#15a3b0] hover:text-white transition-colors duration-300"
                aria-label={`${member.name} Email`}
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
