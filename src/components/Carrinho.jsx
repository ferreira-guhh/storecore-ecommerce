import React from 'react';

const Carrinho = ({ carrinho, finalizarCompra }) => {
  // 1. Cálculo do total de forma simples
  const valorTotal = carrinho.reduce((acc, item) => acc + item.preco, 0);
  
  const formatarPreco = (valor) => 
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Se não tem nada, não mostra a barra
  if (carrinho.length === 0) return null;

  return (
    /* O container principal agora controla a posição no mobile e PC */
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[500px] md:left-auto md:right-8 md:translate-x-0 z-50">
      
      <button
        onClick={finalizarCompra}
        className="w-full bg-[#25D366] text-white px-5 py-3 md:py-4 rounded-full shadow-2xl flex items-center justify-between gap-4 hover:scale-105 transition-transform active:scale-95 group"
      >
        {/* LADO ESQUERDO: Contador e Texto */}
        <div className="flex items-center gap-3">
          <div className="bg-white text-[#25D366] w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm font-black shadow-sm">
            {carrinho.length}
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[10px] uppercase font-bold opacity-80 tracking-wider">Ver Sacola</span>
            <span className="font-bold text-sm md:text-base whitespace-nowrap">Finalizar WhatsApp 🛍️</span>
          </div>
        </div>
        
        {/* LADO DIREITO: Preço Total */}
        <div className="border-l border-white/20 pl-4 text-right">
          <span className="block text-[10px] uppercase font-bold opacity-80 leading-none mb-1">Total</span>
          <span className="font-black text-base md:text-lg">
            {formatarPreco(valorTotal)}
          </span>
        </div>
      </button>
      
    </div>
  );
};

export default Carrinho;