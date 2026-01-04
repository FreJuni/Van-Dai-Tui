import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/src/i18n/navigation';
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import IconTikTok from '../icon-tiktok/icon-tiktok';
import { parsePhoneNumber } from 'libphonenumber-js';
import { phoneNumberFormat } from '@/lib/const';

const Footer = async () => {
    const t = await getTranslations('Footer');
    const currentYear = new Date().getFullYear();
    const adminPhone = process.env.AMDIN_PHONE_NUMBER_FOR_FORMAT! || '+60183570581';

    return (
        <footer className="bg-white border-t border-gray-100 mt-20">
            <div className="px-6 md:px-12 lg:px-[100px] py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
                    {/* Column 1: Brand & About */}
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
                            {t('projectName')}
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            {t('description')}
                        </p>
                    </div>

                    {/* Column 2: Product Categories */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">{t('categories')}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/search?condition=New" className="text-gray-500 hover:text-primary text-sm transition-colors duration-200">{t('newArrivals')}</Link></li>
                            <li><Link href="/search?condition=Used" className="text-gray-500 hover:text-primary text-sm transition-colors duration-200">{t('secondHand')}</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Services & Warranty */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">{t('services')}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/services" className="text-gray-500 hover:text-primary text-sm transition-colors duration-200">{t('repairServices')}</Link></li>
                            <li><Link href="/warranty-policy" className="text-gray-500 hover:text-primary text-sm transition-colors duration-200">{t('warrantyHighlights')}</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Company & Contact */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">{t('company')}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-gray-500 hover:text-primary text-sm transition-colors duration-200">{t('about')}</Link></li>
                            <li><Link href="/how-it-works" className="text-gray-500 hover:text-primary text-sm transition-colors duration-200">{t('howItWorks')}</Link></li>
                            <li><Link href="/contact" className="text-gray-500 hover:text-primary text-sm transition-colors duration-200">{t('contact')}</Link></li>
                            <li className="flex items-center gap-2 text-primary font-semibold text-sm">
                                <Phone className="w-4 h-4" />
                                <a href={`tel:${adminPhone}`} className="hover:underline">
                                    {phoneNumberFormat(adminPhone)}
                                </a>
                            </li>
                            <li><Link href="/privacy" className="text-gray-400 hover:text-primary text-[11px] uppercase tracking-widest transition-colors duration-200">{t('privacy')}</Link></li>
                            <li><Link href="/terms" className="text-gray-400 hover:text-primary text-[11px] uppercase tracking-widest transition-colors duration-200">{t('terms')}</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar: Copyright & Social */}
                <div className="mt-20 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">
                        &copy; {currentYear} {t('projectName')} &mdash; {t('rightsReserved')}
                    </p>
                    
                    <div className="flex gap-6 items-center">
                        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em] hidden sm:block">{t('followUs')}</span>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/profile.php?id=61571930270781" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-primary/5 hover:text-primary transition-all duration-300">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="https://www.tiktok.com/@van.dai.tui.mobil?_t=ZS-8y06oQzZB3g&_r=1&brid=U7T0Sq8QrK63b4e-miN4uQ" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-primary/5 hover:text-primary transition-all duration-300 flex items-center justify-center">
                                <IconTikTok className="w-[14px] h-[14px] text-inherit" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
