import React from 'react';
import { MapPin, Phone, Clock, Instagram, Facebook, ShoppingBag, Lock } from 'lucide-react';

export default function Footer({ irParaLogin }) {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8 border-t-4 border-[#8B2C3E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid Principal do Rodapé */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Coluna 1: Sobre a Loja */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#8B2C3E] p-2 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col text-white">
                <h2 className="text-xl font-bold tracking-wide" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
                  StoreCore
                </h2>
                <p className="text-[9px] uppercase tracking-widest text-stone-400 font-semibold">
                  Tradição desde 2026
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-stone-400 mt-2">
              Sua loja completa. Papelaria, brinquedos, presentes e utilidades com a qualidade e o atendimento que você já conhece e confia.
            </p>
            {/* Redes Sociais */}
            <div className="flex gap-4 mt-4">
              <a href="" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-[#8B2C3E] hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-[#8B2C3E] hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Coluna 2: Links Rápidos (ATUALIZADO COM SEU ESTOQUE REAL) */}
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Departamentos</h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li><a href="#" className="hover:text-white transition-colors">Papelaria & Escola</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Armarinho & Artesanato</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Brinquedos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Casa & Utilidades</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Eletrônicos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Presentes</a></li>
            </ul>
          </div>

          {/* Coluna 3: Contato e Endereço */}
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Atendimento</h3>
            <ul className="space-y-4 text-sm text-stone-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#8B2C3E] shrink-0" />
                <span>123 Main St, Anytown, CA 12345, USA</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#8B2C3E] shrink-0" />
                {/* Se quiser mudar o número depois, é só editar aqui */}
                <span>+55 (99) 99999-9999</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#8B2C3E] shrink-0" />
                <span>
                  Segunda a Sexta: 08h às 18h<br />
                  Sábados: 08h às 12h
                </span>
              </li>
            </ul>
          </div>
        </div>

          {/* LINHA 100% LARGURA */}
<div className="w-full border-t border-stone-200 mt-12 pt-8">
  
  {/* CONTEÚDO CENTRALIZADO */}
  <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-2 text-center px-4">
    
    <p className="text-[10px] text-stone-400 max-w-2xl">
      * Aviso legal: As imagens dos produtos neste site são meramente ilustrativas e utilizadas apenas para facilitar a identificação. O item físico em estoque pode apresentar pequenas variações de marca, cor, modelo ou embalagem.
      <br />
      Se caso queira ver fotos reais do produto, é só entrar em contato com a gente pelo WhatsApp para confirmar os detalhes antes de finalizar seu pedido. Estamos sempre à disposição para esclarecer qualquer dúvida e garantir a melhor experiência de compra para você!
    </p>

  </div>
</div>

        {/* --- RODAPÉ FINAL --- */}
        <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <p className="text-sm text-stone-500 font-bold mt-2">
          &copy; {new Date().getFullYear()} StoreCore. Todos os direitos reservados.
        </p>

          {/* Aqui agrupamos a Assinatura + o Cadeado na mesma linha */}
          <div className="flex items-center gap-3">
            
            <p className="text-xs text-stone-500 flex items-center gap-1">             
              Desenvolvido com <span className="text-red-500">❤️</span> e ☕ por <span className="text-white font-medium ml-1">Gustavo</span>           
            </p>
            
            {/* O Botão Secreto */}
            <button 
              onClick={irParaLogin} 
              className="opacity-20 hover:opacity-100 transition-opacity p-2" 
              title="Área Admin"
            >
              <Lock className="w-3 h-3 text-stone-500" />
            </button>

          </div>

        </div>
      </div>
    </footer>
  );
}