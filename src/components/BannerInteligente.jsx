import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import IconeDinamico from './IconeDinamico';

const BANNER_PADRAO = {
  titulo: "Bem-vindo ao StoreCore",
  subtitulo: "Encontre as melhores ofertas de papelaria e presentes aqui.",
  imagem: "",
  textoBotao: "Ver Ofertas",
  nomeIcone: "Store",
  corFundo: "#fce7f3",
  corTexto: "#831843",
  corBotao: "#db2777"
};

const obterNomeIconeBanner = (valor) => {
  const nomeIcone = typeof valor === 'string' ? valor.trim() : '';
  return nomeIcone || BANNER_PADRAO.nomeIcone;
};

export default function BannerInteligente({ dados }) {
  
  // VALORES PADRÃO (FALLBACK)
  // Se o banco estiver vazio ou carregando, usa isso para não quebrar o site
  const config = {
    ...BANNER_PADRAO,
    ...dados,
    nomeIcone: obterNomeIconeBanner(dados?.nomeIcone)
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-12">
      <div 
        className="rounded-3xl overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between p-8 md:p-12 transition-all duration-500 relative"
        style={{ backgroundColor: config.corFundo }} // 🎨 COR DE FUNDO DINÂMICA
      >
        
        {/* Lado Esquerdo: Textos Dinâmicos */}
        <div className="md:w-1/2 space-y-6 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm mx-auto md:mx-0">
            <IconeDinamico nomeIcone={config.nomeIcone} cor={config.corTexto} tamanho={20} />
            <span 
              className="uppercase tracking-[0.2em] text-xs font-black opacity-70"
              style={{ color: config.corTexto }} // 🎨 COR DO TEXTO DINÂMICA
            >
              Destaque Especial
            </span>
          </div>
          
          <h2 
            className="text-4xl md:text-6xl font-black leading-tight"
            style={{ color: config.corTexto }} // 🎨 COR DO TÍTULO DINÂMICA
          >
            {config.titulo}
          </h2>
          
          <p 
            className="text-lg md:text-xl opacity-90 max-w-md mx-auto md:mx-0"
            style={{ color: config.corTexto }} // 🎨 COR DO SUBTÍTULO DINÂMICA
          >
            {config.subtitulo}
          </p>
          
          <button 
            className="px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-xl mx-auto md:mx-0 text-white"
            style={{ backgroundColor: config.corBotao }} // 🎨 COR DO BOTÃO DINÂMICA
          >
            {config.textoBotao || "Conferir"}
          </button>
        </div>

        {/* Lado Direito: Imagem Dinâmica */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center md:justify-end w-full z-10">
          <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 rotate-2 hover:rotate-0 transition-transform duration-500 bg-white/10 backdrop-blur-sm">
            
            {config.imagem ? (
              <img 
                src={config.imagem} 
                alt={config.titulo}
                className="w-full h-full object-cover"
              />
            ) : (
              // Se não tiver imagem, mostra um placeholder elegante
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
                <ImageIcon className="w-16 h-16 mb-2 opacity-30" style={{ color: config.corTexto }} />
                <span className="text-xs font-bold opacity-50 uppercase tracking-widest" style={{ color: config.corTexto }}>
                  Sem Imagem Definida
                </span>
              </div>
            )}

          </div>
        </div>

        {/* Efeito Decorativo de Fundo (Círculos sutis) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            
      </div>
    </div>
  );
}
