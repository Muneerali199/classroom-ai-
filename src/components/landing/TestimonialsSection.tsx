import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Dr. Evelyn Reed',
      title: 'Dean of Sciences',
      quote: 'EduTrack has revolutionized how we manage attendance. It\'s secure, intuitive, and gives us the oversight we\'ve always needed. Our faculty and students love it.',
      stars: 5,
    },
    {
      name: 'Prof. Samuel Chen',
      title: 'Computer Science Dept.',
      quote: 'The real-time data and role-based access are game-changers. I can focus on teaching, knowing the administrative side is handled efficiently and securely.',
      stars: 5,
    },
    {
      name: 'Alice Johnson',
      title: 'Student Body President',
      quote: 'It\'s so easy to use! I love that I can track my attendance and progress without worrying about my data. It just works.',
      stars: 4,
    },
  ];

  return (
    <motion.section
      id="testimonials"
      className="py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-700">
            What Our Users Say
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-3xl"
              style={{
                background: 'linear-gradient(145deg, #d9d9d9, #fefefe)',
                boxShadow: '12px 12px 24px #c8c8c8, -12px -12px 24px #ffffff'
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.02,
                boxShadow: '16px 16px 32px #c0c0c0, -16px -16px 32px #ffffff'
              }}
            >
              <Quote className="w-10 h-10 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-700">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </div>
                <div className="flex">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gray-500 fill-current" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}