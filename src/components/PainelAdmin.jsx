import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Store, LogOut, LayoutTemplate, Package, Save, ChevronDown, Eye, EyeOff } from 'lucide-react';
import IconeDinamico from './IconeDinamico';

const BANNER_CONFIG_PADRAO = {
  titulo: 'Bem-vindo ao StoreCore',
  subtitulo: 'Encontre tudo o que voce precisa aqui.',
  textoBotao: 'Ver Ofertas',
  imagem: '',
  nomeIcone: 'Store',
  corFundo: '#FCE7F3',
  corTexto: '#831843',
  corBotao: '#DB2777'
};

const CAMPOS_COR_BANNER = [
  { chave: 'corFundo', label: 'Cor de Fundo do Banner', title: 'Fundo' },
  { chave: 'corTexto', label: 'Cor do Texto do Banner', title: 'Texto' },
  { chave: 'corBotao', label: 'Cor do Botao do Banner', title: 'Botao' }
];

const HEX_COMPLETO = /^#[0-9A-F]{6}$/;

const normalizarHex = (valor) => {
  const texto = typeof valor === 'string' ? valor.toUpperCase() : '';
  const semInvalidos = texto.replace(/[^#0-9A-F]/g, '');
  const comHashUnico = semInvalidos.startsWith('#')
    ? `#${semInvalidos.slice(1).replace(/#/g, '')}`
    : `#${semInvalidos.replace(/#/g, '')}`;

  return comHashUnico.slice(0, 7);
};

const corHexValida = (valor) => HEX_COMPLETO.test(valor);
const normalizarNomeIcone = (valor) => typeof valor === 'string' ? valor.trim() : '';
const obterNomeIconeBanner = (valor) => normalizarNomeIcone(valor) || BANNER_CONFIG_PADRAO.nomeIcone;

const normalizarBannerConfig = (dados = {}) => {
  const config = { ...BANNER_CONFIG_PADRAO, ...dados };
  const corFundo = normalizarHex(config.corFundo);
  const corTexto = normalizarHex(config.corTexto);
  const corBotao = normalizarHex(config.corBotao);

  return {
    ...config,
    nomeIcone: obterNomeIconeBanner(config.nomeIcone),
    corFundo: corHexValida(corFundo) ? corFundo : BANNER_CONFIG_PADRAO.corFundo,
    corTexto: corHexValida(corTexto) ? corTexto : BANNER_CONFIG_PADRAO.corTexto,
    corBotao: corHexValida(corBotao) ? corBotao : BANNER_CONFIG_PADRAO.corBotao
  };
};

const extrairInputsCor = (config) => ({
  corFundo: config.corFundo,
  corTexto: config.corTexto,
  corBotao: config.corBotao
});

export default function PainelAdmin({ voltarParaHome, fazerLogout }) {
  // --- ESTADOS GERAIS ---
  const [abaAtiva, setAbaAtiva] = useState('produtos'); 
  const [carregando, setCarregando] = useState(true);
  const [estatisticas, setEstatisticas] = useState({ total: 0, visiveis: 0, semFoto: 0, destaques: 0 });

  // --- ESTADOS DE PRODUTOS ---
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroSemFoto, setFiltroSemFoto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);
  
  // PAGINAÇÃO
  const [pagina, setPagina] = useState(1);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [temMais, setTemMais] = useState(true);

  // --- ESTADO DO BANNER (CMS) ---
  const [bannerConfig, setBannerConfig] = useState(BANNER_CONFIG_PADRAO);
  const [inputsCorBanner, setInputsCorBanner] = useState(extrairInputsCor(BANNER_CONFIG_PADRAO));

  // --- 1. CARREGAR DADOS AO ABRIR ---
  useEffect(() => {
    carregarProdutos(true);
    carregarBanner();
    carregarEstatisticas();
  }, [filtroSemFoto]);

  const carregarEstatisticas = async () => {
    try {
      const res = await fetch('https://bazar-api-22ky.onrender.com/admin/estatisticas');
      if (res.ok) setEstatisticas(await res.json());
    } catch { console.error("Erro ao carregar estatísticas"); }
  };

  const carregarBanner = async () => {
    try {
      const res = await fetch('https://bazar-api-22ky.onrender.com/banner');
      if (res.ok) {
        const dados = normalizarBannerConfig(await res.json());
        setBannerConfig(dados);
        setInputsCorBanner(extrairInputsCor(dados));
      }
    } catch {
      console.log("Sem banner configurado ainda ou erro ao buscar.");
    }
  };

  const carregarProdutos = async (novo = false, termoBusca = busca) => {
    if (novo) {
      setCarregando(true);
      setPagina(1);
    } else {
      setCarregandoMais(true);
    }

    try {
      const paginaAtual = novo ? 1 : pagina + 1;
      // API nova do admin (traz os invisíveis também)
      let url = `https://bazar-api-22ky.onrender.com/admin/produtos?pagina=${paginaAtual}`;
      
      if (termoBusca.trim()) {
        url += `&busca=${encodeURIComponent(termoBusca.trim())}`;
      }
      if (filtroSemFoto) {
        url += `&semFoto=true`;
      }

      const res = await fetch(url);
      const novosProdutos = await res.json();

      setProdutos(prev => novo ? novosProdutos : [...prev, ...novosProdutos]);
      setPagina(paginaAtual);
      setTemMais(novosProdutos.length === 20); // Limite é 20
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setCarregando(false);
      setCarregandoMais(false);
    }
  };

  const pesquisarNoBanco = (termoDeBusca) => {
    carregarProdutos(true, termoDeBusca);
  };

  const atualizarCorBanner = (campo, valor) => {
    const cor = normalizarHex(valor);

    if (!corHexValida(cor)) return;

    setBannerConfig(prev => ({ ...prev, [campo]: cor }));
    setInputsCorBanner(prev => ({ ...prev, [campo]: cor }));
  };

  const handleInputHexChange = (campo, valor) => {
    const corDigitada = normalizarHex(valor);
    setInputsCorBanner(prev => ({ ...prev, [campo]: corDigitada }));

    if (corHexValida(corDigitada)) {
      setBannerConfig(prev => ({ ...prev, [campo]: corDigitada }));
    }
  };

  const handleInputHexBlur = (campo) => {
    setInputsCorBanner(prev => ({
      ...prev,
      [campo]: corHexValida(prev[campo]) ? prev[campo] : bannerConfig[campo]
    }));
  };

  // --- 2. FUNÇÕES DO BANNER ---
  const salvarBanner = async () => {
    try {
      await fetch('https://bazar-api-22ky.onrender.com/banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerConfig)
      });
      alert("Banner atualizado com sucesso! Veja na Home. 🎨");
    } catch { 
      alert("Erro ao salvar banner."); 
    }
  };

  // --- 3. FUNÇÕES DE PRODUTOS ---
  const toggleVisibilidade = async (id, statusAtual) => {
    try {
      const novoStatus = statusAtual === false ? true : false; 
      await fetch(`https://bazar-api-22ky.onrender.com/admin/produtos/${id}/visibilidade`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visivel: novoStatus })
      });
      setProdutos(produtos.map(p => p.id === id ? { ...p, visivel: novoStatus } : p));
      carregarProdutos(true);
      carregarEstatisticas();
    } catch {
      alert("Erro ao alterar visibilidade.");
    }
  };
  
  const handleSalvarProduto = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const dadosParaSalvar = {
        nome: produtoEditando.nome,
        preco: produtoEditando.preco ? parseFloat(produtoEditando.preco) : null,
        precoPromocional: produtoEditando.precoPromocional ? parseFloat(produtoEditando.precoPromocional) : null,
        categoria: produtoEditando.categoria,
        subcategoria: produtoEditando.subcategoria || '',
        imagem: produtoEditando.imagem || '',
        destaque: produtoEditando.destaque || false,
        visivel: produtoEditando.visivel !== false
      };

      const url = produtoEditando.id ? `https://bazar-api-22ky.onrender.com/admin/produtos/${produtoEditando.id}` : `https://bazar-api-22ky.onrender.com/admin/produtos`;
      const metodo = produtoEditando.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaSalvar)
      });
      
      const produtoSalvo = await res.json();

      if (produtoEditando.id) {
        setProdutos(prev => prev.map(p => p.id === produtoEditando.id ? { ...p, ...dadosParaSalvar } : p));
        alert("Produto atualizado!");
        carregarProdutos(true);
        carregarEstatisticas();
      } else {
        setProdutos(prev => [produtoSalvo, ...prev]);
        alert("Produto criado!");
        carregarProdutos(true);
        carregarEstatisticas();
      }
      setProdutoEditando(null);
    } catch {
      alert("Erro ao salvar produto.");
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletar = async (id) => {
    if (window.confirm("Atenção: Deseja realmente excluir este produto permanentemente?")) {
      try {
        await fetch(`https://bazar-api-22ky.onrender.com/admin/produtos/${id}`, { method: 'DELETE' });
        setProdutos(prev => prev.filter(p => p.id !== id));
        carregarProdutos(true);
        carregarEstatisticas();
      } catch { 
        alert("Erro ao deletar. Verifique a conexão."); 
      }
    }
  };

  const buscarNoGoogle = (nome) => {
    const query = encodeURIComponent(nome + " png fundo branco");
    window.open(`https://www.google.com/search?q=${query}&tbm=isch`, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-8 font-sans">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Painel Admin</h1>
          <p className="text-stone-500">Gestão Total do StoreCore</p>
        </div>
        <div className="flex gap-2">
          <button onClick={voltarParaHome} className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg font-bold text-stone-700 hover:bg-stone-50 border border-stone-300">
            <Store className="w-4 h-4" /> Ver Loja
          </button>
          <button onClick={fazerLogout} className="p-2 text-stone-400 hover:text-red-600" title="Sair do Painel">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ABAS */}
      <div className="max-w-6xl mx-auto mb-6 flex gap-4 border-b border-stone-300 pb-1">
        <button onClick={() => setAbaAtiva('produtos')} className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all ${abaAtiva === 'produtos' ? 'bg-white text-[#8B2C3E] border-t border-x border-stone-200' : 'text-stone-500'}`}>
          <Package className="w-5 h-5" /> Gerenciar Produtos
        </button>
        <button onClick={() => setAbaAtiva('banner')} className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all ${abaAtiva === 'banner' ? 'bg-white text-[#8B2C3E] border-t border-x border-stone-200' : 'text-stone-500'}`}>
          <LayoutTemplate className="w-5 h-5" /> Editor de Banner
        </button>
      </div>

      {/* --- ABA PRODUTOS --- */}
      {abaAtiva === 'produtos' && (
        <div className="max-w-6xl mx-auto bg-white rounded-b-2xl rounded-tr-2xl shadow-sm border border-stone-200 p-6">
        
        {/* 📊 DASHBOARD DE ESTATÍSTICAS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex flex-col">
              <span className="text-blue-500 text-xs font-bold uppercase tracking-wider mb-1">Total Cadastrado</span>
              <span className="text-3xl font-black text-blue-700">{estatisticas.total}</span>
            </div>
            <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex flex-col">
              <span className="text-green-500 text-xs font-bold uppercase tracking-wider mb-1">Na Vitrine (Visíveis)</span>
              <span className="text-3xl font-black text-green-700">{estatisticas.visiveis}</span>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex flex-col">
              <span className="text-yellow-500 text-xs font-bold uppercase tracking-wider mb-1">Destaques Ativos</span>
              <span className="text-3xl font-black text-yellow-700">{estatisticas.destaques}</span>
            </div>
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex flex-col">
              <span className="text-red-500 text-xs font-bold uppercase tracking-wider mb-1">Sem Foto (Pendente)</span>
              <span className="text-3xl font-black text-red-700">{estatisticas.semFoto}</span>
            </div>
          </div>
          {/* FIM DO DASHBOARD */}
          
          <div className="flex justify-between items-center mb-6">
            <div className="relative flex-1 max-w-md flex gap-2">
              <input 
                type="text" 
                placeholder="Pesquisar produto no banco..." 
                value={busca} 
                onChange={(e) => setBusca(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && pesquisarNoBanco(busca)}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-[#8B2C3E]" 
              />
              <Search className="absolute left-3 top-3.5 text-stone-400 w-5 h-5" />
              <button 
                onClick={() => pesquisarNoBanco(busca)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900"
              >
                Buscar
              </button>
              <button 
                onClick={() => setFiltroSemFoto(!filtroSemFoto)}
                className={`px-4 py-2 rounded-xl font-bold border transition-colors whitespace-nowrap ${filtroSemFoto ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'}`}
                title="Mostrar apenas produtos sem imagem"
              >
                {filtroSemFoto ? '❌ Limpar Filtro' : '📸 Faltam Fotos'}
              </button>
            </div>
            <button onClick={() => setProdutoEditando({ nome: '', preco: '', precoPromocional: '', categoria: 'Diversos', subcategoria: '', imagem: '', destaque: false, visivel: true })} className="bg-[#8B2C3E] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#6e2231] flex items-center gap-2">
              <Plus className="w-4 h-4" /> Novo Produto
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-100">
            {carregando ? (
              <div className="p-8 text-center text-stone-500 font-bold animate-pulse">Carregando produtos...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider font-bold">
                    <th className="p-4">Produto</th>
                    <th className="p-4">Subcategoria</th>
                    <th className="p-4">Categoria</th>
                    <th className="p-4">Preço</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {produtos.map(p => (
                    <tr key={p.id} className={`hover:bg-stone-50 transition-colors ${p.visivel === false ? 'opacity-50 grayscale' : ''}`}>
                      
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-stone-100 flex-shrink-0 overflow-hidden">
                          <img src={p.imagem} className="w-full h-full object-cover" onError={e => e.target.style.opacity=0} />
                        </div>
                        
                        <span className="font-medium text-slate-700 line-clamp-1">
                          {p.nome}
                          {p.visivel === false && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">Invisível</span>}
                        </span>
                      </td>
                      <td className="p-4">
                      {p.subcategoria ? (
                        <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-md uppercase border border-blue-100">
                          {p.subcategoria}
                        </span>
                      ) : (
                        <span className="text-[10px] text-stone-300 italic">Nenhuma</span>
                      )}
                    </td>
                      <td className="p-4"><span className="text-xs font-bold bg-stone-100 px-2 py-1 rounded-full text-stone-500 uppercase">{p.categoria}</span></td>
                      <td className="p-4">
                        {p.precoPromocional ? (
                          <div className="flex flex-col">
                            <span className="text-xs text-stone-400 line-through">R$ {(parseFloat(p.preco) || 0).toFixed(2).replace('.', ',')}</span>
                            <span className="font-bold text-[#25D366]">R$ {(parseFloat(p.precoPromocional) || 0).toFixed(2).replace('.', ',')}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-[#8B2C3E]">R$ {(parseFloat(p.preco) || 0).toFixed(2).replace('.', ',')}</span>
                        )}
                      </td>
                      
                      
                      <td className="p-4 text-center text-xl">{p.destaque ? '⭐' : ''}</td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <button 
                          onClick={() => toggleVisibilidade(p.id, p.visivel)}
                          className={`p-2 rounded-lg transition-colors ${p.visivel !== false ? 'text-stone-400 hover:text-blue-500 hover:bg-blue-50' : 'text-red-500 bg-red-50'}`}
                          title={p.visivel !== false ? "Esconder da Vitrine" : "Mostrar na Vitrine"}
                        >
                          {p.visivel !== false ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                        <button onClick={() => setProdutoEditando(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg" title="Editar Produto"><Edit className="w-5 h-5" /></button>
                        <button onClick={() => handleDeletar(p.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg" title="Excluir Definitivamente"><Trash2 className="w-5 h-5" /></button>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {temMais && !carregando && produtos.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => carregarProdutos(false)} 
                disabled={carregandoMais}
                className="flex items-center gap-2 px-6 py-3 bg-stone-100 text-stone-600 font-bold rounded-xl hover:bg-stone-200 disabled:opacity-50 transition-colors"
              >
                {carregandoMais ? 'Carregando...' : 'Carregar Mais Produtos'}
                <ChevronDown className={`w-4 h-4 ${carregandoMais ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}
          <p className="text-center text-xs text-stone-400 mt-4">Exibindo {produtos.length} produtos</p>

        </div>
      )}

      {/* --- ABA BANNER (CMS) --- */}
      {abaAtiva === 'banner' && (
        <div className="max-w-6xl mx-auto bg-white rounded-b-2xl rounded-tr-2xl shadow-sm border border-stone-200 p-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 border-b pb-2">✏️ Editar Conteúdo</h3>
              <div><label className="text-xs font-bold text-stone-500 uppercase">Título</label><input type="text" value={bannerConfig.titulo} onChange={e => setBannerConfig({...bannerConfig, titulo: e.target.value})} className="w-full p-3 bg-stone-50 border rounded-lg" /></div>
              <div><label className="text-xs font-bold text-stone-500 uppercase">Subtítulo</label><textarea rows="2" value={bannerConfig.subtitulo} onChange={e => setBannerConfig({...bannerConfig, subtitulo: e.target.value})} className="w-full p-3 bg-stone-50 border rounded-lg" /></div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div><label className="text-xs font-bold text-stone-500 uppercase">Botão</label><input type="text" value={bannerConfig.textoBotao} onChange={e => setBannerConfig({...bannerConfig, textoBotao: e.target.value})} className="w-full p-3 bg-stone-50 border rounded-lg" /></div>
                <div><label className="text-xs font-bold text-stone-500 uppercase">Imagem (URL)</label><input type="text" value={bannerConfig.imagem} onChange={e => setBannerConfig({...bannerConfig, imagem: e.target.value})} className="w-full p-3 bg-stone-50 border rounded-lg" /></div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-stone-500 uppercase">Ícone do Banner (Lucide)</label>
                  <input
                    type="text"
                    value={bannerConfig.nomeIcone || ''}
                    onChange={e => setBannerConfig({ ...bannerConfig, nomeIcone: e.target.value })}
                    className="mt-1 w-full p-3 bg-stone-50 border rounded-lg"
                    placeholder="Ex: Store, ShoppingBag, Megaphone, Gift"
                    spellCheck={false}
                  />
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                      <IconeDinamico nomeIcone={obterNomeIconeBanner(bannerConfig.nomeIcone)} cor={bannerConfig.corTexto} tamanho={20} />
                    </div>
                    <p className="text-xs text-stone-500">
                      Use o nome do icone em ingles. Exemplos: Store, ShoppingBag, Megaphone, Gift.
                    </p>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 border-b pb-2 pt-4">🎨 Cores</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {CAMPOS_COR_BANNER.map(({ chave, label, title }) => (
                  <div key={chave} className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-stone-600">{label}</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={bannerConfig[chave]}
                        onChange={e => atualizarCorBanner(chave, e.target.value)}
                        className="h-10 w-12 cursor-pointer rounded-lg border border-stone-200 bg-transparent p-1"
                        title={title}
                      />
                      <input
                        type="text"
                        value={inputsCorBanner[chave]}
                        onChange={e => handleInputHexChange(chave, e.target.value)}
                        onBlur={() => handleInputHexBlur(chave)}
                        className="w-32 rounded-lg border border-stone-200 bg-stone-50 p-2 text-center font-mono text-sm uppercase outline-none focus:ring-2 focus:ring-[#8B2C3E]"
                        maxLength={7}
                        placeholder="#FFFFFF"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <button onClick={salvarBanner} className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 flex justify-center gap-2"><Save className="w-5 h-5"/> Salvar Site</button>
            </div>
            {/* Preview do Banner */}
            <div className="flex flex-col items-center justify-center bg-stone-100 rounded-3xl p-4 border-4 border-dashed border-stone-300">
               <div className="w-full rounded-3xl p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden" style={{ backgroundColor: bannerConfig.corFundo }}>
                  <div className="flex items-center gap-2">
                    <IconeDinamico nomeIcone={obterNomeIconeBanner(bannerConfig.nomeIcone)} cor={bannerConfig.corTexto} tamanho={20} />
                    <span className="text-xs font-black uppercase tracking-widest opacity-60" style={{ color: bannerConfig.corTexto }}>Destaque</span>
                  </div>
                  <h2 className="text-3xl font-black leading-tight" style={{ color: bannerConfig.corTexto }}>{bannerConfig.titulo}</h2>
                  <p className="text-sm opacity-90" style={{ color: bannerConfig.corTexto }}>{bannerConfig.subtitulo}</p>
                  <button className="px-6 py-2 rounded-full font-bold text-white text-xs w-max" style={{ backgroundColor: bannerConfig.corBotao }}>{bannerConfig.textoBotao}</button>
                  {bannerConfig.imagem && <img src={bannerConfig.imagem} className="absolute -right-4 -bottom-4 w-24 h-24 object-cover rounded-tl-2xl opacity-80" />}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DE EDIÇÃO DE PRODUTO --- */}
      {produtoEditando && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">{produtoEditando.id ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button onClick={() => setProdutoEditando(null)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSalvarProduto} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase">Nome</label>
                <input type="text" required value={produtoEditando.nome} onChange={e => setProdutoEditando({...produtoEditando, nome: e.target.value})} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-[#8B2C3E]" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase">Preço Normal (R$)</label>
                  <input type="number" step="0.01" value={produtoEditando.preco || ''} onChange={e => setProdutoEditando({...produtoEditando, preco: e.target.value})} placeholder="Em branco = Sob Consulta" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-[#8B2C3E]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#25D366] uppercase">Promoção (Opcional)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={produtoEditando.precoPromocional || ''} 
                    onChange={e => setProdutoEditando({...produtoEditando, precoPromocional: e.target.value})} 
                    placeholder="Ex: 89.90"
                    className="w-full p-3 bg-green-50/50 border border-green-200 rounded-xl outline-none focus:ring-2 focus:ring-[#25D366]" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 uppercase">Categoria</label>
                <select value={produtoEditando.categoria} onChange={e => setProdutoEditando({...produtoEditando, categoria: e.target.value})} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-[#8B2C3E]">
                  {['Papelaria', 'Armarinho', 'Brinquedos', 'Casa', 'Eletronicos', 'Presentes', 'Diversos'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 uppercase">Subcategoria (Ex: Lápis, Cadernos...)</label>
                <input 
                  type="text" 
                  value={produtoEditando.subcategoria || ''} 
                  onChange={e => setProdutoEditando({...produtoEditando, subcategoria: e.target.value})} 
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-[#8B2C3E]" 
                  placeholder="Digite a subcategoria"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase">Imagem (Link do Google)</label>
                <div className="flex gap-2">
                  <input type="text" value={produtoEditando.imagem} onChange={e => setProdutoEditando({...produtoEditando, imagem: e.target.value})} className="flex-1 p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#8B2C3E]" />
                  <button type="button" onClick={() => buscarNoGoogle(produtoEditando.nome)} className="bg-blue-500 text-white px-4 rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors">Buscar Foto</button>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                <input type="checkbox" id="chk" checked={produtoEditando.destaque || false} onChange={e => setProdutoEditando({...produtoEditando, destaque: e.target.checked})} className="w-5 h-5 accent-yellow-600"/>
                <label htmlFor="chk" className="text-sm font-bold text-yellow-800 cursor-pointer select-none">Mostrar como Destaque na Vitrine Inicial ⭐</label>
              </div>
              
              <button type="submit" disabled={salvando} className="w-full py-4 bg-[#8B2C3E] text-white rounded-xl font-bold hover:bg-[#6e2231] transition-colors mt-2">
                {salvando ? 'Salvando no banco de dados...' : 'Salvar Produto'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
