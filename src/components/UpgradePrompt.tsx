import React, { useState } from 'react';
import { Crown, AlertTriangle, CheckCircle, Loader2, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../types';
import { supabase } from '../lib/supabase';

interface UpgradePromptProps {
    daysRemaining: number;
    isExpired: boolean;
}

export const UpgradePrompt = ({ daysRemaining, isExpired }: UpgradePromptProps) => {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            // Garante que a sessão esteja atualizada
            const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) throw refreshError;

            const session = refreshedSession || (await supabase.auth.getSession()).data.session;

            if (!session) {
                alert('Sessão não encontrada. Por favor, faça login novamente.');
                return;
            }

            const { data, error } = await supabase.functions.invoke('checkout-v2');

            if (error) {
                console.error('Erro na Edge Function:', error);
                throw new Error(error.message || 'Erro na comunicação com o servidor');
            }

            if (data?.url) {
                window.location.href = data.url;
            } else {
                throw new Error('URL de checkout não retornada pelo servidor.');
            }
        } catch (err: any) {
            console.error('Erro capturado no checkout:', err);

            if (err.message?.includes('401') || err.message?.includes('JWT')) {
                alert('Sua sessão expirou ou é inválida. Por favor, saia (Logout) e entre novamente no aplicativo.');
            } else {
                alert(`Erro ao iniciar assinatura: ${err.message || 'Erro desconhecido'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    if (isExpired) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
            >
                <div className="w-full max-w-md glass p-8 rounded-3xl border border-alert/20 text-center space-y-6 shadow-2xl shadow-alert/10">
                    <div className="w-20 h-20 bg-alert/20 rounded-2xl flex items-center justify-center text-alert mx-auto mb-4">
                        <AlertTriangle size={40} />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Período de Teste Encerrado</h2>
                    <p className="text-white/60">
                        Seu período de teste de 7 dias chegou ao fim. Assine agora para continuar tendo acesso total aos seus dados e ferramentas do DriverHUB.
                    </p>
                    <div className="space-y-3 pt-4">
                        <button
                            disabled={loading}
                            className="w-full py-4 bg-profit text-black font-bold rounded-2xl hover:bg-profit/90 transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-profit/20 disabled:opacity-50"
                            onClick={handleUpgrade}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Crown size={20} />}
                            Assinar DriverHUB
                        </button>
                        <p className="text-[10px] text-white/30">
                            Assinatura mensal recorrente. Cancele quando quiser.
                        </p>
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                window.location.href = '/';
                            }}
                            className="w-full py-3 bg-white/5 text-white/40 text-sm font-medium rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            <LogOut size={16} />
                            Sair da Conta
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (daysRemaining <= 2) {
        return (
            <div className="bg-alert/10 border border-alert/20 p-4 rounded-2xl flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <AlertTriangle size={20} className="text-alert" />
                    <div>
                        <p className="text-sm font-bold">Seu teste grátis termina em {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}.</p>
                        <p className="text-xs text-white/40">Não perca o acesso às suas estatísticas.</p>
                    </div>
                </div>
                <button
                    disabled={loading}
                    className="px-4 py-2 bg-profit text-black text-xs font-bold rounded-xl hover:bg-profit/90 transition-all disabled:opacity-50 flex items-center gap-2"
                    onClick={handleUpgrade}
                >
                    {loading && <Loader2 className="animate-spin" size={14} />}
                    Assinar Agora
                </button>
            </div>
        );
    }

    return (
        <div className="bg-profit/10 border border-profit/20 p-4 rounded-2xl flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-profit" />
                <div>
                    <p className="text-sm font-bold">Você está no período de teste grátis.</p>
                    <p className="text-xs text-white/40">{daysRemaining} dias restantes de acesso total.</p>
                </div>
            </div>
            <button
                disabled={loading}
                className="px-4 py-2 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 flex items-center gap-2"
                onClick={handleUpgrade}
            >
                {loading && <Loader2 className="animate-spin" size={14} />}
                Ver Planos
            </button>
        </div>
    );
};
