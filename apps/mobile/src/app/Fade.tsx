'use client';

import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

export default function Fade({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
