"use client";

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { FileQuestion } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-6">
      <div className="bg-slate-100 p-6 rounded-full animate-in zoom-in duration-500">
        <FileQuestion className="w-16 h-16 text-slate-400" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-900">
          {t('title')}
        </h1>
        <p className="text-slate-500 md:text-lg dark:text-slate-400">
          {t('description')}
        </p>
      </div>

      <Button asChild className="rounded-full px-8">
        <Link href="/">
          {t('goHome')}
        </Link>
      </Button>
    </div>
  );
}
