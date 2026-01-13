
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import { supabase } from '../supabase';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [emailConfig, setEmailConfig] = useState({
    managerEmail: 'gerente@emporioartesanal.com.br',
    subject: 'Atualização do seu pedido #12345',
    body: `Olá [NOME_CLIENTE],

Estamos felizes em informar que recebemos o seu pedido #[NUMERO_PEDIDO].

Aqui estão os detalhes:
[ITENS]

Total: [TOTAL]

Avisaremos assim que sair para entrega.
Atenciosamente, 
Equipe Empório.`
  });

  const variables = [
    '[NOME_CLIENTE]',
    '[NUMERO_PEDIDO]',
    '[TOTAL]',
    '[ITENS]',
    '[DATA_ENTREGA]'
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <PageLayout>
      <PageHeader>
        <div className="flex items-center p-4 justify-between w-full">
          <button onClick={() => navigate(-1)} className="text-white hover:text-primary transition-colors flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10">
            <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
          </button>
          <h2 className="text-white text-lg font-bold leading-tight tracking-tight text-center">Modelos de E-mail</h2>
          <div className="size-10"></div>
        </div>
      </PageHeader>

      <main className="flex flex-col gap-2 p-4">
        <div>
          <h3 className="text-white text-lg font-bold pt-6 pb-2">Configurações Gerais</h3>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col w-full">
              <p className="text-gray-300 text-sm font-medium pb-2">E-mail do Responsável</p>
              <div className="relative">
                <input
                  className="block w-full rounded-xl border border-[#326732] bg-surface-dark text-white focus:ring-2 focus:ring-primary/50 h-12 px-4 outline-none transition-all"
                  value={emailConfig.managerEmail}
                  onChange={(e) => setEmailConfig({ ...emailConfig, managerEmail: e.target.value })}
                  type="email"
                />
                <div className="absolute right-3 top-3 text-primary pointer-events-none">
                  <span className="material-symbols-outlined text-xl">mail</span>
                </div>
              </div>
            </label>

            <label className="flex flex-col w-full">
              <p className="text-gray-300 text-sm font-medium pb-2">Assunto do E-mail</p>
              <input
                className="block w-full rounded-xl border border-[#326732] bg-surface-dark text-white focus:ring-2 focus:ring-primary/50 h-12 px-4 outline-none transition-all"
                value={emailConfig.subject}
                onChange={(e) => setEmailConfig({ ...emailConfig, subject: e.target.value })}
                type="text"
              />
            </label>
          </div>
        </div>

        <div className="h-px bg-[#326732]/30 my-6"></div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-white text-lg font-bold">Corpo da Mensagem</h3>
            <button className="text-xs font-semibold text-primary uppercase tracking-wide">Pré-visualizar</button>
          </div>

          <textarea
            className="block w-full rounded-xl border border-[#326732] bg-surface-dark text-white focus:ring-2 focus:ring-primary/50 min-h-[240px] p-4 outline-none leading-relaxed transition-all"
            value={emailConfig.body}
            onChange={(e) => setEmailConfig({ ...emailConfig, body: e.target.value })}
          />
        </div>

        <div className="pt-6">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Variáveis Disponíveis (Toque para copiar)</p>
          <div className="flex flex-wrap gap-2">
            {variables.map(v => (
              <button
                key={v}
                className="group flex items-center gap-1 bg-surface-dark border border-[#326732] px-3 py-1.5 rounded-full hover:border-primary active:bg-primary/10 transition-all"
              >
                <span className="text-sm font-semibold text-primary">{v}</span>
                <span className="material-symbols-outlined text-[16px] text-gray-500 group-hover:text-primary transition-colors">content_copy</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background-dark border-t border-[#193319] z-40">
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate('/login');
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3.5 text-red-400 font-bold text-base hover:bg-red-500/20 transition-all"
        >
          <span className="material-symbols-outlined font-bold">logout</span>
          Sair da Conta
        </button>
        <button
          onClick={() => alert('Configurações salvas!')}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-black font-bold text-base hover:bg-opacity-90 transition-all shadow-[0_0_15px_rgba(19,236,19,0.2)]"
        >
          <span className="material-symbols-outlined font-bold">save</span>
          Salvar Alterações
        </button>
      </div>
    </PageLayout>
  );
};

export default Settings;
