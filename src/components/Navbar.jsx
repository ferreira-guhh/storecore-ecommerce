import React from 'react';
import { ShoppingBag, Search, MessageCircle } from 'lucide-react';
import { Menu, Heart } from 'lucide-react';

export default function Navbar({ carrinho, aoClicarNoCarrinho, aoClicarNaBusca, favoritos, aoClicarNosFavoritos }) {
  
  const abrirZap = () => {
    window.open("https://wa.me/5517981011042", "_blank");
  };

  return (
    // Alterado para bg-[#8B2C3E] (mesma cor do footer/vinho da loja)
    <nav className="bg-stone-900 border-b border-white/10 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          
          
          {/* --- LOGO DA LOJA --- */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-stone-700 p-1.5 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-[#e2e8f0]" />
            </div>
            <div className="flex flex-col -space-y-1">
              {/* Fonte 'Great Vibes' em Branco para destacar no fundo vinho */}
              <h1 className="text-3xl text-white" style={{ fontFamily: "'Great Vibes', cursive" }}>
                StoreCore
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold pl-1">
                Desde 2026
              </p>
            </div>
          </div>
          
          {/* --- BARRA DE PESQUISA --- */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
            <div 
              onClick={aoClicarNaBusca}
              className="w-full cursor-text bg-white/10 border border-white/20 rounded-full py-2.5 pl-10 pr-4 text-sm text-white/80 hover:bg-white/20 transition-all shadow-sm flex items-center"
            >
              <span className="opacity-70">O que você procura hoje?</span>
            </div>
            <Search className="absolute left-3 top-2.5 text-white/60 w-5 h-5 group-hover:text-white transition-colors" />
          </div>

          {/* --- BOTÕES LATERAIS --- */}
          <div className="flex items-center gap-4">
            
            {/* Botão do WhatsApp */}
            <button 
              onClick={abrirZap}
              className="hidden md:flex items-center gap-2 text-white hover:text-[#25D366] font-medium text-sm transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="hidden lg:inline">Atendimento</span>
            </button>

            {/* Ícone do Carrinho - Agora abre a Sidebar */}
            <div 
              onClick={aoClicarNoCarrinho} // <--- Conectado para abrir a sacola
              className="relative p-2 text-white hover:scale-110 cursor-pointer transition-transform"
            >
              <ShoppingBag className="w-6 h-6" />
              {carrinho.length > 0 && (
                <span className="absolute top-0 right-0 bg-white text-[#ff0000] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce shadow-lg">
                  {carrinho.length}
                </span>
              )}
            </div>
              {/* BOTÃO DE FAVORITOS DENTRO DA NAVBAR */}
<button 
  onClick={aoClicarNosFavoritos}
  className="relative p-2 text-white hover:text-red-500 transition-colors"
  title="Meus Favoritos"
>
  <Heart className="w-6 h-6" />
  {favoritos?.length > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
      {favoritos.length}
    </span>
  )}
</button>
          </div>

        </div>
      </div>
    </nav>
  );
}