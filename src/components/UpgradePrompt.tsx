import React from 'react';
import { Crown, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../types';

interface UpgradePromptProps {
    daysRemaining: number;
    isExpired: boolean;
}

export const UpgradePrompt = ({ daysRemaining, isExpired }: UpgradePromptProps) => {
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
                        Seu período de teste de 7 dias chegou ao fim. Assine agora para continuar tendo acesso total aos seus dados e ferramentas do DriverPRO.
                    </p>
                    <div className="space-y-3 pt-4">
                        <button
                            className="w-full py-4 bg-profit text-black font-bold rounded-2xl hover:bg-profit/90 transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-profit/20"
                            onClick={() => window.open('https://buy.stripe.com/SEU_LINK_AQUI', '_blank')}
                        >
                            <Crown size={20} />
                            Assinar DriverPRO
                        </button>
                        <p className="text-[10px] text-white/30">
                            Assinatura mensal recorrente. Cancele quando quiser.
                        </p>
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
                    className="px-4 py-2 bg-profit text-black text-xs font-bold rounded-xl hover:bg-profit/90 transition-all"
                    onClick={() => window.open('https://buy.stripe.com/SEU_LINK_AQUI', '_blank')}
                >
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
                className="px-4 py-2 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-xl hover:bg-white/10 transition-all"
                onClick={() => window.open('https://buy.stripe.com/SEU_LINK_AQUI', '_blank')}
            >
                Ver Planos
            </button>
        </div>
    );
};
