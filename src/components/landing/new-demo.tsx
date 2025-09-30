'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayCircle, Pause, RotateCcw, CheckCircle2, 
  ArrowRight, Code, Sparkles, Zap 
} from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Create Your Class',
    description: 'Set up your classroom in seconds with our intuitive interface',
    code: `// Create a new class
const classroom = {
  name: "Mathematics 101",
  students: 30,
  schedule: "Mon-Wed-Fri"
}`,
    color: 'cyan'
  },
  {
    id: 2,
    title: 'Mark Attendance',
    description: 'Students check in with a unique PIN code or QR scan',
    code: `// Instant attendance tracking
attendance.mark({
  studentId: "12345",
  method: "PIN",
  timestamp: Date.now()
}) // ✓ Marked in 0.5s`,
    color: 'purple'
  },
  {
    id: 3,
    title: 'AI Grades Assignments',
    description: 'Upload assignments and let AI handle the grading',
    code: `// AI-powered grading
ai.grade({
  assignment: "essay.pdf",
  rubric: "standard",
  feedback: "detailed"
}) // ✓ 10x faster`,
    color: 'emerald'
  },
  {
    id: 4,
    title: 'Get Insights',
    description: 'View analytics and make data-driven decisions',
    code: `// Generate insights
analytics.generate({
  period: "semester",
  metrics: ["performance", "attendance"],
  visualize: true
}) // ✓ Real-time`,
    color: 'orange'
  }
];

export default function NewDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handlePlay = () => {
    setIsPlaying(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        setCurrentStep(step);
        setCompletedSteps(prev => [...prev, step]);
        step++;
      } else {
        setIsPlaying(false);
        clearInterval(interval);
      }
    }, 2000);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setIsPlaying(false);
  };

  return (
    <section id="demo" className="relative py-32 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full mb-6"
          >
            <Code className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">See It In Action</span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            From setup to insights
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              in 4 simple steps
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Watch how ClassroomAI transforms your workflow with intelligent automation
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Steps Sidebar */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setCurrentStep(index)}
                className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  currentStep === index
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border-cyan-500/50 shadow-2xl shadow-cyan-500/20'
                    : completedSteps.includes(index)
                    ? 'bg-white/5 border-emerald-500/30'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Step Number */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${
                    completedSteps.includes(index)
                      ? 'bg-emerald-500 text-white'
                      : currentStep === index
                      ? `bg-gradient-to-br from-${step.color}-400 to-${step.color}-600 text-white scale-110`
                      : 'bg-white/10 text-gray-400 group-hover:bg-white/20'
                  }`}>
                    {completedSteps.includes(index) ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      step.id
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>

                  {currentStep === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-cyan-400"
                    />
                  )}
                </div>

                {/* Progress Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-10 top-full w-0.5 h-4 bg-white/10">
                    {completedSteps.includes(index) && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        className="w-full bg-emerald-400"
                      />
                    )}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Controls */}
            <div className="flex gap-4">
              <button
                onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    Play Demo
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-white flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>

          {/* Code Display */}
          <div className="lg:sticky lg:top-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {/* Terminal Window */}
                <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="text-sm text-gray-400 font-mono">classroom-ai-demo.js</div>
                    <Code className="w-4 h-4 text-gray-400" />
                  </div>

                  {/* Code Content */}
                  <div className="p-6">
                    <pre className="text-sm font-mono">
                      <code className="text-gray-300">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <span className="text-purple-400">// Step {steps[currentStep].id}</span>
                          {'\n'}
                          <span className="text-emerald-400">{steps[currentStep].title}</span>
                          {'\n\n'}
                          {steps[currentStep].code.split('\n').map((line, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              {line}
                              {'\n'}
                            </motion.div>
                          ))}
                        </motion.div>
                      </code>
                    </pre>

                    {/* Success Indicator */}
                    {completedSteps.includes(currentStep) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Step completed successfully!</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-${steps[currentStep].color}-500/10 to-transparent pointer-events-none`} />
                </div>

                {/* Floating Icons */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl"
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-xl font-semibold text-white inline-flex items-center gap-2 transition-all hover:scale-105 shadow-2xl shadow-cyan-500/50">
            Try It Yourself
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-4 text-gray-400">No credit card required • Free forever</p>
        </motion.div>
      </div>
    </section>
  );
}
