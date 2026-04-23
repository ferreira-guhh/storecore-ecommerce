import React from 'react';
import { BookOpen, Scissors, Gamepad2, Home, Smartphone, Gift, Layers } from 'lucide-react';

export default function Departamentos({ categoriaAtiva, setCategoriaAtiva }) {
  
  const categorias = [
    { id: 0, nome: 'Todas', tag: 'Todas', icone: Layers, corBg: 'bg-stone-200', corIcone: 'text-stone-700' },
    { id: 1, nome: 'Papelaria', tag: 'Papelaria', icone: BookOpen, corBg: 'bg-blue-100', corIcone: 'text-blue-600' },
    { id: 2, nome: 'Armarinho', tag: 'Armarinho', icone: Scissors, corBg: 'bg-rose-100', corIcone: 'text-rose-600' },
    { id: 3, nome: 'Brinquedos', tag: 'Brinquedos', icone: Gamepad2, corBg: 'bg-emerald-100', corIcone: 'text-emerald-600' },
    { id: 4, nome: 'Casa', tag: 'Casa', icone: Home, corBg: 'bg-purple-100', corIcone: 'text-purple-600' },
    { id: 5, nome: 'Eletrônicos', tag: 'Eletronicos', icone: Smartphone, corBg: 'bg-amber-100', corIcone: 'text-amber-600' },
    { id: 6, nome: 'Presentes', tag: 'Presentes', icone: Gift, corBg: 'bg-pink-100', corIcone: 'text-pink-600' },
  ];

  // FUNÇÃO NOVA: Clica e Rola Suavemente
  const lidarComClique = (tag) => {
    setCategoriaAtiva(tag); // 1. Muda o filtro
    
    // 2. Busca a vitrine e rola até ela
    const vitrine = document.getElementById('vitrine-topo');
    if (vitrine) {
      vitrine.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-8">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Explore por Categorias
          </h3>
          <p className="text-slate-500 mt-1 text-sm">Tudo o que você precisa em um só lugar</p>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categorias.map((cat) => {
          const IconeTag = cat.icone;
          const isAtivo = categoriaAtiva === cat.tag;
          
          return (
            <div 
              key={cat.id} 
              onClick={() => lidarComClique(cat.tag)} // USANDO A FUNÇÃO NOVA
              className={`group flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isAtivo ? 'opacity-100 scale-105' : 'opacity-70 hover:opacity-100'}`}
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 ${cat.corBg} rounded-full flex items-center justify-center mb-3 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-md border ${isAtivo ? 'border-slate-800 border-2' : 'border-white/50'}`}>
                <IconeTag className={`w-6 h-6 md:w-8 md:h-8 ${cat.corIcone}`} strokeWidth={1.5} />
              </div>
              
              <span className={`font-medium text-sm md:text-base text-center transition-colors ${isAtivo ? 'text-slate-900 font-bold' : 'text-slate-600 group-hover:text-[#8B2C3E]'}`}>
                {cat.nome}
              </span>
            </div>
          );
        })}
      </div>
      
    </section>
  );
}