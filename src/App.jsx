import React, { useState, useEffect } from 'react';
import { ShoppingBag, Settings } from 'lucide-react'; 

// Componentes
import SidebarFavoritos from './components/SidebarFavoritos';
import Navbar from './components/Navbar';
import BannerInteligente from './components/BannerInteligente';
import Departamentos from './components/Departamentos';
import VitrineDestaques from './components/VitrineDestaques';
import PaginaCatalogo from './components/PaginaCatalogo';
import Footer from './components/Footer';
import Carrinho from './components/Carrinho';
import SidebarCarrinho from './components/SidebarCarrinho';
import LoginAdmin from './components/LoginAdmin';
import PainelAdmin from './components/PainelAdmin';

function App() {
  const [telaAtual, setTelaAtual] = useState('home');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const [sidebarAberta, setSidebarAberta] = useState(false);
  
  // Agora o admin é verificado direto no navegador
  const [usuarioAdmin, setUsuarioAdmin] = useState(() => localStorage.getItem('StoreCore_admin') === 'true');

  // --- ESTADOS DE DADOS ---
  const [produtos, setProdutos] = useState([]); 
  const [bannerConfig, setBannerConfig] = useState(null); 
  const [carregando, setCarregando] = useState(true);

  // 1. Estado dos Favoritos
  const [favoritos, setFavoritos] = useState(() => {
    const salvos = localStorage.getItem('StoreCore_favoritos');
    return salvos ? JSON.parse(salvos) : [];
  });
  const [isFavoritosOpen, setIsFavoritosOpen] = useState(false);

  const toggleFavorito = (produto) => {
    setFavoritos(prev => {
      const jaExiste = prev.find(fav => fav.id === produto.id);
      let novaLista = jaExiste ? prev.filter(fav => fav.id !== produto.id) : [...prev, produto];
      localStorage.setItem('StoreCore_favoritos', JSON.stringify(novaLista));
      return novaLista;
    });
  };

  // --- CARRINHO ---
  const [carrinho, setCarrinho] = useState(() => {
    const salvos = localStorage.getItem('carrinho-StoreCore');
    return salvos ? JSON.parse(salvos) : [];
  });
  
  useEffect(() => localStorage.setItem('carrinho-StoreCore', JSON.stringify(carrinho)), [carrinho]);

  // 💡 CRIAMOS UMA FUNÇÃO SEPARADA PARA BUSCAR OS DESTAQUES
  const carregarDestaques = async () => {
    try {
      const resDestaques = await fetch('https://StoreCore-api-22ky.onrender.com/produtos?destaque=true');
      if (resDestaques.ok) setProdutos(await resDestaques.json());
    } catch (error) {
      console.error("Erro ao carregar destaques:", error);
    }
  };

  // --- CARREGAMENTO INICIAL DIRETO DO NODE.JS ---
  useEffect(() => {
    const carregarTudo = async () => {
      try {
        // 1. Busca o Banner
        const resBanner = await fetch('https://StoreCore-api-22ky.onrender.com/banner');
        if (resBanner.ok) setBannerConfig(await resBanner.json());

        // 2. Busca os Produtos em Destaque
        const resDestaques = await fetch('https://StoreCore-api-22ky.onrender.com/produtos?destaque=true');
        if (resDestaques.ok) setProdutos(await resDestaques.json());

      } catch (error) {
        console.error("Erro App:", error);
      } finally {
        setCarregando(false);
      }
    };
    carregarTudo();
  }, []);

  const aoLogarComSucesso = () => {
    localStorage.setItem('StoreCore_admin', 'true');
    setUsuarioAdmin(true);
    setTelaAtual('admin-painel');
  };

  // 💡 FUNÇÃO DE LOGOUT REAL
  const fazerLogout = () => {
    localStorage.removeItem('StoreCore_admin');
    setUsuarioAdmin(false);
    setTelaAtual('home');
    window.scrollTo(0,0);
  };

  const adicionarAoCarrinho = (p) => setCarrinho([...carrinho, p]);
  const removerDoCarrinho = (idx) => setCarrinho(carrinho.filter((_, i) => i !== idx));
  
  const irParaCatalogo = (cat) => { 
    setCategoriaAtiva(cat); 
    setTelaAtual('catalogo'); 
    window.scrollTo(0,0); 
  };

  // 💡 FUNÇÃO VOLTAR PRA HOME AGORA ATUALIZA OS DESTAQUES
  const voltarParaHome = () => { 
    carregarDestaques(); // Sempre que voltar pra vitrine, busca dados fresquinhos!
    setTelaAtual('home'); 
    window.scrollTo(0,0); 
  };

  if (carregando) return <div className="min-h-screen flex items-center justify-center font-bold text-[#8B2C3E]">Carregando StoreCore...</div>;

  return (
    <div className="bg-stone-50 min-h-screen font-sans relative">
      {usuarioAdmin && telaAtual !== 'admin-painel' && (
        <button onClick={() => setTelaAtual('admin-painel')} className="fixed bottom-4 left-4 z-50 bg-slate-900 text-white p-3 rounded-full shadow-xl">
          <Settings className="w-6 h-6" />
        </button>
      )}

      {telaAtual === 'home' && (
        <>
          <Navbar 
            carrinho={carrinho} 
            aoClicarNoCarrinho={() => setSidebarAberta(true)}
            aoClicarNaBusca={() => irParaCatalogo('Todas')} 
            favoritos={favoritos} 
            aoClicarNosFavoritos={() => setIsFavoritosOpen(true)} 
          />
          <BannerInteligente dados={bannerConfig} />
          <Departamentos setCategoriaAtiva={irParaCatalogo} />
          <VitrineDestaques 
            produtos={produtos} 
            adicionarAoCarrinho={adicionarAoCarrinho}
            favoritos={favoritos} 
            toggleFavorito={toggleFavorito} 
            irParaCatalogo={() => irParaCatalogo('Todas')}
            emModoHome={true}
          />
          <Footer irParaLogin={() => setTelaAtual('admin-login')} />
        </>
      )}

      {telaAtual === 'catalogo' && (
        <PaginaCatalogo 
          adicionarAoCarrinho={adicionarAoCarrinho} 
          voltarParaHome={voltarParaHome} 
          categoriaInicial={categoriaAtiva} 
          favoritos={favoritos}
          toggleFavorito={toggleFavorito}
        />
      )}

      {telaAtual === 'admin-login' && <LoginAdmin aoLogarComSucesso={aoLogarComSucesso} voltarParaHome={voltarParaHome} />}
      {/* 💡 PASSAMOS O VOLTAR E O LOGOUT SEPARADOS */}
      {telaAtual === 'admin-painel' && (
        <PainelAdmin 
          voltarParaHome={voltarParaHome} 
          fazerLogout={fazerLogout} 
        />
      )}

      <Carrinho carrinho={carrinho} finalizarCompra={() => setSidebarAberta(true)} />
      
      <SidebarCarrinho 
        isOpen={sidebarAberta} 
        onClose={() => setSidebarAberta(false)} 
        carrinho={carrinho} 
        removerDoCarrinho={removerDoCarrinho} 
        valorTotal={carrinho.reduce((a,b)=>a+b.preco,0)} 
      />
      
      <SidebarFavoritos 
        isOpen={isFavoritosOpen}
        onClose={() => setIsFavoritosOpen(false)}
        favoritos={favoritos}
        toggleFavorito={toggleFavorito}
        adicionarAoCarrinho={adicionarAoCarrinho}
      />
    </div>
  );
}

export default App;