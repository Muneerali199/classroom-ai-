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
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
            Meet Our Team
          </span>
        </motion.h2>
        <motion.p
          className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          A passionate team of developers and designers dedicated to
          transforming educational technology.
        </motion.p>
      </motion.div>

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
            className="group text-center p-8 rounded-3xl bg-gradient-to-br from-gray-900/5 to-gray-900/10 dark:from-white/5 dark:to-white/10 backdrop-blur-sm border border-gray-300/20 dark:border-white/10 hover:border-gray-300/40 dark:hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
              rotateY: 5,
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="relative mb-6"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <Image
                src={member.image}
                width={96}
                height={96}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-300/30 dark:border-white/20 group-hover:border-gray-300/60 dark:group-hover:border-white/40 transition-all duration-300"
                data-ai-hint={member.dataAiHint}
              />
            </motion.div>

            <motion.h3
              className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 dark:group-hover:from-pink-400 dark:group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {member.name}
            </motion.h3>
            <motion.p
              className="text-blue-500 dark:text-blue-400 font-medium mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {member.role}
            </motion.p>
            <motion.p
              className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
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
                  className="p-2 rounded-lg bg-gray-900/10 dark:bg-white/10 hover:bg-gray-900/20 dark:hover:bg-white/20 transition-colors duration-200 group-hover:scale-110"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
