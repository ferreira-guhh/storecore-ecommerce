import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, X, ShoppingBag } from 'lucide-react';
import ProdutoCard from './ProdutoCard';

export default function PaginaCatalogo({ 
  adicionarAoCarrinho, 
  voltarParaHome, 
  categoriaInicial, 
  favoritos, 
  toggleFavorito 
}) {
  const [produtos, setProdutos] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState(categoriaInicial || 'Todas');
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [ordem, setOrdem] = useState('a-z');
  const [apenasOfertas, setApenasOfertas] = useState(false);
  
  // 💡 Firebase usava "ultimoDoc", agora usamos números de página simples!
  const [pagina, setPagina] = useState(1);
  const [temMais, setTemMais] = useState(true);

  const categorias = ['Todas', 'Papelaria', 'Armarinho', 'Brinquedos', 'Casa', 'Eletronicos', 'Presentes', 'Diversos'];

  // Quando mudar a categoria, limpa tudo e busca a página 1
  useEffect(() => {
    setPagina(1);
    setTemMais(true);
    carregarProdutos(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriaAtiva, apenasOfertas, ordem]);

  // A super função que busca produtos (com filtro e página)
  const carregarProdutos = async (novo = false) => {
    setCarregando(true);
    try {
      const paginaAtual = novo ? 1 : pagina;
      
      // Monta a URL base
      let url = `https://StoreCore-api-22ky.onrender.com/produtos?pagina=${paginaAtual}`;
      
      // Adiciona categoria se não for "Todas"
      if (categoriaAtiva !== 'Todas') {
        url += `&categoria=${categoriaAtiva}`;
      }

      // Adiciona a busca de texto se o usuário digitou algo
      if (busca.trim()) {
        url += `&busca=${encodeURIComponent(busca.trim())}`;
      }

      if (apenasOfertas) url += `&ofertas=true`;
      if (ordem !== 'a-z') url += `&ordem=${ordem}`;

      const resposta = await fetch(url);
      const novosProdutos = await resposta.json();

      // 🛡️ O ESCUDO: Se a API deu erro 500, a gente para por aqui e não quebra a tela
      if (!resposta.ok) {
        console.error("Erro do servidor:", novosProdutos.erro);
        setProdutos([]); // Deixa a vitrine vazia
        return; // Aborta a missão antes do .map() tentar rodar!
      }

      setProdutos(prev => novo ? novosProdutos : [...prev, ...novosProdutos]);
      
      if (novo) {
        setPagina(2);
      } else {
        setPagina(prev => prev + 1);
      }

      // Se voltou 20 itens, significa que provavelmente tem mais na próxima página
      setTemMais(novosProdutos.length === 20);
    } catch (error) {
      console.error("Erro busca na API:", error);
    } finally {
      setCarregando(false);
    }
  };

  // Quando o usuário aperta Enter na barra de pesquisa
  const executarBusca = async (e) => {
    e.preventDefault();
    if (!busca.trim()) {
      setCategoriaAtiva('Todas');
      return;
    } 
    carregarProdutos(true);
  };

  const limparBusca = () => {
    setBusca('');
    setCategoriaAtiva('Todas');
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4 mb-3">
            <button onClick={voltarParaHome} className="p-2 -ml-2 hover:bg-stone-100 rounded-full">
              <ArrowLeft className="w-6 h-6 text-slate-700" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 leading-none">Catálogo</h1>
          </div>

          <form onSubmit={executarBusca} className="relative">
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-stone-100 border-none rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#8B2C3E]"
            />
            <Search className="absolute left-4 top-3 w-5 h-5 text-stone-400" />
            {busca && (
              <button type="button" onClick={limparBusca} className="absolute right-3 top-2.5">
                <X className="w-4 h-4 text-stone-400"/>
              </button>
            )}
          </form>
          {/* BARRA DE FILTROS AVANÇADOS */}
          <div className="flex items-center justify-between mt-3 mb-1 px-1">
            
            {/* Botão de Ofertas */}
            <button 
              onClick={() => { setApenasOfertas(!apenasOfertas); setPagina(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${apenasOfertas ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'}`}
            >
              🔥 Ofertas
            </button>

            {/* Select de Ordenação */}
            <select 
              value={ordem}
              onChange={(e) => { setOrdem(e.target.value); setPagina(1); }}
              className="bg-white border border-stone-200 text-stone-600 text-xs font-bold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-[#8B2C3E]"
            >
              <option value="a-z">Ordem: A-Z</option>
              <option value="menor-preco">Menor Preço</option>
              <option value="maior-preco">Maior Preço</option>
            </select>
          </div>
        </div>

        {/* Categorias centralizadas no PC */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide md:justify-center">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => { setCategoriaAtiva(cat); setBusca(''); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border-2 transition-all ${
                categoriaAtiva === cat 
                ? 'bg-[#8B2C3E] border-[#8B2C3E] text-white' 
                : 'bg-white border-stone-200 text-stone-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
          {produtos.map(p => (
            <ProdutoCard 
              key={p.id} 
              produto={p} 
              adicionarAoCarrinho={adicionarAoCarrinho} 
              favoritos={favoritos}
              toggleFavorito={toggleFavorito} 
            />
          ))}
        </div>

        {carregando && <div className="text-center py-10 text-stone-400 animate-pulse font-bold">Carregando...</div>}

        {!carregando && produtos.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 text-stone-200 mx-auto mb-4" />
            <p className="text-stone-400">Nenhum produto encontrado.</p>
          </div>
        )}

        {!carregando && temMais && produtos.length > 0 && (
          <div className="mt-8 text-center">
            <button onClick={() => carregarProdutos(false)} className="px-6 py-2 bg-white border border-stone-300 text-stone-600 font-bold rounded-lg text-sm shadow-sm active:scale-95 transition-transform">
              Carregar mais...
            </button>
          </div>
        )}
      </div>
    </div>
  );
}