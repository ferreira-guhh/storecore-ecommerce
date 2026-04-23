import React from 'react';
import * as LucideIcons from 'lucide-react'; // Importa TODOS os ícones

export default function IconeDinamico({ nomeIcone, tamanho = 24, cor = "currentColor" }) {
  // Procura o ícone dentro da biblioteca pelo nome digitado
  const IconeEncontrado = LucideIcons[nomeIcone];

  // Se você digitar um nome que não existe, ele mostra um aviso no lugar de quebrar o site
  if (!IconeEncontrado) {
    return <LucideIcons.Image size={tamanho} color={cor} className="opacity-50" />; 
  }

  return <IconeEncontrado size={tamanho} color={cor} />;
}