import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import { supabase } from '../supabase';
import { Order, OrderStatus } from '../types';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<OrderStatus | 'Todos'>('Todos');
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();

    // Atualização automática a cada 60 segundos (simulando F5 nos dados)
    const interval = setInterval(() => {
      fetchOrders();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      if (!supabase) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedOrders: Order[] = data.map((o: any) => ({
          id: o.id,
          orderNumber: o.order_number,
          customerName: o.customer_name,
          customerAvatar: o.customer_avatar,
          phone: o.phone,
          address: o.address,
          status: o.status as OrderStatus,
          createdAt: o.created_at,
          itemsSummary: o.items_summary,
          totalValue: o.total_value,
          deliveryType: o.delivery_type as 'Retirada' | 'Entrega',
          pickupDate: o.pickup_date,
          pickedUpBy: o.picked_up_by,
          pickedUpAt: o.picked_up_at,
          deliveredBy: o.delivered_by,
        }));
        setOrders(mappedOrders);
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'Todos' || order.status === filter;
    const matchesSearch = order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 60) return `${diffInMins}m atrás`;
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    return `${diffInDays}d atrás`;
  };

  return (
    <PageLayout>
      <PageHeader>
        <div className="flex items-center p-4 justify-between">
          <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Lista de Pedidos</h2>
          <button
            onClick={() => navigate('/new-order')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-black transition hover:bg-green-400"
          >
            <span className="material-symbols-outlined font-bold">add</span>
          </button>
        </div>

        <div className="flex gap-3 px-4 pb-2">
          <label className="relative flex flex-1 flex-col">
            <div className="relative flex w-full items-center rounded-xl bg-surface-dark border border-white/5 h-12 overflow-hidden focus-within:ring-1 focus-within:ring-primary/50 transition-all">
              <div className="flex items-center justify-center pl-4 text-gray-400">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex h-full w-full flex-1 bg-transparent px-3 text-base text-white placeholder:text-gray-500 focus:outline-none"
                placeholder="Buscar por cliente ou pedido..."
              />
            </div>
          </label>
          <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-dark border border-white/5 text-gray-400 hover:text-white transition active:scale-95">
            <span className="material-symbols-outlined">picture_as_pdf</span>
          </button>
        </div>

        <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar w-full">
          {['Todos', ...Object.values(OrderStatus)].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`flex h-9 min-w-fit items-center justify-center gap-x-2 rounded-full px-4 transition border ${filter === f
                ? (f === 'Todos' ? 'bg-primary border-primary text-black' :
                  f === OrderStatus.PENDING ? 'bg-yellow-500 border-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.2)]' :
                    f === OrderStatus.PRODUCTION ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]' :
                      f === OrderStatus.COMPLETED ? 'bg-green-500 border-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.2)]' :
                        f === OrderStatus.DELIVERED ? 'bg-white border-white text-black shadow-[0_0_10px_rgba(255,255,255,0.2)]' :
                          'bg-red-500 border-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.2)]') + ' font-bold'
                : 'bg-surface-dark border-white/10 text-gray-300 font-medium hover:bg-white/5'
                }`}
            >
              <span className="text-sm">{f}</span>
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {loading ? (
          <div className="flex justify-center py-20 col-span-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/order/${order.id}`)}
              className="group relative flex flex-col gap-3 rounded-2xl bg-surface-dark p-4 border border-white/5 hover:border-primary/30 active:bg-white/5 transition cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div
                    className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-700 bg-cover bg-center"
                    style={{ backgroundImage: `url("${order.customerAvatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}")` }}
                  />
                  <div className="flex flex-col">
                    <h3 className="text-base font-bold text-white leading-tight">{order.customerName}</h3>
                    <span className={`text-xs font-medium mt-0.5 ${order.status === OrderStatus.PENDING ? 'text-yellow-400' :
                      order.status === OrderStatus.PRODUCTION ? 'text-blue-400' :
                        order.status === OrderStatus.COMPLETED ? 'text-green-400' :
                          order.status === OrderStatus.DELIVERED ? 'text-white' :
                            'text-red-400'
                      }`}>{order.status}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-bold text-primary">R$ {Number(order.totalValue).toFixed(2)}</span>
                  <span className="text-xs text-gray-400">{order.orderNumber}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
                <p className="text-sm text-gray-300 line-clamp-1">{order.itemsSummary}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    <span>Dt Pedido: {new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary/80">
                    <span className="material-symbols-outlined text-[14px]">shopping_bag</span>
                    <span>Dt Retirada: {new Date(order.pickupDate).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-gray-500">chevron_right</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-2">
            <span className="material-symbols-outlined text-5xl">search_off</span>
            <p>Nenhum pedido encontrado</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Orders;
