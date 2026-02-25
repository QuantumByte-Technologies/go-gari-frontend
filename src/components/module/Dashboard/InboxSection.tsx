"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Car, CaretDown } from "@phosphor-icons/react";
import { InboxMessage } from "@/types/dashboard/types";

type Props = {
  messages: InboxMessage[];
  unreadCount: number;
};

export default function InboxSection({ messages, unreadCount }: Props) {
  const [expandedMessage, setExpandedMessage] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Inbox</h2>
        {unreadCount > 0 && (
          <span className="px-3 py-1 bg-[#5E9D34] text-white text-sm font-semibold rounded-full">
            {unreadCount} unread
          </span>
        )}
      </div>

      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`bg-white rounded-2xl border overflow-hidden ${
              message.unread ? "border-[#5E9D34] shadow-sm" : "border-gray-200"
            }`}
          >
            <button
              onClick={() =>
                setExpandedMessage(
                  expandedMessage === message.id ? null : message.id,
                )
              }
              className="w-full p-5 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Car size={24} weight="duotone" className="text-gray-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">
                      {message.orderId}
                    </span>
                    {message.unread && (
                      <span className="w-2 h-2 bg-[#5E9D34] rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {message.carName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {message.lastMessage}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">{message.timestamp}</p>
                  <CaretDown
                    size={18}
                    weight="bold"
                    className={`text-gray-400 mt-2 transition-transform ${
                      expandedMessage === message.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            </button>

            <AnimatePresence>
              {expandedMessage === message.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-gray-100"
                >
                  <div className="p-5 space-y-4 bg-gray-50">
                    {message.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl ${
                            msg.sender === "you"
                              ? "bg-[#5E9D34] text-white rounded-br-md"
                              : "bg-white border border-gray-200 rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p
                            className={`text-xs mt-1 ${msg.sender === "you" ? "text-green-100" : "text-gray-400"}`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
