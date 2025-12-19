import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Users, MessageSquare, DollarSign, Mail, LogOut,
  BarChart3, Activity, ChevronRight, Loader2, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminDashboardPage() {
  const { user, logout, getToken, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [chatAnalytics, setChatAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/admin/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [statsRes, contactsRes, paymentsRes, chatRes] = await Promise.all([
        axios.get(`${API}/admin/dashboard`, { headers }),
        axios.get(`${API}/admin/contacts`, { headers }),
        axios.get(`${API}/admin/payments`, { headers }),
        axios.get(`${API}/admin/chat-analytics`, { headers }),
      ]);

      setStats(statsRes.data);
      setContacts(contactsRes.data);
      setPayments(paymentsRes.data);
      setChatAnalytics(chatRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId, status) => {
    const token = getToken();
    try {
      await axios.put(
        `${API}/admin/contacts/${contactId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status updated');
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const statCards = [
    { label: 'Total Revenue', value: `$${stats?.total_revenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    { label: 'Total Payments', value: stats?.total_payments || 0, icon: BarChart3, color: 'from-indigo-500 to-violet-500' },
    { label: 'Chat Sessions', value: stats?.total_chat_sessions || 0, icon: MessageSquare, color: 'from-cyan-500 to-blue-500' },
    { label: 'Contact Submissions', value: stats?.total_contacts || 0, icon: Mail, color: 'from-orange-500 to-red-500' },
  ];

  // Chart data
  const paymentChartData = [
    { name: 'Paid', value: stats?.successful_payments || 0 },
    { name: 'Pending', value: (stats?.total_payments || 0) - (stats?.successful_payments || 0) },
  ];
  const COLORS = ['#22c55e', '#f59e0b'];

  return (
    <div className="min-h-screen bg-slate-950 pt-20" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="font-syne text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Welcome back, {user.name}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="mt-4 md:mt-0 border-white/20 text-white hover:bg-white/10 rounded-full"
            data-testid="logout-btn"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-900 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <Activity className="w-4 h-4 text-slate-500" />
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="bg-slate-900 border border-white/10 p-1">
            <TabsTrigger value="contacts" className="data-[state=active]:bg-indigo-500 rounded-lg">
              Contact Submissions
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-indigo-500 rounded-lg">
              Payments
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-500 rounded-lg">
              Chat Analytics
            </TabsTrigger>
          </TabsList>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <Card className="bg-slate-900 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Recent Contact Submissions
                  <Badge className="ml-2 bg-indigo-500">{stats?.new_contacts || 0} New</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-slate-400">Name</TableHead>
                        <TableHead className="text-slate-400">Email</TableHead>
                        <TableHead className="text-slate-400">Subject</TableHead>
                        <TableHead className="text-slate-400">Status</TableHead>
                        <TableHead className="text-slate-400">Date</TableHead>
                        <TableHead className="text-slate-400">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => (
                        <TableRow key={contact.id} className="border-white/10">
                          <TableCell className="text-white font-medium">{contact.name}</TableCell>
                          <TableCell className="text-slate-300">{contact.email}</TableCell>
                          <TableCell className="text-slate-300 max-w-[200px] truncate">{contact.subject}</TableCell>
                          <TableCell>
                            <Badge className={contact.status === 'new' ? 'bg-yellow-500' : contact.status === 'contacted' ? 'bg-green-500' : 'bg-slate-500'}>
                              {contact.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-400 text-sm">
                            {new Date(contact.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <select
                              value={contact.status}
                              onChange={(e) => updateContactStatus(contact.id, e.target.value)}
                              className="bg-slate-800 text-white text-sm rounded px-2 py-1 border border-white/10"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </TableCell>
                        </TableRow>
                      ))}
                      {contacts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                            No contact submissions yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-slate-900 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Payment Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[350px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10">
                          <TableHead className="text-slate-400">Service</TableHead>
                          <TableHead className="text-slate-400">Amount</TableHead>
                          <TableHead className="text-slate-400">Status</TableHead>
                          <TableHead className="text-slate-400">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id} className="border-white/10">
                            <TableCell className="text-white">{payment.pricing_name}</TableCell>
                            <TableCell className="text-slate-300">${payment.amount}</TableCell>
                            <TableCell>
                              <Badge className={payment.payment_status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}>
                                {payment.payment_status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-400 text-sm">
                              {new Date(payment.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        {payments.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-slate-400 py-8">
                              No payment transactions yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Payment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {paymentChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                          labelStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-slate-400 text-sm">Paid</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-slate-400 text-sm">Pending</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Chat Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Chat Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 rounded-xl p-4">
                      <p className="text-3xl font-bold text-white">{chatAnalytics?.total_messages || 0}</p>
                      <p className="text-slate-400 text-sm">Total Messages</p>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-4">
                      <p className="text-3xl font-bold text-white">{chatAnalytics?.unique_sessions || 0}</p>
                      <p className="text-slate-400 text-sm">Unique Sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Recent Chat Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-4">
                      {chatAnalytics?.recent_messages?.slice(0, 10).map((msg) => (
                        <div key={msg.id} className="bg-slate-800 rounded-lg p-3">
                          <p className="text-white text-sm mb-1">
                            <span className="text-indigo-400">User:</span> {msg.user_message.substring(0, 50)}...
                          </p>
                          <p className="text-slate-400 text-xs">
                            {new Date(msg.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))}
                      {(!chatAnalytics?.recent_messages || chatAnalytics.recent_messages.length === 0) && (
                        <p className="text-center text-slate-400 py-8">No chat messages yet</p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
