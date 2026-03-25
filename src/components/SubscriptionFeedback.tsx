import React from 'react';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const SubscriptionSuccess = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass p-10 rounded-3xl border border-profit/20 space-y-6 shadow-2xl"
            >
                <div className="w-20 h-20 bg-profit/20 rounded-full flex items-center justify-center text-profit mx-auto mb-4">
                    <CheckCircle size={48} />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">Assinado com Sucesso!</h1>
                <p className="text-white/60">
                    Parabéns! Agora você tem acesso total ao **DriverHUB**. Suas novas ferramentas já estão desbloqueadas.
                </p>
                <div className="pt-6">
                    <Link
                        to="/dashboard"
                        className="w-full py-4 bg-profit text-black font-bold rounded-2xl hover:bg-profit/90 transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-profit/20"
                    >
                        Ir para o Dashboard
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export const SubscriptionCancel = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass p-10 rounded-3xl border border-white/10 space-y-6 shadow-2xl"
            >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/40 mx-auto mb-4">
                    <XCircle size={48} />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">Pagamento Cancelado</h1>
                <p className="text-white/60">
                    O processo de assinatura foi cancelado. Você ainda pode usar o DriverHUB no plano atual ou tentar novamente quando quiser.
                </p>
                <div className="pt-6">
                    <Link
                        to="/dashboard"
                        className="w-full py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-lg"
                    >
                        Voltar ao Dashboard
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};
