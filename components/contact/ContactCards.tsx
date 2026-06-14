'use client';

import { Phone, MessageCircle, GraduationCap, Headphones } from 'lucide-react';

export function ContactCards() {
  const cards = [
    {
      title: "Telefon",
      detail: "0534 634 9058",
      href: "tel:05346349058",
      icon: <Phone className="w-6 h-6 text-[#15a3b0]" />
    },
    {
      title: "Şikayet ve Öneriler",
      detail: "kurumsal@intechne.com.tr",
      href: "mailto:kurumsal@intechne.com.tr",
      icon: <MessageCircle className="w-6 h-6 text-[#15a3b0]" />
    },
    {
      title: "İş Birliği ve Sponsorluk",
      detail: "kurumsal@intechne.com.tr",
      href: "mailto:kurumsal@intechne.com.tr",
      icon: <GraduationCap className="w-6 h-6 text-[#15a3b0]" />
    },
    {
      title: "Yarışma Destek",
      detail: "kurumsal@intechne.com.tr",
      href: "mailto:kurumsal@intechne.com.tr",
      icon: <Headphones className="w-6 h-6 text-[#15a3b0]" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
      {cards.map((card, index) => (
        <a
          key={index}
          href={card.href}
          className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group"
        >
          <div className="w-14 h-14 bg-[#15a3b0]/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            {card.icon}
          </div>
          <h4 className="text-slate-800 font-bold text-sm mb-1">{card.title}</h4>
          <p className="text-slate-500 font-medium text-xs break-all">{card.detail}</p>
        </a>
      ))}
    </div>
  );
}
