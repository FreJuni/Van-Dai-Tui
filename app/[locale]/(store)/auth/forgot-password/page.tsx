'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';
import { MessageCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
    const t = useTranslations('Auth');
    const adminPhone = process.env.AMDIN_PHONE_NUMBER_FOR_FORMAT! || '+60183570581';
    
    // Remove the '+' for the WhatsApp link if present
    const cleanPhone = adminPhone.replace('+', '');
    const whatsappLink = `https://wa.me/${cleanPhone}`;

    return (
        <div className='flex justify-center items-center mt-20 px-4'>
            <Card className="w-full max-w-md border-gray-100 shadow-lg">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                        {t('featureUnavailable')}
                    </CardTitle>
                    <CardDescription className="text-gray-500 pt-2 text-base">
                        {t('forgotPasswordUnavailableDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <Button 
                        variant="default" 
                        size="lg" 
                        className="w-full cursor-pointer bg-[#25D366] hover:bg-[#128C7E] text-white font-bold gap-2"
                        onClick={() => window.open(whatsappLink, '_blank')}
                    >
                        <MessageCircle className="w-5 h-5" />
                        {t('contactAdminWhatsApp')}
                    </Button>
                    
                    <div className="text-center pt-2">
                         <Link href="/auth/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center justify-center gap-2 group">
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Back to Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ForgotPasswordPage
