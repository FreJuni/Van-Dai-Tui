"use client";

import { useState, useEffect } from "react";
import { getLocations } from "@/server/actions/location";
import { useTranslations } from "next-intl";
import { MapPin, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LocationForm } from "@/components/dashboard/location-form";
import { DeleteLocationButton } from "@/components/dashboard/delete-location-button";

export default function LocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("Dashboard.locations");

  const fetchLocations = async () => {
    setIsLoading(true);
    const data = await getLocations();
    setLocations(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
            {t("title")}
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            {t("subtitle")}
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 h-12 cursor-pointer px-8 font-bold shadow-lg shadow-primary/20 rounded-2xl">
              <Plus className="w-5 h-5" />
              {t("addLocation")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("addNewLocation")}</DialogTitle>
              <DialogDescription>
                {t("addNewLocationDesc")}
              </DialogDescription>
            </DialogHeader>
            <LocationForm onSuccess={() => {
                setIsAddOpen(false);
                fetchLocations();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <Card key={location.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-50/50 pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl font-bold">{location.name}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Dialog 
                    open={editingLocationId === location.id} 
                    onOpenChange={(open) => setEditingLocationId(open ? location.id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer text-gray-500 hover:text-primary">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{t("editLocation")}</DialogTitle>
                        <DialogDescription>
                          {t("updateLocationDesc")}
                        </DialogDescription>
                      </DialogHeader>
                      <LocationForm 
                        initialData={location} 
                        onSuccess={() => {
                            setEditingLocationId(null);
                            fetchLocations();
                        }} 
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <DeleteLocationButton id={location.id} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t("form.address")}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{location.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t("form.phone")}</p>
                  <p className="text-sm text-gray-600">{location.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t("form.hours")}</p>
                  <p className="text-sm text-gray-600">{location.openingHours}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-50">
                <div 
                  className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden relative"
                  dangerouslySetInnerHTML={{ 
                    __html: location.googleMapsEmbed.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"') 
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {!isLoading && locations.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">{t("noLocations")}</h3>
            <p className="text-gray-500">{t("noLocationsDesc")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
