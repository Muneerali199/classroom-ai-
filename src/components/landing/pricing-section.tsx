"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Crown, Sparkles } from "lucide-react";
import { HulyButton } from "@/components/ui/huly-button";

export default function PricingSection() {
  const tiers = [
    {
      name: "Starter",
      price: "$0",
      period: "/mo",
      highlight: "Best for trying out",
      features: [
        "Up to 30 students",
        "Basic attendance",
        "Email support",
      ],
      cta: "Get Started",
      featured: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/mo",
      highlight: "For active classrooms",
      features: [
        "Unlimited students",
        "AI grading assistant",
        "Advanced analytics",
        "Priority support",
      ],
      cta: "Start Free Trial",
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      highlight: "For institutions",
      features: [
        "SSO & RBAC",
        "SLA & onboarding",
        "Dedicated support",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      featured: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="relative py-24 bg-black"
    >
      {/* Clean background */}
      <div className="absolute inset-0 bg-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Scale from a single classroom to an entire institution with plans that
            fit your needs.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className={
                "relative rounded-2xl border shadow-sm bg-black " +
                (tier.featured
                  ? "border-cyan-500/50 shadow-lg shadow-cyan-500/20"
                  : "border-white/10")
              }
            >
              {/* Featured badge */}
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 text-xs font-semibold shadow-lg">
                  <Crown className="w-3.5 h-3.5" /> Best value
                </div>
              )}

              {/* Card body */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    {tier.name}
                  </h3>
                  {tier.featured && (
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  )}
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">
                    {tier.price}
                  </span>
                  <span className="text-gray-400 ml-1">
                    {tier.period}
                  </span>
                </div>
                <div className="text-sm text-gray-400 font-medium mb-6">
                  {tier.highlight}
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 mt-0.5" />
                      <span className="text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>

                <HulyButton
                  variant={tier.featured ? "primary" : "secondary"}
                  size="medium"
                  className="w-full group"
                >
                  {tier.cta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </HulyButton>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-sm text-gray-400 mt-8"
        >
          All prices in USD. Educational discounts available for institutions.
        </motion.p>
      </div>
    </section>
  );
}
