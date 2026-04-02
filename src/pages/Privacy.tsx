import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Lock } from 'lucide-react';

const Privacy = () => {
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

                <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 space-y-8 shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-2xl bg-profit/10 text-profit">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Política de Privacidade</h1>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-profit">Coleta de Informações</h2>
                        <p className="text-white/60 leading-relaxed">
                            No DriverHUB, respeitamos a sua privacidade. Coletamos apenas as informações necessárias para o funcionamento do serviço:
                        </p>
                        <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
                            <li><strong>Informações de Registro:</strong> Nome e e-mail para autenticação de conta (armazenados via Supabase).</li>
                            <li><strong>Informações de Pagamento:</strong> Processadas integralmente pelo <strong>Stripe</strong>. O DriverHUB não armazena dados de cartões de crédito.</li>
                            <li><strong>Dados de Atividade:</strong> Registros de combustível, quilometragem e ganhos inseridos por você.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-profit">Uso dos Dados</h2>
                        <p className="text-white/60 leading-relaxed">
                            Seus dados são utilizados exclusivamente para gerar as estatísticas de desempenho, gerenciar sua assinatura e fornecer suporte técnico quando solicitado. Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins publicitários.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-profit">Segurança das Informações</h2>
                        <p className="text-white/60 leading-relaxed">
                            Implementamos medidas de segurança alinhadas aos padrões de mercado, utilizando criptografia HTTPS e infraestrutura de ponta do Supabase e do Stripe para proteger seus dados contra acessos não autorizados. No entanto, é responsabilidade do usuário manter o sigilo de sua senha de acesso.
                        </p>
                    </section>

                    <section className="space-y-4 border-t border-white/5 pt-8">
                        <p className="text-sm text-white/40">
                            Em conformidade com a LGPD (Lei Geral de Proteção de Dados), você tem o direito de solicitar a exclusão de seus dados a qualquer momento entrando em contato conosco.
                        </p>
                        <p className="text-sm text-white/40 mt-4">
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

export default Privacy;
