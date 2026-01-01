import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const Footer = () => {
    const t = useTranslations('Footer');
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-20">
            <div className="px-6 md:px-12 lg:px-[100px] py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
                            {t('projectName')}
                        </Link>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {t('description')}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">{t('categories')}</h4>
                        <ul className="space-y-2">
                            <li><Link href="/listing-page?category=phones" className="text-gray-600 hover:text-primary text-sm transition-colors">{t('phones')}</Link></li>
                            <li><Link href="/listing-page?category=laptops" className="text-gray-600 hover:text-primary text-sm transition-colors">{t('laptops')}</Link></li>
                            {/* <li><Link href="/listing-page?category=accessory" className="text-gray-600 hover:text-primary text-sm transition-colors">{t('accessories')}</Link></li> */}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">{t('services')}</h4>
                        <ul className="space-y-2">
                            <li><Link href="/services" className="text-gray-600 hover:text-primary text-sm transition-colors">{t('repair')}</Link></li>
                            <li><Link href="/services" className="text-gray-600 hover:text-primary text-sm transition-colors">{t('maintenance')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">{t('company')}</h4>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-gray-600 hover:text-primary text-sm transition-colors">{t('about')}</Link></li>
                            <li><Link href="/contact" className="text-gray-600 hover:text-primary text-sm transition-colors">{t('contact')}</Link></li>
                            <li><Link href="/privacy" className="text-gray-600 hover:text-primary text-sm transition-colors">{t('privacy')}</Link></li>
                            <li><Link href="/terms" className="text-gray-600 hover:text-primary text-sm transition-colors">{t('terms')}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">
                        &copy; {currentYear} {t('projectName')}. {t('rightsReserved')}
                    </p>
                    <div className="flex gap-6">
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t('followUs')}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;