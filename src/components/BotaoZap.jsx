import React from 'react';

const BotaoZap = ({ itensNoCarrinho, valorTotal }) => {

  const numeroWhatsApp = "999999999"; 

  const finalizarCompra = () => {
    let mensagem = "*Olá! Vi esses itens no Catálogo Digital e gostaria de saber se tem disponível:*%0A%0A";

    // Agrupamos os itens para não repetir o nome se a pessoa adicionou 2x o mesmo
    const resumo = {};
    itensNoCarrinho.forEach(item => {
      resumo[item.nome] = (resumo[item.nome] || 0) + 1;
    });

    Object.keys(resumo).forEach((nome) => {
      mensagem += `- ${resumo[nome]}x ${nome}%0A`;
    });

    mensagem += `%0A*Total Estimado: R$ ${valorTotal.toFixed(2).replace('.', ',')}*`;
    mensagem += "%0A%0A_Aguardo confirmação para ir buscar!_";

    const link = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
    window.open(link, '_blank');
  };

  return (
    <button 
      onClick={finalizarCompra}
      className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 mt-4"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382C17.112 14.202 15.344 13.332 15.013 13.222C14.682 13.112 14.441 13.002 14.2 13.362C13.959 13.722 13.268 14.532 13.058 14.772C12.848 15.012 12.638 15.042 12.278 14.862C11.918 14.682 10.759 14.302 9.385 13.078C8.293 12.106 7.556 10.905 7.346 10.545C7.136 10.185 7.323 9.991 7.503 9.812C7.664 9.652 7.862 9.392 8.042 9.182C8.222 8.972 8.282 8.822 8.402 8.582C8.522 8.342 8.462 8.132 8.372 7.952C8.282 7.772 7.561 6.002 7.261 5.282C6.961 4.592 6.661 4.682 6.421 4.682C6.211 4.682 5.971 4.682 5.731 4.682C5.491 4.682 5.101 4.772 4.771 5.132C4.441 5.492 3.511 6.362 3.511 8.132C3.511 9.902 4.771 11.612 4.951 11.852C5.131 12.092 7.442 15.652 10.982 17.182C13.929 18.455 14.522 18.205 15.152 18.145C15.842 18.085 17.372 17.275 17.682 16.405C17.992 15.535 17.992 14.785 17.902 14.635C17.812 14.485 17.652 14.415 17.472 14.235V14.382ZM12.001 21.821C10.231 21.821 8.581 21.361 7.131 20.551L6.811 20.361L3 21.581L4.251 17.921L4.041 17.581C3.161 16.061 2.691 14.321 2.691 12.531C2.691 7.401 6.871 3.221 12.001 3.221C14.491 3.221 16.831 4.191 18.591 5.951C20.351 7.711 21.321 10.051 21.321 12.541C21.321 17.671 17.141 21.821 12.001 21.821Z" />
      </svg>
      Enviar Pedido no Zap
    </button>
  );
};

export default BotaoZap;