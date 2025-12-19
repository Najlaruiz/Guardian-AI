import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/contact`, formData);
      setSubmitted(true);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'contact@guardianai.com', href: 'mailto:contact@guardianai.com' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPin, label: 'Address', value: '123 Security Ave, San Francisco, CA 94102', href: '#' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center bg-slate-950 overflow-hidden pt-20" data-testid="contact-hero">
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
              <Mail className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-mono text-indigo-300">Get In Touch</span>
            </motion.div>
            
            <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Let's Start a
              <br />
              <span className="gradient-text">Conversation</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Have questions about our services? We're here to help you find the perfect security solution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div {...fadeUp}>
              <span className="font-mono text-indigo-600 uppercase tracking-widest text-sm">Contact Info</span>
              <h2 className="font-syne text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-8">
                Reach Out To Us
              </h2>
              
              <div className="space-y-6 mb-12">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                    data-testid={`contact-${info.label.toLowerCase()}`}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">{info.label}</p>
                      <p className="text-slate-900 font-medium group-hover:text-indigo-600 transition-colors">
                        {info.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="relative rounded-2xl overflow-hidden h-64 bg-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=400&fit=crop"
                  alt="Location"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-6">
                  <p className="text-white font-medium">San Francisco, California</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {submitted ? (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="font-syne text-2xl font-bold text-slate-900 mb-4">Message Sent!</h3>
                  <p className="text-slate-600 mb-8">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    variant="outline"
                    className="rounded-full"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-12" data-testid="contact-form">
                  <h3 className="font-syne text-2xl font-bold text-slate-900 mb-8">Send Us a Message</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="rounded-lg border-slate-200 focus:border-indigo-500"
                        data-testid="input-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="rounded-lg border-slate-200 focus:border-indigo-500"
                        data-testid="input-email"
                      />
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-700">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="rounded-lg border-slate-200 focus:border-indigo-500"
                        data-testid="input-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-slate-700">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can we help?"
                        className="rounded-lg border-slate-200 focus:border-indigo-500"
                        data-testid="input-subject"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-8">
                    <Label htmlFor="message" className="text-slate-700">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us about your security needs..."
                      rows={5}
                      className="rounded-lg border-slate-200 focus:border-indigo-500 resize-none"
                      data-testid="input-message"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-full py-6 font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                    data-testid="submit-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-syne text-3xl font-bold text-slate-900 mb-4">
              Need Quick Answers?
            </h2>
            <p className="text-slate-600 mb-8">
              Our AI assistant is available 24/7 to help answer your questions.
              Click the chat icon in the bottom right corner to get started.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                AI Assistant Online
              </span>
              <span>•</span>
              <span>Average Response: Instant</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
