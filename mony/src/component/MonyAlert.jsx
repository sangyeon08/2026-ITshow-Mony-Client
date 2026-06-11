import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./MonyAlert.css";

export default function MonyAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="mony-alert-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
      >
        <motion.div
          className="mony-alert-box"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mony-alert-icon" aria-hidden="true">!</div>
          <p className="mony-alert-msg">{message}</p>
          <button className="mony-alert-btn" onClick={onClose}>
            다시 입력할게요
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
