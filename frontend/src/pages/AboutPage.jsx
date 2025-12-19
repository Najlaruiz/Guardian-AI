import { motion } from 'framer-motion';
import { Shield, Users, Target, Award, Lock, Zap, Globe, Heart } from 'lucide-react';
import { ParticlesBackground } from '@/components/ParticlesBackground';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export default function AboutPage() {
  const values = [
    { icon: Shield, title: 'Security First', description: 'We prioritize your security above all else, implementing the most robust protection measures available.' },
    { icon: Zap, title: 'Innovation', description: 'Constantly pushing the boundaries of AI and cybersecurity to stay ahead of emerging threats.' },
    { icon: Heart, title: 'Trust', description: 'Building lasting relationships through transparency, reliability, and exceptional service.' },
    { icon: Globe, title: 'Accessibility', description: 'Making enterprise-grade security accessible to businesses of all sizes.' },
  ];

  const team = [
    { name: 'Sarah Chen', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' },
    { name: 'Marcus Johnson', role: 'CTO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
    { name: 'Emily Rodriguez', role: 'Head of Security', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop' },
    { name: 'David Kim', role: 'AI Lead', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },
  ];

  const stats = [
    { value: '10+', label: 'Years Experience' },
    { value: '500+', label: 'Clients Protected' },
    { value: '50M+', label: 'Threats Blocked' },
    { value: '24/7', label: 'Support Available' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center bg-slate-950 overflow-hidden pt-20" data-testid="about-hero">
        <ParticlesBackground />
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <motion.div {...fadeUp} className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8"
            >
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-mono text-indigo-300">About Guardian AI</span>
            </motion.div>
            
            <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Protecting Digital Futures
              <br />
              <span className="gradient-text">Since 2014</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              We're on a mission to make enterprise-grade cybersecurity accessible to everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-syne text-4xl md:text-5xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <span className="font-mono text-indigo-600 uppercase tracking-widest text-sm">Our Story</span>
              <h2 className="font-syne text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
                Born From a Vision
              </h2>
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p>
                  Guardian AI was founded in 2014 by a team of cybersecurity experts and AI researchers 
                  who saw a growing gap in the security landscape. While large enterprises had access 
                  to sophisticated protection systems, small and medium businesses were left vulnerable.
                </p>
                <p>
                  Our founders believed that every business deserves world-class security. They set out 
                  to build an AI-powered platform that could provide enterprise-level protection at a 
                  fraction of the cost.
                </p>
                <p>
                  Today, Guardian AI protects over 500 businesses worldwide, blocking millions of threats 
                  daily while our AI systems continuously learn and adapt to new attack vectors.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-3xl blur-xl" />
              <img
                src="https://images.pexels.com/photos/8439094/pexels-photo-8439094.jpeg"
                alt="Team collaboration"
                className="relative rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="font-mono text-indigo-600 uppercase tracking-widest text-sm">Our Values</span>
            <h2 className="font-syne text-4xl md:text-5xl font-bold text-slate-900 mt-4">
              What Drives Us
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 p-8 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-syne text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-slate-50" data-testid="team-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="font-mono text-indigo-600 uppercase tracking-widest text-sm">Our Team</span>
            <h2 className="font-syne text-4xl md:text-5xl font-bold text-slate-900 mt-4">
              Meet The Experts
            </h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              Our team brings together decades of experience in cybersecurity, AI, and enterprise software.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-syne text-lg font-bold text-slate-900">{member.name}</h3>
                <p className="text-indigo-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div {...fadeUp}>
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-syne text-4xl md:text-5xl font-bold text-white mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              "To democratize enterprise-grade cybersecurity through artificial intelligence, 
              making powerful protection accessible to businesses of all sizes while staying 
              one step ahead of evolving threats."
            </p>
            <div className="mt-8 flex items-center justify-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <span className="text-slate-500">Award-winning Security Solutions</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
