import React from 'react';
import ProdutoCard from './ProdutoCard';

export default function VitrineDestaques({ 
  produtos, 
  adicionarAoCarrinho, 
  favoritos, 
  toggleFavorito, 
  emModoHome, 
  irParaCatalogo 
}) {
  
  // Agora não usamos mais o slice fixo, pois o App.jsx já filtra os destaques
  const listaParaMostrar = produtos;

  return (
    <section id="vitrine-topo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12 scroll-mt-24">
      
      {/* Cabeçalho da Seção */}
      <div className="flex justify-between items-end mb-8 border-b border-stone-200 pb-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            Destaques da Semana ✨
          </h3>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            {emModoHome 
              ? "Produtos selecionados a dedo pela Dona Ana Paula" 
              : `Mostrando ${produtos.length} itens`}
          </p>
        </div>
      </div>

      {/* GRID DE PRODUTOS com animação */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {listaParaMostrar.map((produto, index) => (
    <div 
      key={produto.id} 
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }} // Cada card espera 0.1s a mais que o anterior
    >
      <ProdutoCard 
        produto={produto}
        adicionarAoCarrinho={adicionarAoCarrinho}
        favoritos={favoritos}
        toggleFavorito={toggleFavorito}
      />
    </div>
  ))}
</div>
      
      {/* Botão para navegar até o catálogo completo */}
      {emModoHome && (
        <div className="mt-16 text-center">
          <button 
            onClick={irParaCatalogo}
            className="group relative px-8 py-4 bg-white border-2 border-slate-900 text-slate-900 font-black rounded-2xl hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            Explorar Catálogo Completo 🚀
          </button>
        </div>
      )}

      {/* Aviso caso não tenha nenhum destaque marcado no painel */}
      {produtos.length === 0 && (
        <div className="text-center py-16 text-stone-400 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
          <p className="text-sm font-bold uppercase tracking-widest">Nenhum destaque selecionado no momento</p>
        </div>
      )}

    </section>
  );
}