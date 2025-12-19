import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin, Twitter, Linkedin, Github } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3" data-testid="footer-logo">
              <div className="bg-gradient-to-br from-indigo-500 to-violet-500 p-2 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="font-syne font-bold text-xl">
                Guardian<span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed">
              Premium AI-powered cybersecurity solutions for businesses and individuals. Protecting your digital future.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors" data-testid="footer-twitter">
                <Twitter className="w-5 h-5 text-slate-400 hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors" data-testid="footer-linkedin">
                <Linkedin className="w-5 h-5 text-slate-400 hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors" data-testid="footer-github">
                <Github className="w-5 h-5 text-slate-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-syne font-bold text-lg mb-6">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services/data-device-protection" className="text-slate-400 hover:text-white transition-colors" data-testid="footer-service-1">
                  Data & Device Protection
                </Link>
              </li>
              <li>
                <Link to="/services/cybersecurity-consultation" className="text-slate-400 hover:text-white transition-colors" data-testid="footer-service-2">
                  Cybersecurity Consultation
                </Link>
              </li>
              <li>
                <Link to="/services/automated-ai-solutions" className="text-slate-400 hover:text-white transition-colors" data-testid="footer-service-3">
                  Automated AI Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-syne font-bold text-lg mb-6">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors" data-testid="footer-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors" data-testid="footer-contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-slate-400 hover:text-white transition-colors" data-testid="footer-admin">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-syne font-bold text-lg mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400">contact@guardianai.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400">+1 (970) 555-0123</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400">Crested Butte, Colorado, USA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} Guardian AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
