import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

interface Profile {
    id: string;
    full_name: string;
    email: string;
    role: string;
    avatar_url?: string;
    created_at: string;
}

const Users: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        role: 'user'
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchCurrentUser();
        fetchProfiles();
    }, []);

    const fetchCurrentUser = async () => {
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setCurrentUserId(user.id);
    };

    const fetchProfiles = async () => {
        try {
            setLoading(true);
            if (!supabase) return;
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProfiles(data || []);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (profile?: Profile) => {
        if (profile) {
            setEditingProfile(profile);
            setFormData({
                full_name: profile.full_name || '',
                email: profile.email,
                role: profile.role
            });
        } else {
            setEditingProfile(null);
            setFormData({
                full_name: '',
                email: '',
                role: 'user'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) return;

        try {
            if (editingProfile) {
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        full_name: formData.full_name,
                        role: formData.role
                    })
                    .eq('id', editingProfile.id);

                if (error) throw error;
            } else {
                // Create user logic is complex via client side without Edge Functions
                // For now, we will notify that new users should be created via Auth signup
                alert('Para criar um novo usuário com acesso, ele deve se cadastrar no sistema. Aqui você pode gerenciar os perfis existentes.');
            }
            setIsModalOpen(false);
            fetchProfiles();
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar alterações.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja remover este usuário?')) return;
        if (!supabase) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchProfiles();
        } catch (error) {
            console.error('Erro ao deletar:', error);
        }
    };

    const filteredProfiles = profiles.filter(p =>
        p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <PageLayout>
            <PageHeader>
                <div className="flex items-center p-4 justify-between">
                    <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">Gestão de Usuários</h2>
                    {profiles.find(p => p.id === currentUserId)?.role === 'admin' && (
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-black transition hover:bg-green-400"
                        >
                            <span className="material-symbols-outlined font-bold">person_add</span>
                        </button>
                    )}
                </div>

                <div className="px-4 pb-4">
                    <label className="relative flex flex-col">
                        <div className="relative flex w-full items-center rounded-xl bg-surface-dark border border-white/5 h-12 overflow-hidden focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                            <div className="flex items-center justify-center pl-4 text-gray-400">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex h-full w-full flex-1 bg-transparent px-3 text-base text-white placeholder:text-gray-500 focus:outline-none"
                                placeholder="Buscar por nome ou e-mail..."
                            />
                        </div>
                    </label>
                </div>
            </PageHeader>

            <div className="p-4 flex flex-col gap-4">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : filteredProfiles.length > 0 ? (
                    filteredProfiles.map((profile) => (
                        <div key={profile.id} className="bg-surface-dark rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div
                                    className="h-12 w-12 rounded-full bg-gray-700 bg-cover bg-center ring-2 ring-primary/20"
                                    style={{ backgroundImage: `url("${profile.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}")` }}
                                />
                                <div className="flex flex-col">
                                    <h3 className="text-white font-bold">{profile.full_name || 'Usuário sem nome'}</h3>
                                    <p className="text-gray-500 text-xs">{profile.email}</p>
                                    <span className={`text-[10px] font-bold uppercase mt-1 px-2 py-0.5 rounded-full w-fit ${profile.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-gray-800 text-gray-400'}`}>
                                        {profile.role}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleOpenModal(profile)}
                                    className="p-2 text-gray-400 hover:text-primary transition"
                                >
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(profile.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition"
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <span className="material-symbols-outlined text-5xl mb-2">group_off</span>
                        <p>Nenhum usuário encontrado</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-surface-dark w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-white/5">
                            <h3 className="text-xl font-bold text-white">{editingProfile ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase px-2">Nome Completo</label>
                                <input
                                    required
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full bg-background-dark border border-white/5 rounded-xl h-12 px-4 text-white focus:ring-1 focus:ring-primary/50 outline-none mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase px-2">E-mail</label>
                                <input
                                    disabled={!!editingProfile}
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-background-dark border border-white/5 rounded-xl h-12 px-4 text-white focus:ring-1 focus:ring-primary/50 outline-none mt-1 disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase px-2 font-display">Nível de Acesso</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-background-dark border border-white/5 rounded-xl h-12 px-4 text-white focus:ring-1 focus:ring-primary/50 outline-none mt-1 appearance-none"
                                >
                                    <option value="user">Usuário Comum</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 h-12 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 h-12 rounded-xl bg-primary text-black font-bold hover:bg-green-400 transition"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PageLayout>
    );
};

export default Users;
