import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Search, Cpu, ChevronRight, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import { toast } from 'sonner';
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

export default function ServicePage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`${API}/services/${slug}`);
        setService(res.data);
      } catch (err) {
        toast.error('Service not found');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  const handleCheckout = async (pricingId) => {
    setCheckoutLoading(pricingId);
    try {
      const response = await axios.post(`${API}/payments/checkout`, {
        service_id: service.id,
        pricing_id: pricingId,
        origin_url: window.location.origin,
      });
      
      console.log('Checkout response:', response.data);
      
      if (response.data.checkout_url) {
        toast.success('Redirecting to payment...');
        // Small delay to show the toast before redirect
        setTimeout(() => {
          window.location.href = response.data.checkout_url;
        }, 500);
      } else {
        toast.error('No checkout URL received. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.response?.data?.detail || 'Failed to initiate checkout. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <h1 className="font-syne text-4xl font-bold mb-4">Service Not Found</h1>
        <Link to="/">
          <Button className="bg-indigo-500 hover:bg-indigo-600 rounded-full">
            Go Back Home
          </Button>
        </Link>
      </div>
    );
  }

  const IconComponent = iconMap[service.icon] || Shield;

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center bg-slate-950 overflow-hidden pt-20">
        <ParticlesBackground />
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <motion.div {...fadeUp}>
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors" data-testid="back-link">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight" data-testid="service-title">
                  {service.title}
                </h1>
                <p className="text-xl text-slate-400 mt-4 max-w-2xl">
                  {service.short_description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div {...fadeUp}>
                <h2 className="font-syne text-3xl font-bold text-slate-900 mb-6">About This Service</h2>
                <p className="text-slate-600 leading-relaxed text-lg mb-12">
                  {service.full_description}
                </p>
                
                {/* Features */}
                <h3 className="font-syne text-2xl font-bold text-slate-900 mb-6">Features Included</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-12">
                  {service.features?.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm"
                    >
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-slate-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Service Image */}
                {service.image_url && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-2xl overflow-hidden shadow-xl"
                  >
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-80 object-cover"
                    />
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            {/* Pricing Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6 z-10">
                <h3 className="font-syne text-2xl font-bold text-slate-900 mb-4">Choose Your Plan</h3>
                
                {service.pricing?.map((plan, i) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="overflow-hidden border-2 border-slate-200 hover:border-indigo-300 transition-colors" data-testid={`pricing-card-${plan.id}`}>
                      <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
                        <CardTitle className="font-syne text-xl">{plan.name}</CardTitle>
                        <div className="mt-2">
                          <span className="text-4xl font-bold">${plan.price}</span>
                          <span className="text-slate-300 ml-2">/{plan.period}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <ul className="space-y-3 mb-6">
                          {plan.features?.map((feature, j) => (
                            <li key={j} className="flex items-center gap-2 text-slate-600">
                              <Check className="w-4 h-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button
                          onClick={() => handleCheckout(plan.id)}
                          disabled={checkoutLoading === plan.id}
                          className="relative z-20 w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-full py-6 font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                          data-testid={`checkout-btn-${plan.id}`}
                        >
                          {checkoutLoading === plan.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Get Started
                              <ChevronRight className="ml-2 w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-syne text-3xl font-bold text-slate-900">Explore Other Services</h2>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/services/data-device-protection" data-testid="other-service-1">
              <Button variant="outline" className="rounded-full px-6">Data & Device Protection</Button>
            </Link>
            <Link to="/services/cybersecurity-consultation" data-testid="other-service-2">
              <Button variant="outline" className="rounded-full px-6">Cybersecurity Consultation</Button>
            </Link>
            <Link to="/services/automated-ai-solutions" data-testid="other-service-3">
              <Button variant="outline" className="rounded-full px-6">Automated AI Solutions</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
