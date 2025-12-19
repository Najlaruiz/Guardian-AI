import { motion } from 'framer-motion';
import { Shield, Users, Target, Award, Lock, Zap, Globe, Heart, CreditCard } from 'lucide-react';
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

  const stats = [
    { value: '10+', label: 'Years Experience' },
    { value: '500+', label: 'Clients Protected' },
    { value: '50M+', label: 'Threats Blocked' },
    { value: '24/7', label: 'Support Available' },
  ];

  const paymentMethods = [
    { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png' },
    { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png' },
    { name: 'American Express', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/200px-American_Express_logo_%282018%29.svg.png' },
    { name: 'Stripe', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/200px-Stripe_Logo%2C_revised_2016.svg.png' },
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
                Established in 2014
              </h2>
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p>
                  Guardian AI was founded in 2014 with a clear vision: to bridge the gap between 
                  enterprise-level cybersecurity and the businesses that need it most. We recognized 
                  that while large corporations had access to sophisticated protection systems, 
                  small and medium businesses were left vulnerable to growing cyber threats.
                </p>
                <p>
                  By combining cutting-edge artificial intelligence with deep cybersecurity expertise, 
                  we've built a platform that provides proactive, intelligent protection. Our AI-powered 
                  systems continuously learn and adapt to new attack vectors, ensuring our clients 
                  stay protected against evolving threats.
                </p>
                <p>
                  Today, Guardian AI proudly serves over 500 businesses worldwide, from startups to 
                  established enterprises. Our commitment remains the same: delivering world-class 
                  security solutions that are both powerful and accessible.
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
                alt="AI Security Technology"
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

      {/* Payment Methods Section */}
      <section className="py-24 bg-slate-50" data-testid="payment-methods-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="font-mono text-indigo-600 uppercase tracking-widest text-sm">Secure Payments</span>
            <h2 className="font-syne text-4xl md:text-5xl font-bold text-slate-900 mt-4">
              Payment Methods
            </h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              We accept all major payment methods. Your transactions are secured with industry-leading encryption.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            {paymentMethods.map((method, i) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-shadow flex items-center justify-center"
              >
                <img
                  src={method.logo}
                  alt={method.name}
                  className="h-8 md:h-10 w-auto object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm">
              <Lock className="w-5 h-5 text-green-600" />
              <span className="text-slate-600 font-medium">256-bit SSL Encryption</span>
              <span className="text-slate-300">|</span>
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <span className="text-slate-600 font-medium">PCI DSS Compliant</span>
            </div>
          </motion.div>
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
              <span className="text-slate-500">Award-winning Security Solutions Since 2014</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
