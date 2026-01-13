
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import { supabase } from '../supabase';
import { Order, OrderStatus } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    production: 0,
    completed: 0,
    delivered: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      if (!supabase) return;

      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (orders) {
        const counts = {
          pending: orders.filter((o: any) => o.status === OrderStatus.PENDING).length,
          production: orders.filter((o: any) => o.status === OrderStatus.PRODUCTION).length,
          completed: orders.filter((o: any) => o.status === OrderStatus.COMPLETED).length,
          delivered: orders.filter((o: any) => o.status === OrderStatus.DELIVERED).length,
        };
        setStats(counts);

        const mappedRecent = orders.slice(0, 3).map((o: any) => ({
          id: o.id,
          orderNumber: o.order_number,
          customerName: o.customer_name,
          customerAvatar: o.customer_avatar,
          status: o.status as OrderStatus,
          createdAt: o.created_at,
          itemsSummary: o.items_summary,
          totalValue: o.total_value,
          deliveryType: o.delivery_type as 'Retirada' | 'Entrega',
          pickupDate: o.pickup_date,
        }));
        setRecentOrders(mappedRecent);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInMins < 60) return `${diffInMins}m atrás`;
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    return past.toLocaleDateString('pt-BR');
  };

  return (
    <PageLayout>
      <PageHeader>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/50"
                style={{ backgroundImage: `url("https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y")` }}
              />
              <div className="absolute bottom-0 right-0 size-3 bg-primary rounded-full border-2 border-background-dark"></div>
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight tracking-tight text-white">Encomendas Empório</h2>
              <p className="text-xs font-medium text-gray-400">Bem-vinda de volta</p>
            </div>
          </div>
          <button className="relative flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-white">notifications</span>
            {stats.pending > 0 && (
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-background-dark"></span>
            )}
          </button>
        </div>
      </PageHeader>

      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-3 rounded-xl p-5 bg-surface-card shadow-sm border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-4xl">pending_actions</span>
            </div>
            <div className="size-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
              <span className="material-symbols-outlined text-lg">hourglass_empty</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Pendentes</p>
              <p className="text-white tracking-tight text-3xl font-bold">{stats.pending}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl p-5 bg-surface-card shadow-sm border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-4xl">soup_kitchen</span>
            </div>
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-lg">skillet</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Em Produção</p>
              <p className="text-primary tracking-tight text-3xl font-bold">{stats.production}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl p-5 bg-surface-card shadow-sm border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <div className="size-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <span className="material-symbols-outlined text-lg">inventory_2</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Concluídos</p>
              <p className="text-white tracking-tight text-3xl font-bold">{stats.completed}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl p-5 bg-surface-card shadow-sm border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-4xl">local_shipping</span>
            </div>
            <div className="size-8 rounded-full bg-white/10 flex items-center justify-center text-gray-300">
              <span className="material-symbols-outlined text-lg">done_all</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Entregues</p>
              <p className="text-white tracking-tight text-3xl font-bold">{stats.delivered}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col pb-6">
        <div className="flex items-center justify-between px-4 pb-3">
          <h2 className="text-white tracking-tight text-[22px] font-bold">Pedidos Recentes</h2>
          <button onClick={() => navigate('/orders')} className="text-sm font-bold text-primary hover:text-green-400 transition-colors">Ver Todos</button>
        </div>

        <div className="flex flex-col gap-4 px-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/order/${order.id}`)}
                className="flex flex-col sm:flex-row items-stretch gap-4 rounded-xl bg-surface-card p-4 shadow-sm border border-white/5 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className="flex flex-col gap-4 flex-1">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${order.status === OrderStatus.PENDING ? 'bg-orange-500/20 text-orange-400' :
                        order.status === OrderStatus.PRODUCTION ? 'bg-primary/20 text-primary' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                        <span className={`size-1.5 rounded-full ${order.status === OrderStatus.PENDING ? 'bg-orange-500' :
                          order.status === OrderStatus.PRODUCTION ? 'bg-primary animate-pulse' :
                            'bg-blue-500'
                          }`} /> {order.status}
                      </span>
                      <span className="text-xs font-medium text-gray-500">{order.orderNumber} • {getRelativeTime(order.createdAt)}</span>
                    </div>
                    <p className="text-white text-lg font-bold leading-tight">{order.customerName}</p>
                    <p className="text-[#92c992] text-sm font-normal leading-normal line-clamp-1">{order.itemsSummary}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-auto">
                    <button className="flex-1 items-center justify-center overflow-hidden rounded-lg h-9 bg-white/10 hover:bg-white/20 text-white text-sm font-medium leading-normal transition-colors flex gap-2">
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                      <span>Detalhes</span>
                    </button>
                    <a href={`tel:${order.phone}`} className="size-9 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
                      <span className="material-symbols-outlined text-[18px]">call</span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-10">Nenhum pedido recente.</p>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
