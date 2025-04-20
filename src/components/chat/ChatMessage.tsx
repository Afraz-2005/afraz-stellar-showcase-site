
import React from 'react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: {
    text: string;
    isUser: boolean;
  };
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  // Function to convert plain text links to clickable links
  const formatMessage = (text: string) => {
    // Split text by newlines to preserve paragraph formatting
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');
    
    return paragraphs.map((paragraph, i) => (
      <p key={i} className={i > 0 ? "mt-2" : ""}>
        {paragraph}
      </p>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          message.isUser
            ? 'bg-primary text-white rounded-br-none'
            : 'bg-white/10 text-white rounded-bl-none'
        }`}
      >
        {formatMessage(message.text)}
      </div>
    </motion.div>
  );
};
