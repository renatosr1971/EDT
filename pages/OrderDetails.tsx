
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
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

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
          cancellationReason: data.cancellation_reason,
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

  const updateStatus = async (newStatus: OrderStatus, reason?: string) => {
    if (order?.status === newStatus || updatingStatus) return;

    try {
      setUpdatingStatus(newStatus);
      if (!supabase || !id) return;

      const updateData: any = { status: newStatus };
      if (newStatus === OrderStatus.CANCELLED && reason) {
        updateData.cancellation_reason = reason;
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      setOrder(prev => prev ? { ...prev, status: newStatus, cancellationReason: reason || prev.cancellationReason } : null);
      setShowCancelModal(false);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Não foi possível atualizar o status. Tente novamente.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleStatusClick = (status: OrderStatus) => {
    if (status === OrderStatus.CANCELLED) {
      setShowCancelModal(true);
    } else {
      updateStatus(status);
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
        <div className="flex items-center p-4 px-4 md:px-8 justify-between w-full">
          <button onClick={() => navigate(-1)} className="text-white hover:text-primary transition-colors flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 md:hidden">
            <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
          </button>
          <h2 className="text-white text-xl md:text-2xl font-bold leading-tight tracking-tight flex-1 md:text-left text-center">Pedido {order.orderNumber}</h2>
          <div className="size-10 md:hidden"></div>
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
              {Object.values(OrderStatus).map((status) => {
                const statusOrder = [OrderStatus.PENDING, OrderStatus.PRODUCTION, OrderStatus.COMPLETED, OrderStatus.DELIVERED];
                const currentIndex = statusOrder.indexOf(order.status as OrderStatus);
                const buttonIndex = statusOrder.indexOf(status);
                const isPreviousStatus = currentIndex !== -1 && buttonIndex !== -1 && buttonIndex < currentIndex;
                const isCancelled = order.status === OrderStatus.CANCELLED;

                return (
                  <button
                    key={status}
                    disabled={!!updatingStatus || isCancelled || isPreviousStatus}
                    onClick={() => handleStatusClick(status)}
                    className={`flex-1 min-w-[80px] flex flex-col items-center justify-center py-2 px-2 rounded-lg text-xs font-medium transition-all
                    ${order.status === status
                        ? (status === OrderStatus.PENDING ? 'bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.3)]' :
                          status === OrderStatus.PRODUCTION ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' :
                            status === OrderStatus.COMPLETED ? 'bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]' :
                              status === OrderStatus.DELIVERED ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.3)]' :
                                'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]')
                        : 'text-gray-400 hover:bg-white/5'
                      }
                    ${updatingStatus === status ? 'animate-pulse opacity-70' : ''}
                    disabled:cursor-wait
                    ${order.status === OrderStatus.CANCELLED && order.status !== status ? 'opacity-30' : ''}
                  `}
                  >
                    <span className="material-symbols-outlined text-xl mb-1">
                      {status === OrderStatus.PENDING ? 'hourglass_empty' :
                        status === OrderStatus.PRODUCTION ? 'skillet' :
                          status === OrderStatus.COMPLETED ? 'check_circle' :
                            status === OrderStatus.CANCELLED ? 'cancel' : 'local_shipping'}
                    </span>
                    <span className="truncate w-full text-center">{status}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {order.status === OrderStatus.CANCELLED && order.cancellationReason && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-1 text-red-500">
                <span className="material-symbols-outlined text-sm">info</span>
                <span className="text-xs font-bold uppercase tracking-wider">Motivo do Cancelamento</span>
              </div>
              <p className="text-sm text-gray-300 italic">"{order.cancellationReason}"</p>
            </div>
          )}
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
            <div className="flex flex-col items-end gap-1">
              <a href={`tel:${order.phone}`} className="size-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">call</span>
              </a>
              <span className="text-[10px] text-gray-500 font-bold">{order.phone}</span>
            </div>
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

        <div className="mt-4 mb-32 md:mb-10 w-full max-w-md mx-auto">
          <button
            onClick={() => window.print()}
            className="w-full bg-primary hover:bg-[#0fd60f] text-black font-bold py-4 px-6 rounded-xl shadow-[0_0_15px_rgba(19,236,19,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">print</span>
            Imprimir Comanda
          </button>
        </div>
      </main>

      {/* Modal de Cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}></div>
          <div className="relative bg-surface-dark border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-white font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">cancel</span>
                Cancelar Pedido
              </h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-500 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-5">
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Por favor, informe o motivo do cancelamento. Este campo é <span className="text-red-500 font-bold uppercase">obrigatório</span>.
              </p>

              <textarea
                autoFocus
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ex: Cliente desistiu do pedido..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all resize-none placeholder:text-gray-600"
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/5 text-gray-400 font-bold text-sm hover:bg-white/5 transition-all"
                >
                  Voltar
                </button>
                <button
                  disabled={!cancelReason.trim() || !!updatingStatus}
                  onClick={() => updateStatus(OrderStatus.CANCELLED, cancelReason)}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                    ${cancelReason.trim()
                      ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_4px_15px_rgba(239,68,68,0.2)]'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {updatingStatus ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  ) : (
                    'Confirmar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default OrderDetails;
