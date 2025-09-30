'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Palette, Code, Database, Bug, TrendingUp, Github, Linkedin, Mail } from 'lucide-react';

const teamMembers = [
  {
    name: "Muneer Ali",
    role: "Lead Developer",
    expertise: ["React/Next.js", "AI/ML Integration", "Database Design"],
    icon: User,
    color: "from-cyan-400 to-blue-500",
    social: {
      github: "https://github.com/Muneerali199",
      linkedin: "https://linkedin.com/in/muneerali",
      email: "alimuneerali245@gmail.com"
    }
  },
  {
    name: "Jayant Bansal",
    role: "UX/UI Designer",
    expertise: ["Interface Design", "User Research", "Design Systems"],
    icon: Palette,
    color: "from-purple-400 to-pink-500",
    social: {
      github: "https://github.com/jayantbansal",
      linkedin: "https://linkedin.com/in/jayantbansal",
      email: "jayant@edutrack.com"
    }
  },
  {
    name: "Akshay Jain",
    role: "Frontend Developer",
    expertise: ["React Ecosystem", "TypeScript", "Performance"],
    icon: Code,
    color: "from-emerald-400 to-teal-500",
    social: {
      github: "https://github.com/akshayjain",
      linkedin: "https://linkedin.com/in/akshayjain",
      email: "akshay@edutrack.com"
    }
  },
  {
    name: "Aveek Patel",
    role: "Backend Developer",
    expertise: ["Node.js", "Database", "API Design"],
    icon: Database,
    color: "from-orange-400 to-red-500",
    social: {
      github: "https://github.com/aveekpatel",
      linkedin: "https://linkedin.com/in/aveekpatel",
      email: "aveek@edutrack.com"
    }
  },
  {
    name: "Priya Sharma",
    role: "QA Engineer",
    expertise: ["Testing", "Automation", "Quality Assurance"],
    icon: Bug,
    color: "from-yellow-400 to-orange-500",
    social: {
      github: "https://github.com/priyasharma",
      linkedin: "https://linkedin.com/in/priyasharma",
      email: "priya@edutrack.com"
    }
  },
  {
    name: "Rahul Verma",
    role: "Product Manager",
    expertise: ["Strategy", "Analytics", "User Experience"],
    icon: TrendingUp,
    color: "from-blue-400 to-indigo-500",
    social: {
      github: "https://github.com/rahulverma",
      linkedin: "https://linkedin.com/in/rahulverma",
      email: "rahul@edutrack.com"
    }
  }
];

export default function NewTeam() {
  return (
    <section id="team" className="relative py-20 md:py-32 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(168,85,247,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full mb-4 md:mb-6"
          >
            <User className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
            <span className="text-xs md:text-sm text-cyan-400 font-medium">Our Team</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6">
            Meet the minds
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              behind ClassroomAI
            </span>
          </h2>
          <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto px-4">
            A passionate team dedicated to transforming education with cutting-edge technology
          </p>
        </motion.div>

        {/* Team Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-4 md:p-6 hover:border-cyan-500/50 transition-all hover:shadow-2xl hover:shadow-cyan-500/20"
            >
              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-4">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                  <member.icon className="w-7 h-7 md:w-9 md:h-9 text-white" />
                </div>

                <h3 className="text-lg md:text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-xs md:text-sm text-cyan-400 font-medium mb-3 md:mb-4">{member.role}</p>

                {/* Expertise */}
                <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center mb-4">
                  {member.expertise.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 md:px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex gap-2 md:gap-3">
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all hover:scale-110"
                  >
                    <Github className="w-4 h-4 text-gray-400 hover:text-white" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all hover:scale-110"
                  >
                    <Linkedin className="w-4 h-4 text-gray-400 hover:text-white" />
                  </a>
                  <a
                    href={`mailto:${member.social.email}`}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all hover:scale-110"
                  >
                    <Mail className="w-4 h-4 text-gray-400 hover:text-white" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12 md:mt-20"
        >
          {[
            { value: '6', label: 'Team Members' },
            { value: '20+', label: 'Years Combined' },
            { value: '100%', label: 'Dedication' },
            { value: '∞', label: 'Innovation' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 md:p-6 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl"
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
