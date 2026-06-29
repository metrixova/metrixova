import { FormEvent, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Cloud,
  Activity,
  FileText,
  Webhook,
  Wrench,
  BoxIcon,
  Settings,
  User,
  BarChart3,
  LogOut,
  Save,
  Copy,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  TrendingUp,
  Zap,
  Download,
  Filter,
  Search,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Cpu,
  Database,
  Network,
  Lock,
  Bell,
  Mail,
  Gauge,
  LineChart,
  PieChart,
  X,
} from 'lucide-react';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../firebase';

type DashboardTab = 'overview' | 'analytics' | 'settings' | 'account' | 'monitoring' | 'reporting';


export function Dashboard({ theme, setTheme }: { theme: 'dark' | 'light'; setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>; }) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [showApiKey, setShowApiKey] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [apiKey] = useState('metrix_live_7f3b9e2c1a5d8b6f4e7c2a9d1e5f8b3c');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null);
  const [realtimeData, setRealtimeData] = useState([48, 52, 45, 58, 63, 71, 68, 75, 82]);
  const [cpuUsage, setCpuUsage] = useState(42);
  const [memoryUsage, setMemoryUsage] = useState(67);
  const [networkThroughput, setNetworkThroughput] = useState(89);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authStatus, setAuthStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [authError, setAuthError] = useState('');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  // Simulate real-time data updates
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    const interval = setInterval(() => {
      setRealtimeData(prev => [...prev.slice(1), Math.random() * 100]);
      setCpuUsage(Math.floor(Math.random() * 100));
      setMemoryUsage(Math.floor(Math.random() * 100));
      setNetworkThroughput(Math.floor(Math.random() * 100));
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const advancedMetrics = [
    { label: 'Data Sources', value: '6', status: 'active', trend: 'up', change: '+2 this month' },
    { label: 'Events/sec', value: '2.4M', status: 'nominal', trend: 'up', change: '+340K' },
    { label: 'System Uptime', value: '99.97%', status: 'active', trend: 'up', change: '+0.12%' },
    { label: 'Alerts (24h)', value: '23', status: 'warning', trend: 'down', change: '-5 from yesterday' },
    { label: 'API Latency', value: '145ms', status: 'active', trend: 'down', change: '-25ms' },
    { label: 'Error Rate', value: '0.02%', status: 'active', trend: 'down', change: '-0.01%' },
  ];

  const advancedConnectors = [
    { icon: Cloud, label: 'Cloud Infrastructure Platforms', status: 'connected', uptime: '100%', latency: '12ms' },
    { icon: Activity, label: 'Application Performance Monitoring', status: 'connected', uptime: '99.98%', latency: '8ms' },
    { icon: BoxIcon, label: 'Kubernetes & Container Environments', status: 'connected', uptime: '99.95%', latency: '15ms' },
    { icon: FileText, label: 'Logging & Telemetry Systems', status: 'syncing', uptime: '99.92%', latency: '22ms' },
    { icon: Webhook, label: 'Business Application APIs', status: 'connected', uptime: '99.99%', latency: '5ms' },
    { icon: Wrench, label: 'DevOps Toolchains', status: 'error', uptime: '98.50%', latency: '245ms' },
  ];

  const alertHistory = [
    { id: 1, severity: 'Critical', message: 'API latency spike detected', time: '2h ago', resolved: false },
    { id: 2, severity: 'High', message: 'Memory leak in service-auth detected', time: '4h ago', resolved: true },
    { id: 3, severity: 'Medium', message: 'Database query timeout on analytics_db', time: '6h ago', resolved: true },
    { id: 4, severity: 'Low', message: 'Disk usage at 85% on server-03', time: '8h ago', resolved: false },
    { id: 5, severity: 'Medium', message: 'CPU usage spike on primary cluster', time: '12h ago', resolved: true },
  ];

  const activeIncidents = alertHistory.filter(a => !a.resolved);
  const resolvedIncidents = alertHistory.filter(a => a.resolved);

  const usageLogs = [
    { action: 'API Key Generated', user: 'Alexandra Chen', time: '2 hours ago', status: 'success' },
    { action: 'Settings Updated', user: 'Alexandra Chen', time: '5 hours ago', status: 'success' },
    { action: 'Theme Changed to Light', user: 'Alexandra Chen', time: '1 day ago', status: 'success' },
    { action: 'Data Export Requested', user: 'Alexandra Chen', time: '3 days ago', status: 'success' },
    { action: 'MFA Enabled', user: 'Alexandra Chen', time: '1 week ago', status: 'success' },
  ];

  const systemHealth = [
    { name: 'Server-01', status: 'healthy', cpu: 34, memory: 52, disk: 68 },
    { name: 'Server-02', status: 'healthy', cpu: 45, memory: 61, disk: 72 },
    { name: 'Server-03', status: 'warning', cpu: 78, memory: 82, disk: 85 },
    { name: 'Database-Primary', status: 'healthy', cpu: 28, memory: 45, disk: 55 },
    { name: 'Database-Replica', status: 'healthy', cpu: 22, memory: 38, disk: 48 },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Activity },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'monitoring' as const, label: 'Monitoring', icon: Gauge },
    { id: 'reporting' as const, label: 'Reporting', icon: PieChart },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
    { id: 'account' as const, label: 'Account', icon: User },
  ];

  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-metrix-bg text-metrix-white' : 'bg-[#F4F4F5] text-[#1E1E20]';
  const cardClass = isDark ? 'bg-metrix-surface/50 border-metrix-surface' : 'bg-white border-[#E5E7EB]';
  const cardBgClass = isDark ? 'bg-metrix-bg/50 border-metrix-surface/50' : 'bg-[#F9FAFB] border-[#E5E7EB]';
  const labelClass = isDark ? 'text-metrix-muted' : 'text-[#6B7280]';

  const filteredAlerts = alertHistory.filter(alert => {
    const matchesSearch = alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || (selectedFilter === 'active' && !alert.resolved) || (selectedFilter === 'resolved' && alert.resolved);
    return matchesSearch && matchesFilter;
  });

  const handleAuthSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthStatus('loading');
    setAuthError('');

    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        if (authName.trim()) {
          await updateProfile(userCredential.user, { displayName: authName.trim() });
        }
      }
      setAuthStatus('success');
      setTimeout(() => {
        setAuthModalOpen(false);
        setAuthStatus('idle');
      }, 1000);
    } catch (error: any) {
      setAuthStatus('error');
      setAuthError(error.message || 'Unable to authenticate.');
    }
  };

  return (
    <div className={`pt-4 pb-12 min-h-screen ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-display mb-2">Command Center</h1>
              <p className={`text-sm ${labelClass}`}>
                Advanced Observability Platform · Real-time Monitoring
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-sm font-mono text-green-500">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                System Operational
              </span>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className={`flex gap-2 border-b overflow-x-auto pb-4 ${isDark ? 'border-metrix-surface' : 'border-[#E5E7EB]'}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 font-medium transition-colors border-b-2 -mb-4 whitespace-nowrap ${
                  activeTab === tab.id
                    ? `border-metrix-crimson-bright ${isDark ? 'text-metrix-white' : 'text-[#1E1E20]'}`
                    : isDark
                    ? 'border-transparent text-metrix-muted hover:text-metrix-white'
                    : 'border-transparent text-[#6B7280] hover:text-[#1E1E20]'
                }`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Advanced Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {advancedMetrics.map((metric, i) => (
                <motion.div key={i} whileHover={{ scale: 1.02 }} className={`rounded-2xl p-6 border ${cardClass}`}>
                  <div className={`text-sm font-mono uppercase tracking-widest ${labelClass} mb-3`}>
                    {metric.label}
                  </div>
                  <div className="flex items-end justify-between mb-2">
                    <div className="text-3xl font-mono font-bold">{metric.value}</div>
                    <div className={`flex items-center gap-1 text-xs ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      {metric.change}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        metric.status === 'active' ? 'bg-green-500' : metric.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="text-xs capitalize">{metric.status === 'active' ? 'Optimal' : 'Monitor'}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Advanced Data Sources with Real-time Status */}
            <div className={`rounded-3xl p-8 border ${cardClass}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display">Real-time Data Sources</h2>
                <button className={`px-3 py-2 rounded-lg border ${isDark ? 'border-metrix-surface hover:bg-metrix-surface/50' : 'border-[#E5E7EB] hover:bg-[#F9FAFB]'} transition-colors flex items-center gap-2`}>
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advancedConnectors.map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer hover:border-metrix-crimson-bright ${cardBgClass}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${labelClass}`} />
                        <div>
                          <span className="text-sm font-medium block">{item.label}</span>
                          <span className={`text-xs ${labelClass}`}>
                            {item.status === 'connected' ? '✓ Connected' : item.status === 'syncing' ? '⟳ Syncing' : '⚠ Error'}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          item.status === 'connected' ? 'bg-green-500' : item.status === 'syncing' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={labelClass}>
                        <div className="font-mono text-[10px]">UPTIME</div>
                        <div className="font-mono font-bold text-metrix-white mt-1">{item.uptime}</div>
                      </div>
                      <div className={labelClass}>
                        <div className="font-mono text-[10px]">LATENCY</div>
                        <div className="font-mono font-bold text-metrix-white mt-1">{item.latency}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Real-time Performance Chart */}
            <div className={`rounded-3xl p-8 border ${cardClass}`}>
              <h2 className="text-xl font-display mb-6 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-metrix-crimson-bright" />
                Real-time Performance Metrics
              </h2>
              
              {/* Animated Chart Simulation */}
              <div className={`h-64 rounded-xl border ${cardBgClass} relative overflow-hidden p-4`}>
                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line key={`h${i}`} x1="0" y1={i * 40} x2="500" y2={i * 40} stroke={isDark ? '#555555' : '#E5E7EB'} strokeDasharray="5,5" opacity="0.3" />
                  ))}
                  {/* Data line */}
                  <motion.polyline
                    points={realtimeData.map((v, i) => `${(i / 8) * 500},${200 - (v / 100) * 180}`).join(' ')}
                    fill="none"
                    stroke="#BA181B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </svg>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <span className="font-mono font-bold text-metrix-crimson-bright">{cpuUsage}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-metrix-surface' : 'bg-[#E5E7EB]'}`}>
                    <motion.div
                      className="h-full bg-gradient-to-r from-metrix-crimson-dark to-metrix-crimson-bright"
                      style={{ width: `${cpuUsage}%` }}
                      animate={{ width: `${cpuUsage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className="font-mono font-bold text-amber-500">{memoryUsage}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-metrix-surface' : 'bg-[#E5E7EB]'}`}>
                    <motion.div
                      className="h-full bg-amber-500"
                      style={{ width: `${memoryUsage}%` }}
                      animate={{ width: `${memoryUsage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Network</span>
                    <span className="font-mono font-bold text-red-500">{networkThroughput}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-metrix-surface' : 'bg-[#E5E7EB]'}`}>
                    <motion.div
                      className="h-full bg-red-500"
                      style={{ width: `${networkThroughput}%` }}
                      animate={{ width: `${networkThroughput}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Incidents Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`rounded-3xl p-8 border ${cardClass}`}>
                <h3 className="text-lg font-display mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Active Incidents ({activeIncidents.length})
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {activeIncidents.map((incident) => (
                    <motion.div key={incident.id} whileHover={{ scale: 1.02 }} className={`p-3 rounded-xl border ${cardBgClass}`}>
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium">{incident.message}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          incident.severity === 'Critical' ? 'bg-red-500/20 text-red-500' : 
                          incident.severity === 'High' ? 'bg-orange-500/20 text-orange-500' : 'bg-amber-500/20 text-amber-500'
                        }`}>{incident.severity}</span>
                      </div>
                      <div className={`text-xs mt-2 ${labelClass}`}>{incident.time}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className={`rounded-3xl p-8 border ${cardClass}`}>
                <h3 className="text-lg font-display mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Resolved ({resolvedIncidents.length})
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {resolvedIncidents.map((incident) => (
                    <motion.div key={incident.id} whileHover={{ scale: 1.02 }} className={`p-3 rounded-xl border ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'}`}>
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium line-through opacity-75">{incident.message}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">Resolved</span>
                      </div>
                      <div className={`text-xs mt-2 ${labelClass}`}>{incident.time}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'monitoring' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className={`rounded-3xl p-8 border ${cardClass}`}>
              <h2 className="text-xl font-display mb-6 flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                System Health Monitor
              </h2>
              <div className="space-y-4">
                {systemHealth.map((server, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.01 }} className={`p-4 rounded-xl border ${cardBgClass}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${server.status === 'healthy' ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <span className="font-mono font-bold">{server.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${server.status === 'healthy' ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'}`}>
                        {server.status === 'healthy' ? 'Healthy' : 'Warning'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs mb-1">CPU</div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-metrix-surface' : 'bg-[#E5E7EB]'}`}>
                          <div className="h-full w-[34%] bg-metrix-crimson-bright rounded-full" style={{ width: `${server.cpu}%` }} />
                        </div>
                        <div className="text-xs mt-1 font-mono">{server.cpu}%</div>
                      </div>
                      <div>
                        <div className="text-xs mb-1">Memory</div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-metrix-surface' : 'bg-[#E5E7EB]'}`}>
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${server.memory}%` }} />
                        </div>
                        <div className="text-xs mt-1 font-mono">{server.memory}%</div>
                      </div>
                      <div>
                        <div className="text-xs mb-1">Disk</div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-metrix-surface' : 'bg-[#E5E7EB]'}`}>
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${server.disk}%` }} />
                        </div>
                        <div className="text-xs mt-1 font-mono">{server.disk}%</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'reporting' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className={`rounded-3xl p-8 border ${cardClass}`}>
              <h2 className="text-xl font-display mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Activity Logs
              </h2>
              <div className="space-y-2">
                {usageLogs.map((log, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${cardBgClass}`}>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <div>
                        <div className="text-sm font-medium">{log.action}</div>
                        <div className={`text-xs ${labelClass}`}>{log.user}</div>
                      </div>
                    </div>
                    <div className={`text-xs ${labelClass}`}>{log.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alert History with Search and Filter */}
            <div className={`rounded-3xl p-8 border ${cardClass}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display">Alert History</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedFilter === 'all' ? 'border-metrix-crimson-bright bg-metrix-crimson-bright/10 text-metrix-crimson-bright' : isDark ? 'border-metrix-surface' : 'border-[#E5E7EB]'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSelectedFilter('active')}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedFilter === 'active' ? 'border-metrix-crimson-bright bg-metrix-crimson-bright/10 text-metrix-crimson-bright' : isDark ? 'border-metrix-surface' : 'border-[#E5E7EB]'}`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setSelectedFilter('resolved')}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedFilter === 'resolved' ? 'border-metrix-crimson-bright bg-metrix-crimson-bright/10 text-metrix-crimson-bright' : isDark ? 'border-metrix-surface' : 'border-[#E5E7EB]'}`}
                  >
                    Resolved
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 bg-transparent border-0 outline-none text-sm placeholder-opacity-50`}
                />
              </div>
              <div className="space-y-2">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className={`flex items-center justify-between p-3 rounded-xl border ${cardBgClass}`}>
                    <div className="flex items-center gap-3">
                      {alert.severity === 'Critical' ? <Zap className="w-4 h-4 text-red-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
                      <div>
                        <div className="text-sm font-medium">{alert.message}</div>
                        <div className={`text-xs ${labelClass}`}>{alert.time}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      alert.severity === 'Critical' ? 'bg-red-500/20 text-red-500' :
                      alert.severity === 'High' ? 'bg-orange-500/20 text-orange-500' :
                      alert.severity === 'Medium' ? 'bg-amber-500/20 text-amber-500' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>{alert.severity}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className={`rounded-3xl p-8 border ${cardClass}`}>
              <h2 className="text-xl font-display mb-6">Advanced Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Theme Mode</div>
                    <div className={`text-sm ${labelClass}`}>Currently using {theme === 'dark' ? 'dark' : 'light'} mode</div>
                  </div>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="px-4 py-2 rounded-lg border border-metrix-crimson-bright bg-metrix-crimson-bright/10 text-metrix-crimson-bright hover:bg-metrix-crimson-bright/20 transition-colors">
                    Toggle
                  </button>
                </div>

                {[
                  { icon: Bell, label: 'Push Notifications', desc: 'Get alerts on critical incidents', state: notificationsEnabled, setState: setNotificationsEnabled },
                  { icon: Mail, label: 'Email Digest', desc: 'Daily summary of activities', state: emailNotifications, setState: setEmailNotifications },
                ].map((item, i) => (
                  <div key={i} className={`border-t ${isDark ? 'border-metrix-surface' : 'border-[#E5E7EB]'} pt-6`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className={`text-sm ${labelClass}`}>{item.desc}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => item.setState(!item.state)}
                        className={`w-12 h-6 rounded-full transition-colors ${item.state ? 'bg-green-500' : isDark ? 'bg-metrix-surface' : 'bg-[#D1D5DB]'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${item.state ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-8 px-6 py-2 rounded-lg bg-metrix-crimson-bright hover:bg-metrix-crimson text-white font-medium transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'account' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className={`rounded-3xl p-8 border ${cardClass}`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-display mb-2">Dashboard Appearance</h2>
                  <p className={`text-sm ${labelClass}`}>Switch between dark and light mode for this dashboard view.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`px-4 py-2 rounded-lg border transition-colors ${isDark ? 'border-metrix-surface bg-metrix-surface/70 text-metrix-white hover:bg-metrix-surface' : 'border-[#E5E7EB] bg-white text-[#1E1E20] hover:bg-[#F3F4F6]'}`}
                >
                  {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`rounded-3xl p-8 border ${cardClass}`}>
                <h2 className="text-xl font-display mb-6">Profile</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Full Name', value: 'Alexandra Chen' },
                    { label: 'Email', value: 'alex@metrixova.com' },
                    { label: 'Role', value: 'Organization Admin' },
                  ].map((field, i) => (
                    <div key={i}>
                      <label className={`text-xs font-mono uppercase tracking-wider ${labelClass} mb-2 block`}>{field.label}</label>
                      <div className={`rounded-xl border p-3 ${cardBgClass}`}>{field.value}</div>
                    </div>
                  ))}
                </div>
                <button className="mt-6 px-4 py-2 rounded-lg border border-metrix-surface hover:border-metrix-crimson-bright transition-colors">
                  Edit Profile
                </button>
              </div>

              <div className={`rounded-3xl p-8 border ${cardClass}`}>
                <h2 className="text-xl font-display mb-6">API Keys</h2>
                <div className={`rounded-xl border p-4 mb-4 ${cardBgClass} font-mono text-sm flex items-center justify-between`}>
                  <span>{showApiKey ? apiKey : '••••••••••••••••••••••••••••••••'}</span>
                  <button onClick={() => setShowApiKey(!showApiKey)} className={`${labelClass} hover:text-metrix-white transition-colors`}>
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button className="w-full px-4 py-2 rounded-lg border border-metrix-surface hover:border-metrix-crimson-bright transition-colors flex items-center justify-center gap-2 mb-2">
                  <Copy className="w-4 h-4" />
                  Copy API Key
                </button>
                <button className="w-full px-4 py-2 rounded-lg border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors">
                  Regenerate Key
                </button>
              </div>
            </div>

            <div className={`rounded-3xl p-8 border ${cardClass}`}>
              <h2 className="text-xl font-display mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                Security
              </h2>
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${isDark ? 'border-green-500/30 bg-green-500/5' : 'border-green-500/20 bg-green-50'}`}>
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className={`text-sm ${labelClass}`}>Enabled · TOTP authenticator</div>
                  </div>
                  <div className="text-green-500">✓</div>
                </div>
              </div>
            </div>

            <button className={`w-full px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors border border-red-500/50 text-red-500 ${isDark ? 'bg-red-500/10 hover:bg-red-500/20' : 'bg-red-50 hover:bg-red-100'}`}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-metrix-bg/80 backdrop-blur-sm"
              onClick={() => setAuthModalOpen(false)}
            />
            <motion.div
              key="auth-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-metrix-surface border border-metrix-crimson-dark rounded-3xl shadow-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-metrix-crimson-dark via-metrix-crimson-bright to-metrix-crimson-dark" />
              <button
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 text-metrix-muted hover:text-metrix-white transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              <div className="p-8">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-display text-white mb-2">
                    {authMode === 'login' ? 'Sign in to your dashboard' : 'Create your Metrixova account'}
                  </h2>
                  <p className="text-sm text-metrix-muted">
                    {authMode === 'login'
                      ? 'Enter your email and password to continue.'
                      : 'Register and start monitoring your observability pipeline.'}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${authMode === 'login' ? 'bg-metrix-crimson-bright text-white' : 'bg-metrix-bg/50 text-metrix-muted hover:bg-metrix-bg'}`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${authMode === 'signup' ? 'bg-metrix-crimson-bright text-white' : 'bg-metrix-bg/50 text-metrix-muted hover:bg-metrix-bg'}`}
                  >
                    Sign Up
                  </button>
                </div>
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authMode === 'signup' && (
                    <div>
                      <label htmlFor="authName" className="block text-xs font-mono text-metrix-muted mb-1 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        id="authName"
                        type="text"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="Jane Doe"
                        required
                        className="w-full bg-metrix-bg border border-metrix-surface/70 rounded-xl px-4 py-3 text-white placeholder:text-metrix-muted focus:outline-none focus:border-metrix-crimson-bright focus:ring-1 focus:ring-metrix-crimson-bright"
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor="authEmail" className="block text-xs font-mono text-metrix-muted mb-1 uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      id="authEmail"
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="jane@company.com"
                      required
                      className="w-full bg-metrix-bg border border-metrix-surface/70 rounded-xl px-4 py-3 text-white placeholder:text-metrix-muted focus:outline-none focus:border-metrix-crimson-bright focus:ring-1 focus:ring-metrix-crimson-bright"
                    />
                  </div>
                  <div>
                    <label htmlFor="authPassword" className="block text-xs font-mono text-metrix-muted mb-1 uppercase tracking-wider">
                      Password
                    </label>
                    <input
                      id="authPassword"
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-metrix-bg border border-metrix-surface/70 rounded-xl px-4 py-3 text-white placeholder:text-metrix-muted focus:outline-none focus:border-metrix-crimson-bright focus:ring-1 focus:ring-metrix-crimson-bright"
                    />
                  </div>
                  {authError && <p className="text-sm text-red-500">{authError}</p>}
                  <button
                    type="submit"
                    disabled={authStatus === 'loading'}
                    className="w-full mt-2 rounded-xl bg-metrix-crimson-bright px-4 py-3 text-white font-medium hover:bg-metrix-crimson transition-colors disabled:opacity-70"
                  >
                    {authStatus === 'loading'
                      ? 'Working…'
                      : authMode === 'login'
                      ? 'Log In'
                      : 'Sign Up'}
                  </button>
                </form>
                {authStatus === 'success' && (
                  <p className="mt-4 text-center text-sm text-green-400">Authentication successful. Closing shortly…</p>
                )}
                {currentUser && (
                  <div className="mt-6 rounded-2xl border border-metrix-surface p-4 bg-metrix-bg/60 text-sm">
                    Signed in as <span className="font-medium">{currentUser.displayName || currentUser.email}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}