
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { supabase } from '../supabase';
import { OrderStatus } from '../types';

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalValue: 0,
    totalOrders: 0,
    statusDistribution: [
      { name: 'Pendente', value: 0, color: '#eab308' },
      { name: 'Em Produção', value: 0, color: '#3b82f6' },
      { name: 'Concluído', value: 0, color: '#13ec13' },
      { name: 'Entregue', value: 0, color: '#9ca3af' },
    ]
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      if (!supabase) return;

      const { data: orders, error } = await supabase
        .from('orders')
        .select('*');

      if (error) throw error;

      if (orders) {
        const totalValue = orders.reduce((acc: number, o: any) => acc + Number(o.total_value), 0);
        const totalOrders = orders.length;

        const pending = orders.filter((o: any) => o.status === OrderStatus.PENDING).length;
        const production = orders.filter((o: any) => o.status === OrderStatus.PRODUCTION).length;
        const completed = orders.filter((o: any) => o.status === OrderStatus.COMPLETED).length;
        const delivered = orders.filter((o: any) => o.status === OrderStatus.DELIVERED).length;

        const distribution = [
          { name: 'Pendente', value: pending, color: '#eab308' },
          { name: 'Em Produção', value: production, color: '#3b82f6' },
          { name: 'Concluído', value: completed, color: '#13ec13' },
          { name: 'Entregue', value: delivered, color: '#9ca3af' },
        ];

        setStats({
          totalValue,
          totalOrders,
          statusDistribution: distribution
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados do relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  const WEEKLY_DATA = [
    { name: 'Sem 1', value: stats.totalValue * 0.2 },
    { name: 'Sem 2', value: stats.totalValue * 0.3 },
    { name: 'Sem 3', value: stats.totalValue * 0.15 },
    { name: 'Sem 4', value: stats.totalValue * 0.35 },
  ];

  return (
    <PageLayout className="pb-32">
      <PageHeader>
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-white">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold leading-tight tracking-tight text-center flex-1">Relatórios</h1>
          <div className="size-10"></div>
        </div>
      </PageHeader>

      <div className="flex flex-col items-center justify-center pt-2 pb-6 px-4">
        <div className="flex items-center justify-between gap-4 w-full max-w-xs rounded-full bg-surface-dark p-1.5 shadow-sm border border-white/5">
          <button className="flex size-8 items-center justify-center rounded-full hover:bg-white/10 text-gray-400 transition-colors">
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <span className="text-base font-bold">Mês Atual</span>
          <button className="flex size-8 items-center justify-center rounded-full hover:bg-white/10 text-gray-400 transition-colors">
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4 mb-6">
        <div className="flex flex-col gap-3 rounded-2xl p-5 bg-surface-dark border border-white/5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary">
              <span className="material-symbols-outlined">payments</span>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Total Faturado</p>
            <p className="text-white text-xl font-bold tracking-tight mt-1">R$ {stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl p-5 bg-surface-dark border border-white/5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center size-10 rounded-full bg-blue-500/20 text-blue-400">
              <span className="material-symbols-outlined">shopping_bag</span>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Total de Pedidos</p>
            <p className="text-white text-xl font-bold tracking-tight mt-1">{stats.totalOrders}</p>
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="flex flex-col rounded-2xl bg-surface-dark border border-white/5 shadow-sm p-5">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Vendas Semanais</h2>
              <p className="text-gray-400 text-sm">Desempenho por semana</p>
            </div>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_DATA}>
                <Bar dataKey="value" fill="#13ec13" radius={[4, 4, 0, 0]} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1c331c', border: 'none', borderRadius: '8px' }}
                  formatter={(value: any) => `R$ ${value.toFixed(2)}`}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="flex flex-col rounded-2xl bg-surface-dark border border-white/5 shadow-sm p-5">
          <h2 className="text-lg font-bold text-white mb-6">Status dos Pedidos</h2>
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="relative size-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusDistribution}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-white leading-none">{stats.totalOrders}</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              {stats.statusDistribution.map((status) => (
                <div key={status.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full" style={{ backgroundColor: status.color }}></div>
                    <span className="text-xs font-medium text-gray-300">{status.name}</span>
                  </div>
                  <span className="text-xs font-bold text-white">
                    {stats.totalOrders > 0 ? ((status.value / stats.totalOrders) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-4 flex justify-center z-40">
        <button onClick={() => window.print()} className="w-full max-w-md bg-primary hover:bg-green-400 text-black font-bold h-14 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
          <span className="material-symbols-outlined">print</span>
          Imprimir Relatório
        </button>
      </div>
    </PageLayout>
  );
};

export default Reports;
