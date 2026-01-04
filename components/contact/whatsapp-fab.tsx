"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface WhatsAppFABProps {
    phoneNumber: string;
    message?: string;
}

export const WhatsAppFAB = ({ phoneNumber, message = "Hello! I'm interested in your services." }: WhatsAppFABProps) => {
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 flex items-center justify-center"
        >
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25" />
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center group"
                aria-label="Contact us on WhatsApp"
            >
                <MessageCircle className="w-6 h-6" />
                <span className="absolute left-full ml-4 bg-white text-slate-900 px-3 py-1.5 rounded-lg text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-slate-100 pointer-events-none">
                    WhatsApp Chat
                </span>
            </a>
        </motion.div>
    );
};
