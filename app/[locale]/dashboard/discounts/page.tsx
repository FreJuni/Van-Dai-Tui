"use client";

import { useState, useEffect } from "react";
import { getDiscounts } from "@/server/actions/discount";
import { useTranslations } from "next-intl";
import { Tag, Plus, Edit, Calendar } from "lucide-react";
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
import { DiscountForm } from "@/components/dashboard/discount-form";
import { DeleteDiscountButton } from "@/components/dashboard/delete-discount-button";
import { format } from "date-fns";

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("Dashboard.discounts");

  const fetchDiscounts = async () => {
    setIsLoading(true);
    const data = await getDiscounts();
    setDiscounts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDiscounts();
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
              {t("addDiscount")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("addDiscount")}</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new discount rule.
              </DialogDescription>
            </DialogHeader>
            <DiscountForm onSuccess={() => {
                setIsAddOpen(false);
                fetchDiscounts();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {discounts.map((discount) => (
          <Card key={discount.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
            <CardHeader className="bg-slate-50/50 pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Tag className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {discount.discount} % Off
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  <Dialog 
                    open={editingId === discount.id} 
                    onOpenChange={(open) => setEditingId(open ? discount.id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer text-gray-500 hover:text-primary">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{t("editDiscount")}</DialogTitle>
                      </DialogHeader>
                      <DiscountForm 
                        initialData={discount} 
                        onSuccess={() => {
                            setEditingId(null);
                            fetchDiscounts();
                        }} 
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <DeleteDiscountButton id={discount.id} onSuccess={fetchDiscounts} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t("form.minPrice")}</p>
                  <p className="text-sm font-bold text-gray-700">{discount.minPrice}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t("form.maxPrice")}</p>
                  <p className="text-sm font-bold text-gray-700">{discount.maxPrice}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Validity Period</span>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Start:</span>
                        <span className="text-gray-600 font-medium">{format(new Date(discount.startDate), "PPP p")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">End:</span>
                        <span className="text-gray-600 font-medium">{format(new Date(discount.endDate), "PPP p")}</span>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {!isLoading && discounts.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">{t("noDiscounts")}</h3>
            <p className="text-gray-500">{t("noDiscountsDesc")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
