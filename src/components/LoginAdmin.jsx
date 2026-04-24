import React, { useState } from 'react';
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react';

export default function LoginAdmin({ voltarParaHome, aoLogarComSucesso }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Não recarrega a página
    setCarregando(true);
    setErro('');

    try {
      // 🚀 Agora bate direto na nossa própria API em vez do Firebase!
      const resposta = await fetch('https://bazar-api-22ky.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      
      if (resposta.ok) {
        // Se a API confirmar a senha, libera a passagem
        aoLogarComSucesso();
      } else {
        // Se a senha estiver errada, pega a mensagem de erro do backend
        const dadosErro = await resposta.json();
        setErro(dadosErro.erro || 'E-mail ou senha incorretos.');
      }
      
    } catch (error) {
      console.error(error);
      setErro('Erro de conexão com o servidor. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-stone-200">
        
        {/* Cabeçalho do Card */}
        <div className="text-center mb-8">
          <div className="bg-stone-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Área Restrita</h2>
          <p className="text-slate-500 text-sm mt-1">Acesso exclusivo para administração</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-[#8B2C3E] outline-none transition-all"
              placeholder="admin@StoreCore.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <input 
              type="password" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-[#8B2C3E] outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Mensagem de Erro */}
          {erro && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {erro}
            </div>
          )}

          <button 
            type="submit"
            disabled={carregando}
            className="w-full py-3 bg-[#8B2C3E] hover:bg-[#6e2231] text-white font-bold rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {carregando ? 'Verificando...' : 'Entrar no Painel'}
          </button>
        </form>

        {/* Botão Voltar */}
        <button 
          onClick={voltarParaHome}
          className="w-full mt-6 flex items-center justify-center gap-2 text-stone-500 hover:text-stone-800 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a Loja
        </button>

      </div>
    </div>
  );
}