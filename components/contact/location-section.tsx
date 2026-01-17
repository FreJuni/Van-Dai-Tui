"use client";

import { useState } from "react";
import { MapPin, Phone, Clock, MessageCircle, Facebook } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Location {
  id: string;
  name: string;
  phone: string;
  address: string;
  openingHours: string;
  googleMapsEmbed: string;
}

interface LocationSectionProps {
  locations: Location[];
  adminPhone: string;
}

export function LocationSection({ locations, adminPhone }: LocationSectionProps) {
  const t = useTranslations('ContactPage');
  const [activeLocation, setActiveLocation] = useState<Location | null>(
    locations[0] || null
  );

  if (locations.length === 0) {
    return (
      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-8 text-center text-slate-500">
          {t('noLocationsMessage') || 'No locations available yet.'}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
      {/* Location List */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">
          {t('ourLocations') || 'Our Locations'}
        </h3>
        {locations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => setActiveLocation(loc)}
            className={cn(
              "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer",
              activeLocation?.id === loc.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-transparent bg-white hover:bg-slate-50 shadow-sm"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-xl shrink-0",
                activeLocation?.id === loc.id ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
              )}>
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className={cn(
                  "font-bold transition-colors",
                  activeLocation?.id === loc.id ? "text-primary" : "text-slate-900"
                )}>
                  {loc.name}
                </p>
                <p className="text-xs text-slate-500 truncate max-w-[200px]">
                  {loc.address}
                </p>
              </div>
            </div>
          </button>
        ))}

        <div className="space-y-4 pt-8 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            {t('directSupport')}
          </h3>
          <div className="flex flex-col gap-3">
            <a
              href={`https://wa.me/${adminPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-colors font-bold text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              {t('chatOnWhatsApp')}
            </a>
            <a
              href="https://www.facebook.com/messages/e2ee/t/10036837059744982"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-bold text-sm"
            >
              <Facebook className="w-5 h-5" />
              {t('chatOnMessenger')}
            </a>
          </div>
        </div>
      </div>

      {/* Active Location Info & Map */}
      <div className="lg:col-span-2 space-y-6">
        {activeLocation ? (
          <>
            <Card className="border-none shadow-sm bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-8 space-y-8 border-b md:border-b-0 md:border-r border-slate-100">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-primary/5 text-primary shrink-0">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-bold text-slate-900">{t('visitUs')}</h3>
                          <p className="text-slate-500 text-sm leading-relaxed">
                            {activeLocation.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-primary/5 text-primary shrink-0">
                          <Phone className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-bold text-slate-900">{t('phoneNumber') || 'Phone'}</h3>
                          <p className="text-slate-500 text-sm">
                            {activeLocation.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-primary/5 text-primary shrink-0">
                          <Clock className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-bold text-slate-900">
                            {t('operatingHoursTitle')}
                          </h3>
                          <p className="text-slate-500 text-sm">
                            {activeLocation.openingHours}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-[300px] md:h-auto bg-slate-100 relative min-h-[400px]">
                    <div 
                        className="absolute inset-0 w-full h-full"
                        dangerouslySetInnerHTML={{ 
                            __html: activeLocation.googleMapsEmbed.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"') 
                        }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="h-[400px] flex items-center justify-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
            Please select a location
          </div>
        )}
      </div>
    </div>
  );
}
