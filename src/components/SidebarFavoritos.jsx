import React from 'react';
import { X, Trash2, ShoppingBag, Heart } from 'lucide-react';

export default function SidebarFavoritos({ isOpen, onClose, favoritos, toggleFavorito, adicionarAoCarrinho }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <div className="flex items-center gap-2 text-slate-800">
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            <h2 className="text-lg font-bold">Meus Favoritos</h2>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
              {favoritos.length}
            </span>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Favoritos */}
        <div className="flex-1 overflow-y-auto p-6">
          {favoritos.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <Heart className="w-16 h-16 text-stone-300" />
              <div>
                <p className="font-bold text-stone-500">Nenhum favorito ainda</p>
                <p className="text-sm text-stone-400">Clique no coração dos produtos para salvá-los aqui.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {favoritos.map((produto) => (
                <div key={produto.id} className="flex flex-col gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-stone-100">
                      <img src={produto.imagem} alt={produto.nome} className="w-full h-full object-cover" onError={(e) => e.target.style.opacity=0} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-800 line-clamp-2">{produto.nome}</h4>
                      <p className="text-[#8B2C3E] font-bold text-sm mt-1">R$ {(produto.preco || 0).toFixed(2).replace('.', ',')}</p>
                    </div>
                    <button 
                      onClick={() => toggleFavorito(produto)} 
                      className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover dos favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Botão de jogar pro Carrinho */}
                  <button 
                    onClick={() => {
                      adicionarAoCarrinho(produto);
                      toggleFavorito(produto); // Remove dos favoritos depois que joga no carrinho (opcional)
                    }}
                    className="w-full bg-slate-900 text-white py-2 rounded-xl text-sm font-bold hover:bg-[#8B2C3E] transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Adicionar à Sacola
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
