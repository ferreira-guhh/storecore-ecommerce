import React from 'react';
import { X, Trash2, ShoppingBag, MessageCircle, Info } from 'lucide-react';

export default function SidebarCarrinho({ isOpen, onClose, carrinho, removerDoCarrinho, valorTotal }) {
  if (!isOpen) return null;

  // Função para montar a mensagem e enviar para o WhatsApp
  const finalizarPeloWhatsApp = () => {
    if (carrinho.length === 0) return;

    const numeroLoja = "999999999"; // COLOQUE O NÚMERO DO StoreCore AQUI (DDD + Número)
    
    let texto = "Olá, StoreCore! Vim pelo site e gostaria de conferir a disponibilidade dos seguintes produtos:\n\n";
    
    carrinho.forEach((p, index) => {
      texto += `${index + 1}. *${p.nome}* - R$ ${(p.preco || 0).toFixed(2).replace('.', ',')}\n`;
    });
    
    texto += `\n*Valor Total Aproximado:* R$ ${(valorTotal || 0).toFixed(2).replace('.', ',')}\n\n`;
    texto += "Podem confirmar se tem tudo no estoque?";

    const url = `https://wa.me/${numeroLoja}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Fundo Escuro */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Gaveta Lateral */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        
        {/* Header do Carrinho */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <div className="flex items-center gap-2 text-slate-800">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-lg font-bold">Sua Sacola</h2>
            <span className="bg-stone-100 text-stone-500 text-xs font-bold px-2 py-1 rounded-full">
              {carrinho.length}
            </span>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Produtos */}
        <div className="flex-1 overflow-y-auto p-6">
          {carrinho.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <ShoppingBag className="w-16 h-16 text-stone-300" />
              <div>
                <p className="font-bold text-stone-500">Sua sacola está vazia</p>
                <p className="text-sm text-stone-400">Adicione alguns produtos para enviar seu pedido.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {carrinho.map((produto, index) => (
                <div key={index} className="flex items-center gap-4 bg-stone-50 p-3 rounded-2xl border border-stone-100">
                  <div className="w-16 h-16 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-stone-100">
                    <img src={produto.imagem} alt={produto.nome} className="w-full h-full object-cover" onError={(e) => e.target.style.opacity=0} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-800 line-clamp-2">{produto.nome}</h4>
                    <p className="text-[#8B2C3E] font-bold text-sm mt-1">R$ {(produto.preco || 0).toFixed(2).replace('.', ',')}</p>
                  </div>
                  <button onClick={() => removerDoCarrinho(index)} className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer com o Aviso de UX e Botão do WhatsApp */}
        {carrinho.length > 0 && (
          <div className="p-6 bg-white border-t border-stone-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            
            {/* 💡 CAIXA DE AVISO ATUALIZADA */}
            <div className="mb-5 bg-blue-50 border border-blue-50  rounded-xl p-4 flex gap-3 text-blue-800 items-start">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed flex flex-col gap-2">
                <p>
                  <strong>Como funciona?</strong> Este site é nossa vitrine virtual para você montar seu pedido. 
                  Enviaremos sua lista para o nosso <strong>WhatsApp</strong> para confirmarmos o estoque e combinarmos a entrega/pagamento!
                </p>
                <p className="text-blue-600 font-bold bg-blue-50  p-2 rounded-lg border border-blue-50 mt-1"> 
                  📸 Atenção: As imagens do site são meramente ilustrativas para facilitar a identificação. O produto físico pode ter pequenas variações de marca ou cor.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-stone-500 font-medium">Total estimado</span>
              <span className="text-2xl font-black text-slate-800">R$ {(valorTotal || 0).toFixed(2).replace('.', ',')}</span>
            </div>

            <button 
              onClick={finalizarPeloWhatsApp}
              className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
            >
              <MessageCircle className="w-5 h-5" />
              Confirmar no WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
