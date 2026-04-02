import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Calculator,
  Settings as SettingsIcon,
  TrendingUp,
  Clock,
  Fuel,
  MapPin,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Target,
  User as UserIcon,
  Camera,
  History,
  Save,
  CheckCircle
} from 'lucide-react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn, type DashboardStats, type Settings, type DailyRecord, type User, type Ride } from './types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { checkSupabaseConnection, supabase } from './lib/supabase';
import { supabaseService } from './lib/supabaseService';
import { getSubscriptionStatus } from './lib/subscription';
import { UpgradePrompt } from './components/UpgradePrompt';
import { SubscriptionSuccess, SubscriptionCancel } from './components/SubscriptionFeedback';
import logo from './assets/logo.png';

// --- Components ---

const SupabaseStatus = () => {
  const [status, setStatus] = useState<{ connected: boolean; error?: string } | null>(null);

  useEffect(() => {
    checkSupabaseConnection().then(setStatus);
  }, []);

  if (!status) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border cursor-help",
        status.connected
          ? "bg-profit/10 text-profit border-profit/20"
          : "bg-alert/10 text-alert border-alert/20"
      )}
      title={status.error}
    >
      <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", status.connected ? "bg-profit" : "bg-alert")} />
      {status.connected ? "SUPABASE CONECTADO" : (status.error || "ERRO SUPABASE")}
    </div>
  );
};

const Card = ({ children, className, title }: { children: React.ReactNode, className?: string, title?: string }) => (
  <div className={cn("glass rounded-2xl p-5", className)}>
    {title && <h3 className="text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">{title}</h3>}
    {children}
  </div>
);

const StatCard = ({ label, value, icon: Icon, colorClass, subValue }: { label: string, value: string, icon: any, colorClass?: string, subValue?: string }) => (
  <Card className="flex flex-col gap-1">
    <div className="flex justify-between items-start">
      <span className="text-xs font-medium text-white/40 uppercase tracking-tight">{label}</span>
      <div className={cn("p-2 rounded-lg bg-white/5", colorClass)}>
        <Icon size={16} />
      </div>
    </div>
    <div className="mt-2">
      <span className="text-2xl font-bold tracking-tight">{value}</span>
      {subValue && <p className="text-xs text-white/40 mt-1">{subValue}</p>}
    </div>
  </Card>
);

// --- Pages ---

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#132d24_0%,_#0a0a0a_100%)] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-profit/10 text-profit text-xs font-bold mb-6 border border-profit/20">
          <TrendingUp size={14} />
          NOVO: AVALIADOR DE CORRIDAS
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 leading-tight max-w-2xl mx-auto">
          Descubra se vale a pena cada corrida e aumente seus ganhos como <span className="text-profit">motorista de app</span>
        </h1>
        <p className="text-lg text-white/60 mb-10 max-w-lg mx-auto">
          Pare de perder dinheiro. Use dados reais pra decidir quando rodar e quais corridas aceitar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register-account"
            className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all shadow-xl shadow-white/5"
          >
            Testar grátis agora
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
          >
            Fazer Login
          </Link>
        </div>

        <div className="mt-8 text-xs text-white/30 flex items-center justify-center gap-2">
          <CheckCircle size={14} className="text-profit" />
          Criado por motorista que entende a realidade das corridas
        </div>
      </motion.div>

      <div className="mt-20 max-w-lg mx-auto text-left w-full">
        <Card className="border-profit/10 bg-profit/[0.02]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            🔥 Para quem é o DriverHub?
          </h2>
          <ul className="space-y-4">
            {[
              "Motoristas da Uber e 99",
              "Quem quer aumentar o lucro",
              "Quem não sabe se está ganhando ou perdendo dinheiro"
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-profit/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-profit" />
                </div>
                <span className="text-sm md:text-base">{text}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {[
          { title: "Lucro Real", desc: "Cálculo automático descontando combustível e taxas." },
          { title: "Ganho por Hora", desc: "Saiba se seu tempo está sendo bem recompensado." },
          { title: "Meta Inteligente", desc: "Acompanhe seu progresso mensal em tempo real." }
        ].map((item, i) => (
          <div key={i}>
            <Card className="text-left">
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm">{item.desc}</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabaseService.signIn(email, password);

    if (error) {
      setError(error.message);
    } else if (data.user) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#132d24_0%,_#0a0a0a_100%)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-profit rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-profit/20 overflow-hidden">
            <img src={logo} className="w-12 h-12 object-contain" alt="Logo" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo de volta</h1>
          <p className="text-white/40 mt-2">Entre na sua conta DriverHUB</p>
        </div>

        <Card className="space-y-6">
          {error && (
            <div className="p-3 bg-alert/10 border border-alert/20 rounded-xl text-alert text-sm text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-white/40 uppercase font-bold">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-profit transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/40 uppercase font-bold">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-profit transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-profit text-black font-bold rounded-xl hover:bg-profit/90 transition-all shadow-lg shadow-profit/10 disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-white/20">Ou continue com</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" referrerPolicy="no-referrer" />
            Google
          </button>
        </Card>

        <p className="text-center mt-8 text-sm text-white/40">
          Não tem uma conta? <Link to="/register-account" className="text-profit hover:underline font-bold">Comece seu teste grátis</Link>
        </p>
      </motion.div>
    </div>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    setLoading(true);
    setError('');

    const { data, error } = await supabaseService.signUp(
      formData.email,
      formData.password,
      formData.name
    );

    if (error) {
      setError(error.message);
    } else if (data.user) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#132d24_0%,_#0a0a0a_100%)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-profit rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-profit/20 overflow-hidden">
            <img src={logo} className="w-12 h-12 object-contain" alt="Logo" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Criar sua conta</h1>
          <p className="text-white/40 mt-2">Inicie seu teste grátis de 7 dias</p>
        </div>

        <Card className="space-y-6">
          {error && (
            <div className="p-3 bg-alert/10 border border-alert/20 rounded-xl text-alert text-sm text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-white/40 uppercase font-bold">Nome Completo</label>
              <input
                type="text"
                placeholder="Seu nome"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-profit transition-all"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/40 uppercase font-bold">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-profit transition-all"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-white/40 uppercase font-bold">Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-profit transition-all"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/40 uppercase font-bold">Confirmar</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-profit transition-all"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-profit text-black font-bold rounded-xl hover:bg-profit/90 transition-all shadow-lg shadow-profit/10 disabled:opacity-50"
            >
              {loading ? "Criando conta..." : "Criar Conta e Iniciar Teste"}
            </button>
          </form>

        </Card>

        <p className="text-center mt-8 text-sm text-white/40">
          Já tem uma conta? <Link to="/login" className="text-profit hover:underline font-bold">Fazer Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [dailyGoalInput, setDailyGoalInput] = useState('');
  const [savingGoal, setSavingGoal] = useState(false);
  const [customDailyGoal, setCustomDailyGoal] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const fetchDashboardData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      setUser(userData);

      const today = new Date().toISOString().split('T')[0];

      const [
        { data: todayStats },
        { data: weeklyStats },
        { data: settingsData },
        { data: recentRidesData },
        { data: goalData }
      ] = await Promise.all([
        supabase.from('daily_records').select('*').eq('user_id', user.id).eq('date', today).maybeSingle(),
        supabase.from('daily_records').select('date, profit, hours').eq('user_id', user.id).gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()).order('date', { ascending: true }),
        supabase.from('settings').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('rides').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(5),
        supabase.from('daily_goals').select('goal_value').eq('user_id', user.id).eq('date', today).maybeSingle()
      ]);

      const weeklySummary = weeklyStats?.reduce((acc, curr) => ({
        totalProfit: acc.totalProfit + Number(curr.profit || 0),
        totalHours: acc.totalHours + Number(curr.hours || 0)
      }), { totalProfit: 0, totalHours: 0 });

      setStats({
        today: todayStats || null,
        weekly: weeklyStats || [],
        weeklySummary: {
          totalProfit: weeklySummary?.totalProfit || 0,
          totalHours: weeklySummary?.totalHours || 0,
          avgGainPerHour: (weeklySummary?.totalHours && weeklySummary.totalHours > 0)
            ? weeklySummary.totalProfit / weeklySummary.totalHours
            : 0
        },
        settings: settingsData || null,
        recentRides: recentRidesData || []
      });

      if (goalData) {
        setCustomDailyGoal(goalData.goal_value);
        setDailyGoalInput(goalData.goal_value.toString());
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveGoal = async () => {
    const value = parseFloat(dailyGoalInput);
    if (isNaN(value) || value <= 0) return;

    setSavingGoal(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      const { error } = await supabase
        .from('daily_goals')
        .upsert({
          user_id: user.id,
          date: today,
          goal_value: value
        }, { onConflict: 'user_id,date' });

      if (error) throw error;

      setCustomDailyGoal(value);
      setShowGoalModal(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar meta");
    } finally {
      setSavingGoal(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-white/50">Carregando painel...</div>;

  const today = stats?.today;
  const settings = stats?.settings;

  // Usa a meta customizada se existir, senão usa a calculada das configurações
  const metaDiaria = customDailyGoal || (settings ? settings.monthly_goal / settings.work_days_month : 0);
  const progressoMeta = today ? (today.profit / metaDiaria) * 100 : 0;

  const subStatus = getSubscriptionStatus(user);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 pb-24 md:pb-8">
      {user?.plan !== 'pro' && (
        <UpgradePrompt
          daysRemaining={subStatus.daysRemaining}
          isExpired={subStatus.isExpired}
        />
      )}
      <header className="flex justify-between items-end mb-2">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          </div>
          <p className="text-white/40 text-sm">{format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGoalModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-lg hover:bg-white/10 transition-all"
          >
            <Target size={18} className="text-purple-400" />
            {customDailyGoal ? "Alterar Meta" : "Definir Meta"}
          </button>
          <div className="hidden md:block">
            <Link to="/register" className="flex items-center gap-2 px-4 py-2 bg-profit text-black font-bold rounded-lg hover:bg-profit/90 transition-all">
              <PlusCircle size={18} />
              Registrar Dia
            </Link>
          </div>
        </div>
      </header>

      {/* Goal Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm glass p-6 rounded-2xl border border-white/10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Target className="text-purple-400" />
                  Meta de Hoje
                </h3>
                <button onClick={() => setShowGoalModal(false)} className="text-white/40 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/40 uppercase font-bold tracking-wider">Valor do Lucro (R$)</label>
                  <input
                    type="number"
                    placeholder="Ex: 250.00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-2xl font-bold focus:outline-none focus:border-purple-400 transition-all"
                    value={dailyGoalInput}
                    onChange={e => setDailyGoalInput(e.target.value)}
                    autoFocus
                  />
                </div>

                <p className="text-[10px] text-white/30 leading-relaxed">
                  Esta meta substituirá a meta automática calculada nas suas configurações apenas para o dia de hoje.
                </p>

                <button
                  onClick={handleSaveGoal}
                  disabled={savingGoal}
                  className="w-full py-4 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  {savingGoal ? "Salvando..." : "Confirmar Meta"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Lucro Hoje"
          value={today ? `R$ ${today.profit.toFixed(2)}` : "R$ 0,00"}
          icon={TrendingUp}
          colorClass="text-profit"
          subValue={today ? `${((today.profit / today.revenue) * 100).toFixed(1)}% de margem` : "Sem registros hoje"}
        />
        <StatCard
          label="Ganho / Hora"
          value={today ? `R$ ${today.gain_per_hour.toFixed(2)}` : "R$ 0,00"}
          icon={Clock}
          colorClass="text-blue-400"
          subValue={today ? `${today.hours}h trabalhadas` : "0h trabalhadas"}
        />
        <StatCard
          label="Custo / KM"
          value={today ? `R$ ${(today.fuel / today.km).toFixed(2)}` : `R$ ${settings?.cost_per_km.toFixed(2) || "0.00"}`}
          icon={Fuel}
          colorClass="text-orange-400"
          subValue="Baseado no combustível"
        />
        <StatCard
          label="Meta Diária"
          value={`R$ ${metaDiaria.toFixed(2)}`}
          icon={Target}
          colorClass="text-purple-400"
          subValue={`${progressoMeta.toFixed(1)}% atingido`}
        />
      </div>

      {stats?.weeklySummary && (
        <Card title="Resumo Semanal (Últimos 7 dias)" className="bg-profit/5 border border-profit/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase font-bold mb-1">Lucro Total</span>
              <span className="text-2xl font-black text-profit">R$ {stats.weeklySummary.totalProfit.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase font-bold mb-1">Horas Totais</span>
              <span className="text-2xl font-black text-blue-400">{stats.weeklySummary.totalHours.toFixed(1)}h</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase font-bold mb-1">Média Ganho / Hora</span>
              <span className="text-2xl font-black text-purple-400">R$ {stats.weeklySummary.avgGainPerHour.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 h-[350px]" title="Lucro Semanal">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.weekly}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C853" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00C853" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#ffffff40', fontSize: 12 }}
                tickFormatter={(str) => format(parseISO(str), 'dd/MM')}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ffffff40', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1C1C1E', border: '1px solid #ffffff10', borderRadius: '12px' }}
                itemStyle={{ color: '#00C853' }}
              />
              <Area type="monotone" dataKey="profit" stroke="#00C853" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Resumo de Custos" className="flex flex-col justify-center">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-400/10 text-orange-400"><Fuel size={18} /></div>
                <div>
                  <p className="text-sm font-medium">Combustível</p>
                  <p className="text-xs text-white/40">Gasto total</p>
                </div>
              </div>
              <span className="font-bold">R$ {today?.fuel.toFixed(2) || "0,00"}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-400/10 text-blue-400"><MapPin size={18} /></div>
                <div>
                  <p className="text-sm font-medium">Distância</p>
                  <p className="text-xs text-white/40">KM rodados</p>
                </div>
              </div>
              <span className="font-bold">{today?.km || "0"} km</span>
            </div>
            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/40">Combustível / Faturamento</span>
                <span className="text-sm font-bold">{today ? ((today.fuel / today.revenue) * 100).toFixed(1) : "0"}%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-orange-400 h-full rounded-full"
                  style={{ width: `${today ? Math.min((today.fuel / today.revenue) * 100, 100) : 0}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {stats?.recentRides && stats.recentRides.length > 0 && (
        <Card title="Corridas Recentes">
          <div className="space-y-3">
            {stats.recentRides.map((ride) => (
              <div key={ride.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    ride.is_target_met ? "bg-profit/10 text-profit" : "bg-white/5 text-white/40"
                  )}>
                    <Calculator size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">R$ {ride.value.toFixed(2)}</p>
                    <p className="text-[10px] text-white/40">{ride.km} km • R$ {ride.value_per_km.toFixed(2)}/km</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-profit">+ R$ {ride.profit.toFixed(2)}</p>
                  <p className="text-[10px] text-white/20">{format(new Date(ride.date.replace(' ', 'T')), 'HH:mm')}</p>
                </div>
              </div>
            ))}
            <Link to="/evaluator" className="block text-center text-xs text-profit font-bold mt-4 hover:underline">
              Ver todas no Avaliador
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};

const RegisterDay = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    revenue: '',
    fuel: '',
    food: '',
    hours: '',
    km: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const revenueNum = parseFloat(formData.revenue);
      const fuelNum = parseFloat(formData.fuel || '0');
      const foodNum = parseFloat(formData.food || '0');
      const hoursNum = parseFloat(formData.hours);
      const kmNum = parseFloat(formData.km);
      const profitNum = revenueNum - (fuelNum + foodNum);
      const gain_per_hour = hoursNum > 0 ? profitNum / hoursNum : 0;

      const { error } = await supabase.from('daily_records').insert({
        user_id: user.id,
        date: formData.date,
        revenue: revenueNum,
        fuel: fuelNum,
        food: foodNum,
        hours: hoursNum,
        km: kmNum,
        profit: profitNum,
        gain_per_hour
      });

      if (error) throw error;
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar registro de dia");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8">
      <h1 className="text-3xl font-bold mb-6">Registrar Dia</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-white/40 uppercase font-bold">Data</label>
              <input
                type="date"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-profit"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/40 uppercase font-bold">Faturamento Bruto (R$)</label>
              <input
                type="number" step="0.01" placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-profit"
                value={formData.revenue}
                onChange={e => setFormData({ ...formData, revenue: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-white/40 uppercase font-bold">Combustível</label>
              <input
                type="number" step="0.01" placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-profit"
                value={formData.fuel}
                onChange={e => setFormData({ ...formData, fuel: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/40 uppercase font-bold">Alimentação</label>
              <input
                type="number" step="0.01" placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-profit"
                value={formData.food}
                onChange={e => setFormData({ ...formData, food: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-white/40 uppercase font-bold">Horas Trabalhadas</label>
              <input
                type="number" step="0.1" placeholder="0.0"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-profit"
                value={formData.hours}
                onChange={e => setFormData({ ...formData, hours: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/40 uppercase font-bold">KM Rodados</label>
              <input
                type="number" step="0.1" placeholder="0.0"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-profit"
                value={formData.km}
                onChange={e => setFormData({ ...formData, km: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-profit text-black font-bold rounded-xl hover:bg-profit/90 transition-all mt-4">
            Salvar Registro
          </button>
        </form>
      </Card>
    </div>
  );
};

const RideEvaluator = () => {
  const [inputs, setInputs] = useState({ value: '', km: '', target: '2.00' });
  const [settings, setSettings] = useState<Settings | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchRides = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('rides').select('*').eq('user_id', user.id).order('date', { ascending: false });
    if (data) setRides(data);
  };

  const fetchSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('settings').select('*').eq('user_id', user.id).maybeSingle();
    if (data) setSettings(data);
  };

  useEffect(() => {
    fetchSettings();
    fetchRides();
  }, []);

  const value = parseFloat(inputs.value) || 0;
  const km = parseFloat(inputs.km) || 0;
  const target = parseFloat(inputs.target) || 0;
  const costPerKm = settings?.cost_per_km || 0.55;

  const estimatedCost = km * costPerKm;
  const estimatedProfit = value - estimatedCost;
  const valuePerKm = km > 0 ? value / km : 0;

  const isTargetMet = target > 0 && valuePerKm >= target;

  const handleSaveRide = async () => {
    if (value <= 0 || km <= 0) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('rides').insert({
        user_id: user.id,
        value,
        km,
        profit: estimatedProfit,
        value_per_km: valuePerKm,
        is_target_met: isTargetMet
      });
      if (error) throw error;
      setInputs({ ...inputs, value: '', km: '' });
      fetchRides();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  let status = { label: 'Aguardando dados', color: 'text-white/40', bg: 'bg-white/5' };
  if (value > 0 && km > 0) {
    if (isTargetMet) status = { label: 'Meta Atingida! 🚀', color: 'text-profit', bg: 'bg-profit/20 border-2 border-profit/50' };
    else if (valuePerKm >= 1.3) status = { label: 'Margem Aceitável', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    else status = { label: 'Não Recomendado', color: 'text-alert', bg: 'bg-alert/10' };
  }

  const groupedRides = rides.reduce((acc: Record<string, Ride[]>, ride) => {
    const date = ride.date.split(' ')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(ride);
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Avaliador de Corrida</h1>
        <Card className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-white/40 uppercase font-bold">Valor (R$)</label>
              <input
                type="number" step="0.01" placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-lg font-bold focus:outline-none focus:border-profit"
                value={inputs.value}
                onChange={e => setInputs({ ...inputs, value: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-white/40 uppercase font-bold">KM Total</label>
              <input
                type="number" step="0.1" placeholder="0.0"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-lg font-bold focus:outline-none focus:border-profit"
                value={inputs.km}
                onChange={e => setInputs({ ...inputs, km: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-profit/60 uppercase font-bold">Meta R$/KM</label>
              <input
                type="number" step="0.1" placeholder="2.0"
                className="w-full bg-profit/5 border border-profit/20 rounded-xl p-3 text-lg font-bold text-profit focus:outline-none focus:border-profit"
                value={inputs.target}
                onChange={e => setInputs({ ...inputs, target: e.target.value })}
              />
            </div>
          </div>

          <div className={cn("p-6 rounded-2xl text-center transition-all relative overflow-hidden", status.bg)}>
            {isTargetMet && (
              <div className="absolute top-0 right-0 bg-profit text-black text-[10px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-tighter">
                Top Corrida
              </div>
            )}
            <p className={cn("text-lg font-bold uppercase tracking-widest", status.color)}>{status.label}</p>
            <p className="text-3xl font-black mt-2">R$ {estimatedProfit.toFixed(2)}</p>
            <p className="text-xs text-white/40 mt-1">LUCRO ESTIMADO</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div>
              <p className="text-xs text-white/40 uppercase">Valor por KM</p>
              <p className={cn("text-xl font-bold", isTargetMet ? "text-profit" : "")}>
                R$ {valuePerKm.toFixed(2)}
                {isTargetMet && <span className="text-xs ml-2">✅</span>}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40 uppercase">Custo Estimado</p>
              <p className="text-xl font-bold text-alert">R$ {estimatedCost.toFixed(2)}</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSaveRide}
              disabled={saving || value <= 0 || km <= 0}
              className="w-full py-4 bg-profit text-black font-bold rounded-xl hover:bg-profit/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Salvando..." : "Salvar Corrida no Histórico"}
            </button>
          </div>

          <p className="text-[10px] text-center text-white/20">
            Custo base: R$ {costPerKm.toFixed(2)}/km (ajustável nas configurações)
          </p>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <History size={20} className="text-profit" />
          <h2 className="text-xl font-bold">Histórico de Corridas</h2>
        </div>

        {Object.keys(groupedRides).length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <p className="text-white/30">Nenhuma corrida salva ainda.</p>
          </div>
        ) : (
          (Object.entries(groupedRides) as [string, Ride[]][]).sort((a, b) => b[0].localeCompare(a[0])).map(([date, dayRides]) => (
            <div key={date} className="space-y-3">
              <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">
                {format(parseISO(date), "EEEE, d 'de' MMMM", { locale: ptBR })}
              </h3>
              <div className="space-y-2">
                {dayRides.map((ride) => (
                  <div key={ride.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-xl",
                        ride.is_target_met ? "bg-profit/10 text-profit" : "bg-white/5 text-white/40"
                      )}>
                        {ride.is_target_met ? <CheckCircle size={20} /> : <Calculator size={20} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold">R$ {ride.value.toFixed(2)}</p>
                          {ride.is_target_met && <span className="text-[10px] bg-profit/20 text-profit px-2 py-0.5 rounded-full font-bold uppercase">Meta</span>}
                        </div>
                        <p className="text-xs text-white/40">{ride.km} km • R$ {ride.value_per_km.toFixed(2)}/km</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-profit">+ R$ {ride.profit.toFixed(2)}</p>
                      <p className="text-[10px] text-white/20">{format(new Date(ride.date.replace(' ', 'T')), 'HH:mm')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ProfilePage = ({ onUpdate }: { onUpdate: () => void }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setLoading(false); return; }

      const { data } = await supabase.from('users').select('*').eq('id', authUser.id).maybeSingle();
      if (data) {
        setUser(data);
        setName(data.name || '');
        setImageUrl(data.profile_image || '');
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { error } = await supabase.from('users').update({ name, profile_image: imageUrl }).eq('id', authUser.id);

      if (!error) {
        onUpdate();
        alert("Perfil atualizado com sucesso!");
      } else {
        alert("Erro ao salvar perfil.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão ao salvar perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-white/50">Carregando...</div>;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
      <Card>
        <form onSubmit={handleSave} className="space-y-8">
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden bg-white/10 border-2 border-white/5 group-hover:border-profit transition-all">
                {imageUrl ? (
                  <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <UserIcon size={48} />
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 p-2 bg-profit rounded-full text-black shadow-lg group-hover:scale-110 transition-transform">
                <Camera size={18} />
              </div>
            </div>
            <p className="text-xs text-white/40 uppercase font-bold">Foto de Perfil</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-white/40 uppercase font-bold">Nome de Exibição</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-profit transition-all"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/40 uppercase font-bold">E-mail (Não alterável)</label>
              <input
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 opacity-50 cursor-not-allowed"
                value={user?.email}
                disabled
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-profit text-black font-bold rounded-xl hover:bg-profit/90 transition-all shadow-lg shadow-profit/10 disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Atualizar Perfil"}
          </button>
        </form>
      </Card>
    </div>
  );
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase.from('settings').select('*').eq('user_id', user.id).maybeSingle();
      if (data) setSettings(data);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('settings').upsert({ ...settings, user_id: user.id }, { onConflict: 'user_id' });
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return <div className="p-8 text-center text-white/50">Carregando...</div>;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      <Card>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-profit uppercase tracking-wider">Veículo e Combustível</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-white/40 uppercase font-bold">Consumo (KM/L)</label>
                <input
                  type="number" step="0.1"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-profit"
                  value={settings?.consumption_km_l}
                  onChange={e => setSettings({ ...settings!, consumption_km_l: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/40 uppercase font-bold">Preço do Litro (R$)</label>
                <input
                  type="number" step="0.01"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-profit"
                  value={settings?.fuel_price}
                  onChange={e => setSettings({ ...settings!, fuel_price: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-xs text-white/40 uppercase">Custo calculado por KM</p>
              <p className="text-xl font-bold">R$ {settings?.cost_per_km.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Metas Financeiras</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-white/40 uppercase font-bold">Meta Mensal (R$)</label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-profit"
                  value={settings?.monthly_goal}
                  onChange={e => setSettings({ ...settings!, monthly_goal: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/40 uppercase font-bold">Dias de Trabalho / Mês</label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-profit"
                  value={settings?.work_days_month}
                  onChange={e => setSettings({ ...settings!, work_days_month: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar Configurações"}
          </button>
        </form>
      </Card>

      <div className="mt-8 p-6 glass rounded-2xl border-alert/20">
        <h3 className="text-alert font-bold mb-2">Zona de Perigo</h3>
        <p className="text-xs text-white/40 mb-4">Ao sair, você precisará fazer login novamente para acessar seus dados.</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-alert font-bold hover:underline"
        >
          <LogOut size={16} />
          Sair da Conta
        </button>
      </div>
    </div>
  );
};

// --- Layout & Navigation ---

const Navigation = ({ user }: { user: User | null }) => {
  const location = useLocation();
  const status = user ? getSubscriptionStatus(user) : null;
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Painel' },
    { path: '/register', icon: PlusCircle, label: 'Registrar' },
    { path: '/evaluator', icon: Calculator, label: 'Avaliar' },
    { path: '/profile', icon: UserIcon, label: 'Perfil' },
    { path: '/settings', icon: SettingsIcon, label: 'Ajustes' },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/5 px-6 py-3 z-50 flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                isActive ? "text-profit" : "text-white/40"
              )}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/5 flex-col p-6 z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-profit rounded-xl flex items-center justify-center text-black">
            <TrendingUp size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter">DriverHUB</span>
        </div>

        <div className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                  isActive ? "bg-profit text-black" : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="pt-6 border-t border-white/5">
          <Link to="/profile" className="flex items-center gap-3 px-2 hover:bg-white/5 p-2 rounded-xl transition-all">
            <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden">
              {user?.profile_image ? (
                <img src={user.profile_image} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  <UserIcon size={16} />
                </div>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name || "Motorista Pro"}</p>
              <p className="text-[10px] text-white/40 truncate">
                {status?.isPro ? (
                  <span className="text-profit font-bold">Plano PRO</span>
                ) : status?.isTrial ? (
                  `Plano Trial • ${status.daysRemaining} dias trial`
                ) : (
                  `Plano Expirado`
                )}
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { setUser(null); return; }

    const { data } = await supabase.from('users').select('*').eq('id', session.user.id).maybeSingle();
    setUser(data || null);
  };

  useEffect(() => {
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUser();
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#132d24_0%,_#0a0a0a_100%)] text-primary-text selection:bg-profit/30">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-account" element={<RegisterPage />} />
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
          <Route path="/*" element={
            <div className="md:pl-64 min-h-screen">
              <Navigation user={user} />
              <main className="animate-in fade-in duration-500">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/register" element={<RegisterDay />} />
                  <Route path="/evaluator" element={<RideEvaluator />} />
                  <Route path="/profile" element={<ProfilePage onUpdate={fetchUser} />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </main>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}
