import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, FileText } from 'lucide-react';

const Terms = () => {
    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#132d24_0%,_#0a0a0a_100%)] p-6 md:p-12">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-profit transition-colors mb-8 group">
                    <ChevronLeft size={20} />
                    <span>Voltar ao Início</span>
                </Link>

                <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 space-y-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-2xl bg-profit/10 text-profit">
                            <FileText size={32} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Termos de Uso</h1>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-profit">1. Aceitação dos Termos</h2>
                        <p className="text-white/60 leading-relaxed">
                            Ao acessar e utilizar o DriverHUB, você concorda em cumprir e estar vinculado a estes termos de serviço. O DriverHUB é uma ferramenta de auxílio à gestão financeira para motoristas de aplicativos e não substitui o controle oficial das plataformas de transporte.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-profit">2. Período de Teste e Assinatura</h2>
                        <p className="text-white/60 leading-relaxed">
                            Oferecemos um período de teste gratuito de 7 (sete) dias para novos usuários. Após este período, para continuar utilizando as funcionalidades do DriverHUB, você deverá optar por uma assinatura mensal paga via Stripe.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-profit">3. Política de Cancelamento e Reembolso</h2>
                        <p className="text-white/60 leading-relaxed">
                            <strong>Cancelamento:</strong> Você pode cancelar sua assinatura a qualquer momento através das configurações do seu perfil no aplicativo ou entrando em contato pelo e-mail <strong>equipedriverhub@gmail.com</strong>. O cancelamento interrompe a renovação automática, mas você manterá o acesso até o final do período já pago.
                        </p>
                        <p className="text-white/60 leading-relaxed">
                            <strong>Reembolso:</strong> Por se tratar de um serviço digital com período de teste prévio, não oferecemos reembolsos após a renovação da assinatura, exceto em casos de erro sistêmico comprovado.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-profit">4. Responsabilidades do Usuário</h2>
                        <p className="text-white/60 leading-relaxed">
                            O usuário é o único responsável pela precisão dos dados inseridos (combustível, ganhos, km). O DriverHUB não se responsabiliza por decisões financeiras tomadas com base nas estatísticas apresentadas.
                        </p>
                    </section>

                    <section className="space-y-4 border-t border-white/5 pt-8">
                        <p className="text-sm text-white/40">
                            Última atualização: 02 de Abril de 2026.
                        </p>
                        <p className="text-sm text-white/40">
                            Contato: equipedriverhub@gmail.com
                        </p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default Terms;
