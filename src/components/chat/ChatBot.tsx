
import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import { ChatWindow } from './ChatWindow';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ChatWindow onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Bot className="w-6 h-6" />
      </motion.button>
    </>
  );
};
