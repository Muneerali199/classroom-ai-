
import React from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
=======
import Image from 'next/image';
>>>>>>> 199af3475761fe42d3e41253973aa62af258ba8f
import { Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { team } from '@/components/landing/data';

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

<<<<<<< HEAD
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
                <img
=======
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
>>>>>>> 199af3475761fe42d3e41253973aa62af258ba8f
                  src={member.image}
                  width={96}
                  height={96}
                  alt={member.name}
<<<<<<< HEAD
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
              className="text-gray-600 font-medium mb-4"
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
              className="flex justify-center space-x-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              {[
                { Icon: Github, href: member.social.github, label: "GitHub" },
                { Icon: Linkedin, href: member.social.linkedin, label: "LinkedIn" },
                { Icon: Mail, href: `mailto:${member.social.email}`, label: "Email" },
              ].map(({ Icon, href, label }, socialIndex) => (
                <motion.a
                  key={socialIndex}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-gray-600"
                  style={{
                    background: 'linear-gradient(145deg, #ededed, #d7d7d7)',
                    boxShadow: '4px 4px 8px #c8c8c8, -4px -4px 8px #ffffff'
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: 'inset 3px 3px 6px #c8c8c8, inset -3px -3px 6px #ffffff'
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
=======
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
>>>>>>> 199af3475761fe42d3e41253973aa62af258ba8f
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
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Team information coming soon.
          </p>
        </motion.div>
      )}
    </motion.section>
  );
}
