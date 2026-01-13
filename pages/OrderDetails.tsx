
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import { supabase } from '../supabase';
import { Order, OrderStatus } from '../types';

const OrderDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const [updatingStatus, setUpdatingStatus] = useState<OrderStatus | null>(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      if (!supabase || !id) return;

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        const mappedOrder: Order = {
          id: data.id,
          orderNumber: data.order_number,
          customerName: data.customer_name,
          customerAvatar: data.customer_avatar,
          phone: data.phone,
          address: data.address,
          status: data.status as OrderStatus,
          createdAt: data.created_at,
          itemsSummary: data.items_summary,
          totalValue: data.total_value,
          deliveryType: data.delivery_type as 'Retirada' | 'Entrega',
          pickupDate: data.pickup_date,
          items: data.order_items.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.image_url
          }))
        };
        setOrder(mappedOrder);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: OrderStatus) => {
    if (order?.status === newStatus || updatingStatus) return;

    try {
      setUpdatingStatus(newStatus);
      if (!supabase || !id) return;

      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Não foi possível atualizar o status. Tente novamente.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <PageLayout className="items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </PageLayout>
    );
  }

  if (!order) {
    return (
      <PageLayout className="items-center justify-center p-4">
        <p className="text-white mb-4">Pedido não encontrado</p>
        <button onClick={() => navigate('/orders')} className="text-primary font-bold">Voltar para pedidos</button>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader>
        <div className="flex items-center p-4 justify-between w-full">
          <button onClick={() => navigate(-1)} className="text-white hover:text-primary transition-colors flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10">
            <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
          </button>
          <h2 className="text-white text-lg font-bold leading-tight tracking-tight text-center">Pedido {order.orderNumber}</h2>
          <div className="size-10"></div>
        </div>
      </PageHeader>

      <main className="flex-1 flex flex-col gap-6 p-4 w-full">
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-white text-sm uppercase tracking-wider font-bold opacity-70">Status do Pedido</h3>
            {updatingStatus && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-primary"></div>
                <span className="text-[10px] text-primary font-bold uppercase">Atualizando...</span>
              </div>
            )}
          </div>
          <div className="bg-surface-dark rounded-xl p-1.5 shadow-sm border border-white/5">
            <div className="flex p-1 gap-1 overflow-x-auto no-scrollbar">
              {Object.values(OrderStatus).map((status) => (
                <button
                  key={status}
                  disabled={!!updatingStatus}
                  onClick={() => updateStatus(status)}
                  className={`flex-1 min-w-[80px] flex flex-col items-center justify-center py-2 px-2 rounded-lg text-xs font-medium transition-all
                    ${order.status === status
                      ? 'bg-primary text-black shadow-[0_0_10px_rgba(19,236,19,0.3)]'
                      : 'text-gray-400 hover:bg-white/5'
                    }
                    ${updatingStatus === status ? 'animate-pulse opacity-70' : ''}
                    disabled:cursor-wait
                  `}
                >
                  <span className="material-symbols-outlined text-xl mb-1">
                    {status === OrderStatus.PENDING ? 'hourglass_empty' :
                      status === OrderStatus.PRODUCTION ? 'skillet' :
                        status === OrderStatus.COMPLETED ? 'check_circle' : 'local_shipping'}
                  </span>
                  <span className="truncate w-full text-center">{status}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-500 text-sm">notifications_active</span>
              <span className="text-xs text-gray-400 font-medium">Notificar gerente por e-mail</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input defaultChecked className="sr-only peer" type="checkbox" />
              <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </section>

        <section className="bg-surface-dark rounded-xl shadow-sm border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className="bg-center bg-no-repeat bg-cover rounded-full h-12 w-12 border-2 border-primary"
                  style={{ backgroundImage: `url("${order.customerAvatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}")` }}
                />
                <div className="absolute -bottom-1 -right-1 bg-background-dark p-0.5 rounded-full">
                  <div className="bg-primary size-3 rounded-full border-2 border-background-dark"></div>
                </div>
              </div>
              <div>
                <h4 className="text-white text-base font-bold leading-tight">{order.customerName}</h4>
                <div className="flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-gray-400 text-[14px]">event</span>
                  <p className="text-gray-400 text-xs font-medium">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')} • {order.deliveryType} • {order.deliveryType === 'Retirada' ? 'Retirada' : 'Entrega'}: {new Date(order.pickupDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
            <a href={`tel:${order.phone}`} className="size-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined">call</span>
            </a>
          </div>
          <div className="p-4 bg-white/5 flex items-start gap-3">
            <span className="material-symbols-outlined text-gray-400 mt-0.5 shrink-0 text-[18px]">location_on</span>
            <p className="text-sm text-gray-300 leading-snug">
              {order.address || 'Endereço não informado'}<br />
              {order.address && <span className="text-xs text-gray-500">Localização do cliente</span>}
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-white text-sm uppercase tracking-wider font-bold mb-3 px-1 opacity-70">Itens do Pedido</h3>
          <div className="flex flex-col gap-3">
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-surface-dark rounded-xl shadow-sm border border-white/5 items-center">
                  <div
                    className="bg-white/10 rounded-lg h-16 w-16 shrink-0 bg-center bg-cover"
                    style={{ backgroundImage: `url("${item.imageUrl || 'https://placehold.co/100x100/193319/FFFFFF?text=Item'}")` }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-sm truncate">{item.name}</h4>
                    <p className="text-gray-400 text-xs mt-0.5">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-sm">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-gray-500 text-xs">{item.quantity}x R$ {item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-surface-dark rounded-xl border border-white/5">
                <p className="text-sm text-gray-300">{order.itemsSummary || 'Nenhum detalhe de itens informado.'}</p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-2">
          <div className="bg-surface-dark rounded-xl p-4 shadow-sm border border-white/5 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white font-medium">R$ {Number(order.totalValue).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Taxa de Entrega</span>
              <span className="text-primary font-medium">Grátis</span>
            </div>
            <div className="h-px bg-white/10 w-full my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-white font-bold text-base">Total</span>
              <span className="text-primary font-bold text-2xl">R$ {Number(order.totalValue).toFixed(2)}</span>
            </div>
          </div>
        </section>

        <button
          onClick={() => window.print()}
          className="w-full bg-primary hover:bg-[#0fd60f] text-black font-bold py-4 px-6 rounded-xl shadow-[0_0_15px_rgba(19,236,19,0.2)] transition-all active:scale-[0.98] mt-2 mb-10 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">print</span>
          Imprimir Comanda
        </button>
      </main>
    </PageLayout>
  );
};

export default OrderDetails;
