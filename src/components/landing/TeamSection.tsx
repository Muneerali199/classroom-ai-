'use client';

import React from 'react';
import Image from 'next/image';
import { Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { team } from '@/lib/landing-data';

export default function TeamSection() {
  return (
    <motion.section
      id="team"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-24 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(135deg, #e8e8e8 0%, #dadada 100%)'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-6 text-gray-700"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Meet Our Team
        </motion.h2>
        <motion.div
          className="max-w-3xl mx-auto p-6 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #efefef, #d9d9d9)',
            boxShadow: 'inset 6px 6px 12px #c8c8c8, inset -6px -6px 12px #ffffff'
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p className="text-xl text-gray-600">
            A passionate team of developers and designers dedicated to
            transforming educational technology.
          </p>
        </motion.div>
      </motion.div>

      {team.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {team.map((member, index) => (
            <motion.div
              key={index}
              className="group text-center p-8 rounded-3xl transition-all duration-300"
              style={{
                background: 'linear-gradient(145deg, #efefef, #d9d9d9)',
                boxShadow: '12px 12px 24px #c8c8c8, -12px -12px 24px #ffffff'
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: '16px 16px 32px #c0c0c0, -16px -16px 32px #ffffff'
              }}
              whileTap={{ 
                scale: 0.98,
                boxShadow: 'inset 8px 8px 16px #c8c8c8, inset -8px -8px 16px #ffffff'
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="relative mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="w-24 h-24 rounded-full mx-auto p-1"
                  style={{
                    background: 'linear-gradient(145deg, #e8e8e8, #d2d2d2)',
                    boxShadow: '8px 8px 16px #c0c0c0, -8px -8px 16px #ffffff'
                  }}
                >
                  <Image
                    src={member.image}
                    width={96}
                    height={96}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                    data-ai-hint={member.dataAiHint}
                  />
                </motion.div>
              </motion.div>

              <motion.h3
                className="text-xl font-bold text-gray-700 mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {member.name}
              </motion.h3>
              <motion.p
                className="text-blue-500 font-medium mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {member.role}
              </motion.p>
              <motion.p
                className="text-sm text-gray-600 mb-6 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                {member.bio}
              </motion.p>

              <motion.div
                className="flex justify-center space-x-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                {[
                  { Icon: Github, href: member.social.github, label: "GitHub" },
                  { Icon: Linkedin, href: member.social.linkedin, label: "LinkedIn" },
                  { Icon: Mail, href: `mailto:${member.social.email}`, label: "Email" },
                ].map(({ Icon, href }, socialIndex) => (
                  <motion.a
                    key={socialIndex}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg transition-colors duration-200 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(145deg, #e0e0e0, #c8c8c8)',
                      boxShadow: '4px 4px 8px #b8b8b8, -4px -4px 8px #f8f8f8'
                    }}
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 10,
                      boxShadow: 'inset 2px 2px 4px #b8b8b8, inset -2px -2px 4px #f8f8f8'
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="w-4 h-4 text-gray-600" />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center py-12"
        >
          <p className="text-xl text-gray-600">
            Team information coming soon.
          </p>
        </motion.div>
      )}
    </motion.section>
  );
}