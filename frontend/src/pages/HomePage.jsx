import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Search, Cpu, ChevronRight, Lock, Zap, Users, Activity, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const iconMap = {
  Shield: Shield,
  Search: Search,
  Cpu: Cpu,
};

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 }
};

export default function HomePage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API}/services`);
        setServices(res.data);
      } catch (err) {
        // Use default services if fetch fails
        setServices([
          { id: '1', slug: 'data-device-protection', title: 'Data & Device Protection', short_description: 'Comprehensive security for all your devices and sensitive data.', icon: 'Shield', pricing: [{ price: 199 }] },
          { id: '2', slug: 'cybersecurity-consultation', title: 'Cybersecurity Consultation', short_description: 'Expert analysis and strategic recommendations.', icon: 'Search', pricing: [{ price: 299 }] },
          { id: '3', slug: 'automated-ai-solutions', title: 'Automated AI Solutions', short_description: 'Custom AI automation for your business.', icon: 'Cpu', pricing: [{ price: 499 }] },
        ]);
      }
    };
    fetchServices();
    
    // Seed services on first load
    axios.post(`${API}/seed-services`).catch(() => {});
    axios.post(`${API}/seed-admin`).catch(() => {});
  }, []);

  const stats = [
    { value: '99.9%', label: 'Uptime Guarantee' },
    { value: '50M+', label: 'Threats Blocked' },
    { value: '24/7', label: 'AI Monitoring' },
    { value: '500+', label: 'Enterprise Clients' },
  ];

  const features = [
    { icon: Lock, title: 'Zero-Trust Security', description: 'Every access request is verified, authenticated, and authorized.' },
    { icon: Zap, title: 'Real-Time Detection', description: 'AI-powered threat detection responds in milliseconds.' },
    { icon: Users, title: 'Expert Support', description: 'Dedicated security experts available around the clock.' },
    { icon: Activity, title: 'Continuous Monitoring', description: 'Non-stop surveillance of your digital infrastructure.' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-slate-950 overflow-hidden">
        <ParticlesBackground />
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div {...fadeUp} className="text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-mono text-indigo-300">Enterprise-Grade Security</span>
              </motion.div>
              
              <h1 className="font-syne text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[0.95] tracking-tight mb-6">
                Protect Your
                <br />
                <span className="gradient-text">Digital Future</span>
              </h1>
              
              <p className="text-lg text-slate-400 max-w-lg mb-10 leading-relaxed">
                Guardian AI delivers premium cybersecurity powered by artificial intelligence. 
                Stay ahead of threats with our advanced protection systems.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/contact" data-testid="hero-cta">
                  <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 active:scale-95">
                    Get Protected
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/services/data-device-protection" data-testid="hero-services">
                  <Button variant="outline" className="border-2 border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105">
                    View Services
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Floating Shield */}
                <div className="absolute top-0 right-0 animate-float">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/30 rounded-3xl blur-2xl" />
                    <div className="relative glass p-8 rounded-3xl">
                      <Shield className="w-16 h-16 text-indigo-400" />
                    </div>
                  </div>
                </div>
                
                {/* Main Image */}
                <div className="relative mt-16 ml-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-3xl blur-xl" />
                  <img
                    src="https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwYWJzdHJhY3QlMjBuZXR3b3JrJTIwbm9kZXMlMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwwfHx8Ymx1ZXwxNzY2MTE1OTAyfDA&ixlib=rb-4.1.0&q=85"
                    alt="Cybersecurity"
                    className="relative rounded-3xl shadow-2xl border border-white/10"
                  />
                </div>
                
                {/* Floating Stats Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute bottom-8 left-0 glass p-4 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Threat Blocked</p>
                      <p className="text-slate-400 text-sm">Just now</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Ticker */}
      <section className="bg-slate-950 border-y border-white/10 py-6 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...stats, ...stats].map((stat, i) => (
            <div key={i} className="flex items-center mx-12">
              <span className="font-mono text-2xl font-bold text-indigo-400 mr-3">{stat.value}</span>
              <span className="text-slate-500 uppercase tracking-widest text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 lg:py-32 bg-slate-50" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="font-mono text-indigo-600 uppercase tracking-widest text-sm">Our Services</span>
            <h2 className="font-syne text-4xl md:text-5xl font-bold text-slate-900 mt-4">
              Premium Security Solutions
            </h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              Choose from our comprehensive suite of cybersecurity services designed to protect your business.
            </p>
          </motion.div>

          <motion.div {...stagger} className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => {
              const IconComponent = iconMap[service.icon] || Shield;
              return (
                <motion.div key={service.id} {...fadeUp} transition={{ delay: i * 0.1 }}>
                  <Link to={`/services/${service.slug}`} data-testid={`service-card-${service.slug}`}>
                    <Card className="group h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden card-hover">
                      <CardContent className="p-8">
                        <div className="relative mb-6">
                          <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        
                        <h3 className="font-syne text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                          {service.title}
                        </h3>
                        
                        <p className="text-slate-600 mb-6 leading-relaxed">
                          {service.short_description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-2xl font-bold text-indigo-600">
                            ${service.pricing?.[0]?.price || 199}
                          </span>
                          <span className="text-indigo-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            Learn More <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="font-mono text-indigo-600 uppercase tracking-widest text-sm">Why Choose Us</span>
            <h2 className="font-syne text-4xl md:text-5xl font-bold text-slate-900 mt-4">
              What We Offer
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-syne text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-24 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <span className="font-mono text-indigo-600 uppercase tracking-widest text-sm">About Us</span>
              <h2 className="font-syne text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
                Securing Tomorrow's
                <br />Digital World
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Guardian AI was founded with a singular mission: to democratize enterprise-grade 
                cybersecurity for businesses of all sizes. Our team of security experts and AI 
                engineers work tirelessly to stay ahead of emerging threats.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                With over a decade of combined experience in cybersecurity and artificial 
                intelligence, we've built a platform that's both powerful and accessible.
              </p>
              <Link to="/about" data-testid="about-link">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 py-6 font-semibold transition-all duration-300 hover:scale-105">
                  Learn More About Us
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
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
                src="https://images.unsplash.com/photo-1758518727477-3885839edee7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBvZmZpY2UlMjB0ZWFtJTIwbWVldGluZyUyMHByb2Zlc3Npb25hbHxlbnwwfHx8fDE3NjYxMTU5MDV8MA&ixlib=rb-4.1.0&q=85"
                alt="Team"
                className="relative rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-syne text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Secure Your Business?
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
              Get started with Guardian AI today and experience premium cybersecurity protection powered by artificial intelligence.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" data-testid="cta-contact">
                <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg shadow-indigo-500/25">
                  Contact Us Today
                </Button>
              </Link>
              <Link to="/services/data-device-protection" data-testid="cta-services">
                <Button variant="outline" className="border-2 border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg font-semibold">
                  Explore Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
