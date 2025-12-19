import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('loading');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const pollPaymentStatus = async () => {
      try {
        const response = await axios.get(`${API}/payments/status/${sessionId}`);
        
        if (response.data.payment_status === 'paid') {
          setStatus('success');
          setPaymentDetails(response.data);
        } else if (response.data.status === 'expired') {
          setStatus('expired');
        } else if (attempts < 5) {
          setAttempts((prev) => prev + 1);
          setTimeout(pollPaymentStatus, 2000);
        } else {
          setStatus('pending');
          setPaymentDetails(response.data);
        }
      } catch (err) {
        if (attempts < 5) {
          setAttempts((prev) => prev + 1);
          setTimeout(pollPaymentStatus, 2000);
        } else {
          setStatus('error');
        }
      }
    };

    pollPaymentStatus();
  }, [sessionId, attempts]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
            <h1 className="font-syne text-3xl font-bold text-slate-900 mb-4">
              Processing Payment
            </h1>
            <p className="text-slate-600 mb-2">
              Please wait while we confirm your payment...
            </p>
            <p className="text-sm text-slate-400">
              Attempt {attempts + 1} of 5
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="font-syne text-3xl font-bold text-slate-900 mb-4" data-testid="success-title">
              Payment Successful!
            </h1>
            <p className="text-slate-600 mb-8">
              Thank you for your purchase. You will receive a confirmation email shortly.
            </p>
            {paymentDetails && (
              <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-slate-900 mb-4">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount</span>
                    <span className="font-medium text-slate-900">
                      ${paymentDetails.amount} {paymentDetails.currency?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status</span>
                    <span className="font-medium text-green-600">Paid</span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" data-testid="back-home">
                <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 rounded-full px-8">
                  Back to Home
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="rounded-full px-8">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-yellow-600" />
            </div>
            <h1 className="font-syne text-3xl font-bold text-slate-900 mb-4">
              Payment Processing
            </h1>
            <p className="text-slate-600 mb-8">
              Your payment is being processed. Please check your email for confirmation.
            </p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full px-8">
                Back to Home
              </Button>
            </Link>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-8 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="font-syne text-3xl font-bold text-slate-900 mb-4">
              Session Expired
            </h1>
            <p className="text-slate-600 mb-8">
              Your payment session has expired. Please try again.
            </p>
            <Link to="/services/data-device-protection">
              <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full px-8">
                Try Again
              </Button>
            </Link>
          </div>
        );

      case 'error':
      default:
        return (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-8 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="font-syne text-3xl font-bold text-slate-900 mb-4">
              Something Went Wrong
            </h1>
            <p className="text-slate-600 mb-8">
              We couldn't verify your payment. Please contact support if you believe this is an error.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="outline" className="rounded-full px-8">
                  Back to Home
                </Button>
              </Link>
              <Link to="/contact">
                <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full px-8">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20 pb-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 md:p-12"
        data-testid="payment-status"
      >
        {renderContent()}
      </motion.div>
    </div>
  );
}
