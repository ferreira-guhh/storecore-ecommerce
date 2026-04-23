import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingBag, Heart, X, ZoomIn, Check, Image as ImageIcon } from 'lucide-react';

export default function ProdutoCard({ produto, adicionarAoCarrinho, favoritos, toggleFavorito }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [quantidade, setQuantidade] = useState(1);
  const [foiAdicionado, setFoiAdicionado] = useState(false); 
  const [imgErro, setImgErro] = useState(false); // 💡 NOVO: Controla se a imagem deu erro
  
  const isFavorito = favoritos?.some(fav => fav.id === produto.id);
  const temPrecoPromocional = produto.precoPromocional != null && produto.precoPromocional !== '';
  const temPrecoPadrao = produto.preco != null && produto.preco !== '';
  const semPreco = !temPrecoPromocional && !temPrecoPadrao;

  const handleAdicionar = (e) => {
    e.stopPropagation(); 
    
    const precoFinal = produto.precoPromocional ? produto.precoPromocional : (produto.preco || 0);
    
    const produtoComQuantidade = { 
      ...produto, 
      preco: precoFinal, 
      precoOriginal: produto.preco || 0,
      quantidade: quantidade 
    };
    
    adicionarAoCarrinho(produtoComQuantidade);
    
    setFoiAdicionado(true);
    setTimeout(() => {
      setFoiAdicionado(false);
      setQuantidade(1); 
    }, 2000);
  };

  const modalGiga = modalAberto ? createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setModalAberto(false)}></div>

      <div className="bg-white w-[90vw] max-w-[900px] min-h-[400px] max-h-[90vh] rounded-3xl shadow-2xl flex flex-col md:flex-row relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        <button onClick={() => setModalAberto(false)} className="absolute top-4 right-4 z-50 p-2 bg-white/90 backdrop-blur text-stone-500 hover:text-red-500 hover:bg-red-50 rounded-full shadow-md transition-colors">
          <X className="w-6 h-6" />
        </button>

        {/* Lado Esquerdo: FOTO DO MODAL */}
        <div className="w-full md:w-1/2 bg-stone-50 flex flex-col items-center justify-center p-8 relative min-h-[250px] md:min-h-[400px]">
          
          {temPrecoPromocional && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black uppercase px-3 py-1 rounded-lg shadow-md z-10">
              Oferta 🔥
            </div>
          )}

          {/* 💡 CORREÇÃO AQUI: Se tem imagem e não deu erro, tenta mostrar. Se não, mostra o Fallback */}
          {produto.imagem && produto.imagem.trim() !== '' && !imgErro ? (
            <img 
              src={produto.imagem} 
              alt={produto.nome} 
              className="w-full h-full object-contain mix-blend-multiply" 
              onError={() => setImgErro(true)} // Se a imagem quebrar, ativa o erro!
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-50/50 p-6 text-center rounded-2xl border-2 border-dashed border-stone-200">
              <ImageIcon className="w-16 h-16 text-stone-200 mb-4" />
              <h3 className="text-sm font-black text-stone-400 uppercase tracking-widest mb-1">Imagem em Atualização</h3>
              <p className="text-xs text-stone-400 max-w-[200px]">Este produto está disponível na loja, mas nossa equipe ainda está fotografando este item.</p>
            </div>
          )}
          
          <div className="absolute bottom-3 left-0 w-full text-center px-4">
            <span className="text-[10px] text-stone-400 bg-stone-50/80 backdrop-blur-sm px-2 py-1 rounded">
              * Imagens meramente ilustrativas. O produto físico pode apresentar variações.
            </span>
          </div>
        </div>

        {/* Lado Direito: DETALHES NO MODAL */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col bg-white overflow-y-auto">
          <div className="mt-auto mb-auto py-4">
            <span className="inline-block px-3 py-1 bg-stone-100 text-stone-500 text-xs font-bold uppercase tracking-widest rounded-full w-max mb-4">{produto.subcategoria ? produto.subcategoria : produto.categoria}</span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">{produto.nome}</h2>
            
            {/* 💡 CORREÇÃO AQUI: String(produto.id) para evitar a tela branca */}
            <p className="text-stone-400 text-xs font-mono mt-2">Cód: {String(produto.id).substring(0, 8).toUpperCase()}</p>

            <div className="mt-6 mb-8">
              <span className="text-sm font-bold text-stone-400 uppercase">Preço</span>
              
              {produto.preco ? (
                produto.precoPromocional ? (
                  <div className="flex flex-col mt-1">
                    <span className="text-lg text-stone-400 line-through font-medium">De: R$ {(produto.preco || 0).toFixed(2).replace('.', ',')}</span>
                    <span className="font-black text-[#25D366] text-4xl md:text-5xl">
                      <span className="text-2xl mr-1">R$</span>{(produto.precoPromocional || 0).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ) : (
                  <p className="text-4xl md:text-5xl font-black text-[#8B2C3E] mt-1">
                    <span className="text-2xl mr-1">R$</span>{(produto.preco || 0).toFixed(2).replace('.', ',')}
                  </p>
                )
              ) : (
                <p className="text-3xl md:text-4xl font-black text-stone-500 mt-1">
                  Sob Consulta
                </p>
              )}
            </div>

            <button 
              onClick={() => {
                handleAdicionar({ stopPropagation: () => {} });
                setModalAberto(false);
              }}
              className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#20bd5a] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/30"
            >
              <ShoppingBag className="w-6 h-6" /> Adicionar à Sacola
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 group flex flex-col h-full relative">
        
        {/* FOTO E CORAÇÃO DA VITRINE */}
        <div className="relative aspect-square rounded-xl bg-stone-50 overflow-hidden mb-3 cursor-pointer" onClick={() => setModalAberto(true)}>
          
          {temPrecoPromocional && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-md z-10">
              Oferta 🔥
            </div>
          )}

          {/* 💡 CORREÇÃO AQUI: Verifica se a imagem é válida. Se quebrar, ativa imgErro */}
          {produto.imagem && produto.imagem.trim() !== '' && !imgErro ? (
            <img 
              src={produto.imagem} 
              alt={produto.nome} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              onError={() => setImgErro(true)} // Mágica aqui!
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100/50 p-4 text-center">
              <ImageIcon className="w-8 h-8 text-stone-300 mb-2" />
              <span className="text-[10px] font-bold text-stone-400 uppercase leading-tight">Foto em<br/>Atualização</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <ZoomIn className="text-white w-8 h-8 drop-shadow-md" />
          </div>
          <button onClick={(e) => { e.stopPropagation(); toggleFavorito(produto); }} className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white text-stone-400 hover:text-red-500 transition-colors shadow-sm z-10">
            <Heart className={`w-4 h-4 ${isFavorito ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* TEXTOS DA VITRINE */}
        <div className="flex-1 flex flex-col">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{produto.subcategoria ? produto.subcategoria : produto.categoria}</span>
          <h3 className="font-bold text-slate-800 text-sm leading-tight mb-2 line-clamp-2 cursor-pointer hover:text-[#8B2C3E]" onClick={() => setModalAberto(true)}>
            {produto.nome}
          </h3>
          
          <div className="mb-3">
            {produto.preco ? (
              produto.precoPromocional ? (
                <div className="flex flex-col">
                  <span className="text-[10px] text-stone-400 line-through font-medium">De: R$ {(produto.preco || 0).toFixed(2).replace('.', ',')}</span>
                  <span className="font-black text-[#25D366] text-lg">R$ {(produto.precoPromocional || 0).toFixed(2).replace('.', ',')}</span>
                </div>
              ) : (
                <span className="font-black text-[#8B2C3E] text-lg">R$ {(produto.preco || 0).toFixed(2).replace('.', ',')}</span>
              )
            ) : (
              <span className="font-black text-stone-500 text-lg">Sob Consulta</span>
            )}
          </div>
          
          <div className="mt-auto flex flex-col gap-2">
            <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-xl p-1">
              <button onClick={(e) => { e.stopPropagation(); setQuantidade(Math.max(1, quantidade - 1)); }} className="w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-white hover:text-slate-800 rounded-lg transition-colors">-</button>
              <span className="font-bold text-sm text-slate-700">{quantidade}</span>
              <button onClick={(e) => { e.stopPropagation(); setQuantidade(quantidade + 1); }} className="w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-white hover:text-slate-800 rounded-lg transition-colors">+</button>
            </div>
            
            <button 
              onClick={handleAdicionar}
              disabled={foiAdicionado}
              className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${foiAdicionado ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-[#8B2C3E]'}`}
            >
              {foiAdicionado ? <><Check className="w-4 h-4" /> Adicionado</> : 'Adicionar'}
            </button>
          </div>

        </div>
      </div>
      {modalGiga}
    </>
  );
}
