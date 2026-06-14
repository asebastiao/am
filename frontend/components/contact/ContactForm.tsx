'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { submitContact } from '@/lib/api';
import { Artwork, ContactInfo } from '@/types';

interface Props {
  artworks:         Artwork[];
  selectedArtworkId: number | null;
  contactInfo:      ContactInfo | null;
}

export default function ContactForm({ artworks, selectedArtworkId, contactInfo }: Props) {
  const { darkMode } = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const interestedArtwork = selectedArtworkId
    ? artworks.find(w => w.id === selectedArtworkId)
    : null;

  useEffect(() => {
    if (interestedArtwork) {
      setFormData(prev => ({
        ...prev,
        message: `Gostaria de solicitar informações de cotação, catálogos detalhados e condições de transporte especializado para a obra "${interestedArtwork.title}" (${interestedArtwork.year}, ${interestedArtwork.dimensions}).`,
      }));
    }
  }, [interestedArtwork]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim())    e.name    = 'Nome completo é obrigatório.';
    if (!formData.email.trim())   e.email   = 'Email é obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Por favor introduza um email válido.';
    if (!formData.message.trim()) e.message = 'A mensagem não pode estar vazia.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      const result = await submitContact({
        name:    formData.name,
        email:   formData.email,
        phone:   formData.phone || undefined,
        message: formData.message,
        artwork_interest_id: interestedArtwork?.id || null,
      });
      if (result.success) {
        setSubmitted(true);
        setSuccessMessage(result.message);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setErrors({ submit: result.message || 'Erro ao enviar mensagem. Tente novamente.' });
      }
    } catch {
      setErrors({ submit: 'Incapaz de estabelecer ligação com o servidor. Verifique a sua conexão.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full bg-transparent border-b py-3 text-sm font-light focus:outline-none transition-colors placeholder:text-zinc-400 ${
      errors[field]
        ? 'border-red-400 text-red-400'
        : darkMode
          ? 'border-white/10 text-zinc-100 focus:border-brand-gold'
          : 'border-black/10 text-zinc-900 focus:border-brand-gold'
    }`;

  return (
    <article id="contact-view-layout" className="py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

        {/* Left: Contact details */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.45em] text-brand-gold font-semibold block">
              Contacto & Aquisição
            </span>
            <h1 className={`font-serif text-3xl sm:text-4xl xl:text-5xl tracking-tight ${
              darkMode ? 'text-white' : 'text-zinc-950'
            }`}>
              Canais do Atelier
            </h1>
            <p className={`text-sm font-light leading-relaxed max-w-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Para agendamento de visitas privadas ao atelier, aquisições comerciais, utilize os canais abaixo ou o formulário direct-to-studio.
            </p>
          </div>

          <div className="space-y-6 pt-6 text-sm font-light">
            {contactInfo?.email_contacto && (
              <div className="flex items-start space-x-4">
                <Mail size={16} className="text-brand-gold mt-1.5 flex-shrink-0" />
                <div>
                  <span className={`block text-[10px] uppercase tracking-[0.2em] font-medium mb-1 ${
                    darkMode ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>Comunicação Geral e Vendas</span>
                  <a href={`mailto:${contactInfo.email_contacto}`}
                    className={`hover:text-brand-gold transition-colors ${darkMode ? 'text-zinc-200' : 'text-zinc-900'}`}>
                    {contactInfo.email_contacto}
                  </a>
                </div>
              </div>
            )}

            {contactInfo?.telefone_contacto && (
              <div className="flex items-start space-x-4">
                <Phone size={16} className="text-brand-gold mt-1.5 flex-shrink-0" />
                <div>
                  <span className={`block text-[10px] uppercase tracking-[0.2em] font-medium mb-1 ${
                    darkMode ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>Telefone Studio</span>
                  <span className={darkMode ? 'text-zinc-200' : 'text-zinc-900'}>
                    {contactInfo.telefone_contacto}
                  </span>
                </div>
              </div>
            )}

            {contactInfo?.endereco && (
              <div className="flex items-start space-x-4">
                <MapPin size={16} className="text-brand-gold mt-1.5 flex-shrink-0" />
                <div>
                  <span className={`block text-[10px] uppercase tracking-[0.2em] font-medium mb-1 ${
                    darkMode ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>Espaço Físico</span>
                  <span className={`block leading-relaxed ${darkMode ? 'text-zinc-200' : 'text-zinc-950'}`}>
                    {contactInfo.endereco}
                  </span>
                </div>
              </div>
            )}

            {contactInfo?.link_instagram && (
              <div className="flex items-start space-x-4">
                <svg xmlns="http://www.w3.org/2000/svg" width={16} viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                  className="text-brand-gold mt-1.5 flex-shrink-0">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                <div>
                  <span className={`block text-[10px] uppercase tracking-[0.2em] font-medium mb-1 ${
                    darkMode ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>Instagram</span>
                  <a href={contactInfo.link_instagram} target="_blank" rel="noopener noreferrer"
                    className={`hover:text-brand-gold transition-colors ${darkMode ? 'text-zinc-200' : 'text-zinc-900'}`}>
                    {contactInfo.nome_instagram || contactInfo.link_instagram}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`p-8 md:p-12 border text-center flex flex-col items-center justify-center space-y-6 ${
                  darkMode ? 'border-brand-gold/20 bg-zinc-900/10' : 'border-brand-gold/30 bg-brand-soft-gray/30'
                }`}
              >
                <CheckCircle size={48} className="text-[#c3a472] animate-pulse" />
                <h3 className={`font-serif text-2xl tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                  Envio Concluído
                </h3>
                <p className={`text-sm font-light max-w-sm leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  {successMessage || 'A sua mensagem foi registada. Responderemos ao seu endereço de email com a brevidade exigida.'}
                </p>
                <button
                  onClick={() => { setSubmitted(false); router.push('/galeria'); }}
                  className={`flex items-center space-x-2 text-xs uppercase tracking-[0.25em] hover:text-brand-gold transition-colors ${
                    darkMode ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  <span>Explorar Galeria</span>
                  <ArrowRight size={13} />
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-10"
              >
                {interestedArtwork && (
                  <div className={`px-5 py-4 border-l-2 border-brand-gold text-xs font-light leading-relaxed ${
                    darkMode ? 'bg-brand-gold/5 text-zinc-300' : 'bg-brand-gold/5 text-zinc-700'
                  }`}>
                    <span className="text-brand-gold text-[10px] uppercase tracking-widest font-medium block mb-1">
                      Obra de Interesse
                    </span>
                    {interestedArtwork.title} — {interestedArtwork.year}
                  </div>
                )}

                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <label className={`block text-[10px] uppercase tracking-[0.2em] font-medium mb-2 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        Nome Completo <span className="text-red-500">*</span>
                      </label>
                      <input name="name" value={formData.name} onChange={handleChange}
                        placeholder="O seu nome" className={inputClass('name')} />
                      {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className={`block text-[10px] uppercase tracking-[0.2em] font-medium mb-2 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        Endereço de Email <span className="text-red-500">*</span>
                      </label>
                      <input name="email" type="email" value={formData.email} onChange={handleChange}
                        placeholder="email@dominio.com" className={inputClass('email')} />
                      {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[10px] uppercase tracking-[0.2em] font-medium mb-2 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      Telefone <span className="text-zinc-400 normal-case">(opcional)</span>
                    </label>
                    <input name="phone" value={formData.phone} onChange={handleChange}
                      placeholder="+244 9XX XXX XXX" className={inputClass('phone')} />
                  </div>

                  <div>
                    <label className={`block text-[10px] uppercase tracking-[0.2em] font-medium mb-2 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      Assunto / Mensagem para o Atelier <span className="text-red-500">*</span>
                    </label>
                    <textarea name="message" value={formData.message} onChange={handleChange}
                      rows={6} placeholder="Descreva o seu interesse, questão ou pedido especial..."
                      className={`${inputClass('message')} resize-none`} />
                    {errors.message && <p className="text-red-400 text-[11px] mt-1">{errors.message}</p>}
                  </div>
                </div>

                {errors.submit && (
                  <p className="text-red-400 text-xs border border-red-400/20 px-4 py-3 bg-red-400/5">
                    {errors.submit}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 text-xs tracking-[0.3em] uppercase transition-all duration-300 border flex items-center justify-center space-x-3 focus:outline-none disabled:opacity-50 ${
                    darkMode
                      ? 'bg-white text-zinc-950 border-white hover:bg-brand-gold hover:border-brand-gold'
                      : 'bg-brand-charcoal text-[#fefdfb] border-brand-charcoal hover:bg-brand-gold hover:text-brand-charcoal hover:border-brand-gold'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="h-3.5 w-3.5 border border-current border-t-transparent rounded-full"
                      />
                      <span>A enviar dados para o Atelier...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar Mensagem</span>
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </article>
  );
}
