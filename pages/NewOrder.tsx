
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
    pickupDate: '', // Format: "DD/MM às HHh"
    items: '',
    totalValue: '', // Format: "R$ 0,00"
    deliveryType: 'Retirada' as 'Retirada' | 'Entrega'
  });

  // Helper to format currency on input
  const formatCurrency = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');

    // Convert to cents and then to decimal string
    const floatValue = Number(numericValue) / 100;

    // Format as BRL currency
    return floatValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Helper to parse currency string back to number
  const parseCurrency = (value: string) => {
    if (!value) return 0;
    // Remove "R$", spaces, and dots (thousand separators)
    // Example: "R$ 1.234,56" -> "1234,56"
    const cleanOne = value.replace('R$', '').replace(/\./g, '').replace(/\s/g, '');

    // Replace comma with dot for float parsing
    // Example: "1234,56" -> "1234.56"
    const dotValue = cleanOne.replace(',', '.');

    const parsed = parseFloat(dotValue);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Helper to format date input while typing
  const formatPickupDateInput = (value: string) => {
    return value;
  };

  const handlePickupDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, pickupDate: e.target.value });
  };

  const handleTotalValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Keep only numbers and comma
    // Note: We strip everything else to re-format.
    // If user types comma, we interpret as starting decimals.

    const numericOnly = newValue.replace(/[^0-9]/g, '');
    const formatted = formatCurrency(numericOnly);
    setFormData({ ...formData, totalValue: formatted });
  };

  const parsePickupDate = (dateStr: string): string | null => {
    // Expected format: "DD/MM às HHh" e.g., "21/01 às 9h"
    // Regex to capture Day, Month, Hour
    const regex = /^(\d{2})\/(\d{2})\s+às\s+(\d{1,2})h$/;
    const match = dateStr.match(regex);

    if (!match) return null;

    const [_, day, month, hour] = match;
    const year = new Date().getFullYear();

    // Create date. Note: month is 0-indexed in JS Date
    const date = new Date(year, parseInt(month) - 1, parseInt(day), parseInt(hour), 0, 0);

    // Handle year rollover precaution? E.g. if we are in Dec and booking for Jan?
    // For now assuming current year as per standard requesting logic.

    return date.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Parse values
      const totalValueFloat = parseCurrency(formData.totalValue);
      const pickupDateISO = parsePickupDate(formData.pickupDate);

      // Log for debugging
      console.log('Original Total Value:', formData.totalValue);
      console.log('Parsed Float:', totalValueFloat);
      console.log('Parsed ISO Date:', pickupDateISO);

      if (isNaN(totalValueFloat) || totalValueFloat === 0) {
        // Allow 0? Assuming order must have value.
        if (totalValueFloat < 0) {
          alert('Valor total inválido.');
          setLoading(false);
          return;
        }
      }

      if (!pickupDateISO) {
        alert('Formato da Data de Retirada inválido. Use o formato: "DD/MM às HHh" (ex: 21/01 às 9h)');
        setLoading(false);
        return;
      }

      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const orderNumber = `#EMP-${Math.floor(1000 + Math.random() * 9000)}`;

      // Ensure we send a NUMBER. 
      // User reported "177,00" -> "17700". This usually happens if comma is ignored.
      // With our parseCurrency, "177,00" -> 177.00.

      const { data, error } = await supabase
        .from('orders')
        .insert([{
          order_number: orderNumber,
          customer_name: formData.customerName,
          phone: formData.phone,
          items_summary: formData.items,
          total_value: totalValueFloat,
          delivery_type: formData.deliveryType,
          pickup_date: pickupDateISO,
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
        <div className="flex items-center p-4 px-4 md:px-8 justify-between w-full">
          <button onClick={() => navigate(-1)} className="text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors md:hidden">
            <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
          </button>
          <h2 className="text-white text-xl md:text-2xl font-bold leading-tight tracking-tight flex-1 md:text-left text-center">Novo Pedido</h2>
          <div className="size-10 md:hidden"></div>
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
                onChange={handlePickupDateChange}
                className="form-input block w-full rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary border border-[#326732] bg-[#193319] h-14 px-4 transition-all"
                type="text"
                placeholder="Ex: 21/01 às 9h"
                required
              />
              <p className="text-xs text-[#92c992] mt-1 ml-1">Formato: DD/MM às HHh</p>
            </label>

            <label className="flex flex-col w-full">
              <p className="text-white text-sm font-medium pb-2">Valor Total</p>
              <div className="relative flex items-center">
                {/* Removed fixed prefix since it's part of the input value now */}
                <input
                  value={formData.totalValue}
                  onChange={handleTotalValueChange}
                  className="form-input block w-full rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary border border-[#326732] bg-[#193319] h-14 px-4 text-lg font-semibold text-right transition-all"
                  placeholder="R$ 0,00"
                  type="text"
                  required
                />
              </div>
            </label>
          </div>

          <div className="mt-8 mb-32 md:mb-8">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full max-w-md mx-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 transition-transform active:scale-[0.98] shadow-[0_0_15px_rgba(19,236,19,0.3)] disabled:opacity-50"
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
        </form>
      </main>
    </PageLayout>
  );
};

export default NewOrder;
