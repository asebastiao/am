'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { submitContact } from '@/lib/api';
import { useTranslations, useLocale } from 'next-intl';
import { translateDynamic } from '@/lib/dynamic-translator';
import { Artwork, ContactInfo } from '@/types';

interface Props {
  artworks:         Artwork[];
  selectedArtworkId: number | null;
  contactInfo:      ContactInfo | null;
}

export default function ContactForm({ artworks, selectedArtworkId, contactInfo }: Props) {
  const router = useRouter();
  const t = useTranslations('contact');
  const locale = useLocale();

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
        message: `${t('defaultMessage')} "${translateDynamic(interestedArtwork.title, locale)}" (${interestedArtwork.year}, ${interestedArtwork.dimensions}).`,
      }));
    }
  }, [interestedArtwork, t, locale]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim())    e.name    = t('errNameRequired');
    if (!formData.email.trim())   e.email   = t('errEmailRequired');
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) e.email = t('errEmailInvalid');
    if (!formData.message.trim()) e.message = t('errMessageRequired');
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
        setErrors({ submit: result.message || t('errSubmitGeneric') });
      }
    } catch {
      setErrors({ submit: t('errConnectionFailed') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) => `field-input ${errors[field] ? 'field-error' : ''}`;

  return (
    <article id="contact-view-layout" className="py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

        {/* Left: Contact details */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.45em] text-brand-gold font-semibold block">
              {t('subtitle')}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl xl:text-5xl tracking-tight" style={{ color: 'var(--color-fg-primary)' }}>
              {t('title')}
            </h1>
            <p className="text-sm font-light leading-relaxed max-w-sm" style={{ color: 'var(--color-fg-secondary)' }}>
              {t('intro')}
            </p>
          </div>

          <div className="space-y-5 pt-2 text-sm font-light">
            {contactInfo?.email_contacto && (
              <div className="card flex items-start space-x-4 p-4">
                <Mail size={16} className="text-brand-gold mt-1.5 flex-shrink-0" />
                <div>
                  <span className="field-label !mb-1">{t('emailLabel')}</span>
                  <a href={`mailto:${contactInfo.email_contacto}`}
                    className="hover:text-brand-gold transition-colors duration-200" style={{ color: 'var(--color-fg-primary)' }}>
                    {contactInfo.email_contacto}
                  </a>
                </div>
              </div>
            )}

            {contactInfo?.telefone_contacto && (
              <div className="card flex items-start space-x-4 p-4">
                <Phone size={16} className="text-brand-gold mt-1.5 flex-shrink-0" />
                <div>
                  <span className="field-label !mb-1">{t('phoneLabel')}</span>
                  <span style={{ color: 'var(--color-fg-primary)' }}>
                    {contactInfo.telefone_contacto}
                  </span>
                </div>
              </div>
            )}

            {contactInfo?.endereco && (
              <div className="card flex items-start space-x-4 p-4">
                <MapPin size={16} className="text-brand-gold mt-1.5 flex-shrink-0" />
                <div>
                  <span className="field-label !mb-1">{t('addressLabel')}</span>
                  <span className="block leading-relaxed" style={{ color: 'var(--color-fg-primary)' }}>
                    {contactInfo.endereco}
                  </span>
                </div>
              </div>
            )}

            {contactInfo?.link_instagram && (
              <div className="card flex items-start space-x-4 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width={16} viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                  className="text-brand-gold mt-1.5 flex-shrink-0">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                <div>
                  <span className="field-label !mb-1">Instagram</span>
                  <a href={contactInfo.link_instagram} target="_blank" rel="noopener noreferrer"
                    className="hover:text-brand-gold transition-colors duration-200" style={{ color: 'var(--color-fg-primary)' }}>
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
                className="card p-8 md:p-12 text-center flex flex-col items-center justify-center space-y-6"
                style={{ borderColor: 'color-mix(in srgb, var(--color-brand-gold) 25%, transparent)' }}
              >
                <CheckCircle size={48} className="text-[#c3a472]" />
                <h3 className="font-serif text-2xl tracking-tight" style={{ color: 'var(--color-fg-primary)' }}>
                  {t('successTitle')}
                </h3>
                <p className="text-sm font-light max-w-sm leading-relaxed" style={{ color: 'var(--color-fg-secondary)' }}>
                  {successMessage || t('successMessage')}
                </p>
                <button
                  onClick={() => { setSubmitted(false); router.push('/obras'); }}
                  className="btn-ghost !px-0 !py-0 normal-case tracking-[0.25em] text-xs"
                >
                  <span>{t('exploreGallery')}</span>
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
                  <div
                    className="px-5 py-4 text-xs font-light leading-relaxed rounded-[var(--radius-sm)]"
                    style={{
                      borderLeft: '2px solid var(--color-brand-gold)',
                      backgroundColor: 'color-mix(in srgb, var(--color-brand-gold) 6%, transparent)',
                      color: 'var(--color-fg-secondary)',
                    }}
                  >
                    <span className="text-brand-gold text-[10px] uppercase tracking-widest font-medium block mb-1">
                      {t('artworkOfInterest')}
                    </span>
                    {translateDynamic(interestedArtwork.title, locale)} — {interestedArtwork.year}
                  </div>
                )}

                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <label className="field-label">
                        {t('nameLabel')} <span className="text-red-500">*</span>
                      </label>
                      <input name="name" value={formData.name} onChange={handleChange}
                        placeholder={t('namePlaceholder')} className={inputClass('name')} />
                      {errors.name && <p className="text-[11px] mt-1.5" style={{ color: 'var(--color-danger)' }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label className="field-label">
                        {t('emailFieldLabel')} <span className="text-red-500">*</span>
                      </label>
                      <input name="email" type="email" value={formData.email} onChange={handleChange}
                        placeholder={t('emailPlaceholder')} className={inputClass('email')} />
                      {errors.email && <p className="text-[11px] mt-1.5" style={{ color: 'var(--color-danger)' }}>{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="field-label">
                      {t('phoneFieldLabel')} <span className="normal-case" style={{ color: 'var(--color-fg-muted)' }}>{t('phoneOptional')}</span>
                    </label>
                    <input name="phone" value={formData.phone} onChange={handleChange}
                      placeholder={t('phonePlaceholder')} className={inputClass('phone')} />
                  </div>

                  <div>
                    <label className="field-label">
                      {t('messageLabel')} <span className="text-red-500">*</span>
                    </label>
                    <textarea name="message" value={formData.message} onChange={handleChange}
                      rows={6} placeholder={t('messagePlaceholder')}
                      className={`${inputClass('message')} resize-none`} />
                    {errors.message && <p className="text-[11px] mt-1.5" style={{ color: 'var(--color-danger)' }}>{errors.message}</p>}
                  </div>
                </div>

                {errors.submit && (
                  <p className="text-xs px-4 py-3 rounded-[var(--radius-sm)]" style={{ color: 'var(--color-danger)', backgroundColor: 'var(--color-danger-bg)', border: '1px solid color-mix(in srgb, var(--color-danger) 25%, transparent)' }}>
                    {errors.submit}
                  </p>
                )}

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="h-3.5 w-3.5 border border-current border-t-transparent"
                      />
                      <span>{t('submitting')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('submitButton')}</span>
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
