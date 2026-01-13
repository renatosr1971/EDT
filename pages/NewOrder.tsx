
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import { supabase } from '../supabase';
import { OrderStatus } from '../types';

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    orderDate: new Date().toISOString().split('T')[0],
    pickupDate: new Date().toISOString().split('T')[0],
    items: '',
    totalValue: '',
    deliveryType: 'Retirada' as 'Retirada' | 'Entrega'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const orderNumber = `#EMP-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data, error } = await supabase
        .from('orders')
        .insert([{
          order_number: orderNumber,
          customer_name: formData.customerName,
          phone: formData.phone,
          items_summary: formData.items,
          total_value: parseFloat(formData.totalValue),
          delivery_type: formData.deliveryType,
          pickup_date: formData.pickupDate,
          status: OrderStatus.PENDING,
          user_id: user.id
        }])
        .select();

      if (error) throw error;

      alert('Pedido salvo com sucesso!');
      navigate('/orders');
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      alert('Erro ao salvar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <PageHeader>
        <div className="flex items-center p-4 justify-between w-full">
          <button onClick={() => navigate(-1)} className="text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
          </button>
          <h2 className="text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Novo Pedido</h2>
          <div className="size-10"></div>
        </div>
      </PageHeader>

      <main className="flex-1 flex flex-col gap-6 p-4 pb-32 w-full">
        <div className="flex justify-center">
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#234823] border border-[#326732] pl-4 pr-4 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <p className="text-white text-sm font-medium leading-normal">Status: Pendente</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-1">
              <span className="material-symbols-outlined text-primary text-[20px]">person</span>
              <h3 className="text-white text-lg font-bold">Detalhes do Cliente</h3>
            </div>

            <label className="flex flex-col w-full">
              <p className="text-white text-sm font-medium pb-2">Nome do Cliente</p>
              <input
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="form-input block w-full rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary border border-[#326732] bg-[#193319] h-14 placeholder:text-[#92c992] px-4 transition-all"
                placeholder="Ex: Maria Silva"
                required
              />
            </label>

            <label className="flex flex-col w-full">
              <p className="text-white text-sm font-medium pb-2">Telefone</p>
              <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#92c992]">
                  <span className="material-symbols-outlined">call</span>
                </span>
                <input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input block w-full rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary border border-[#326732] bg-[#193319] h-14 placeholder:text-[#92c992] px-4 pr-10 transition-all"
                  placeholder="(11) 99999-9999"
                  type="tel"
                />
              </div>
            </label>
          </div>

          <div className="h-px bg-[#193319] w-full"></div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-1">
              <span className="material-symbols-outlined text-primary text-[20px]">shopping_bag</span>
              <h3 className="text-white text-lg font-bold">Detalhes do Pedido</h3>
            </div>

            <div className="flex gap-4">
              <label className="flex flex-col flex-1">
                <p className="text-white text-sm font-medium pb-2">Tipo</p>
                <select
                  value={formData.deliveryType}
                  onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value as any })}
                  className="form-input block w-full rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary border border-[#326732] bg-[#193319] h-14 px-4 transition-all"
                >
                  <option value="Retirada">Retirada</option>
                  <option value="Entrega">Entrega</option>
                </select>
              </label>

              <label className="flex flex-col flex-1">
                <p className="text-white text-sm font-medium pb-2">Data do Pedido</p>
                <input
                  value={formData.orderDate}
                  onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                  className="form-input block w-full rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary border border-[#326732] bg-[#193319] h-14 px-4 transition-all"
                  type="date"
                />
              </label>
            </div>

            <label className="flex flex-col w-full">
              <p className="text-white text-sm font-medium pb-2">Itens do Pedido</p>
              <textarea
                value={formData.items}
                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                className="form-textarea block w-full rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary border border-[#326732] bg-[#193319] min-h-[120px] placeholder:text-[#92c992] p-4 transition-all"
                placeholder="Liste os itens aqui (Ex: 2x Pão Italiano, 1x Geleia)"
              />
            </label>

            <label className="flex flex-col w-full">
              <p className="text-white text-sm font-medium pb-2">Data de Retirada/Entrega</p>
              <input
                value={formData.pickupDate}
                onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                className="form-input block w-full rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary border border-[#326732] bg-[#193319] h-14 px-4 transition-all"
                type="date"
              />
            </label>

            <label className="flex flex-col w-full">
              <p className="text-white text-sm font-medium pb-2">Valor Total</p>
              <div className="relative flex items-center">
                <div className="absolute left-0 top-0 bottom-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-[#92c992] font-bold">R$</span>
                </div>
                <input
                  value={formData.totalValue}
                  onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })}
                  className="form-input block w-full rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary border border-[#326732] bg-[#193319] h-14 pl-12 pr-4 text-lg font-semibold text-right transition-all"
                  placeholder="0,00"
                  type="number"
                  step="0.01"
                  required
                />
              </div>
            </label>
          </div>

          <div className="fixed bottom-20 left-0 right-0 p-4 bg-background-dark border-t border-[#193319] z-40">
            <div className="max-w-md mx-auto w-full">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 transition-transform active:scale-[0.98] shadow-[0_0_15px_rgba(19,236,19,0.3)] disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-background-dark"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-background-dark font-bold">check_circle</span>
                    <span className="text-background-dark text-base font-bold">Salvar Pedido</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </PageLayout>
  );
};

export default NewOrder;
