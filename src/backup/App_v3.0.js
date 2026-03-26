import React, { useState } from 'react';
import {
  Plus, Trash2, LogOut, ShieldCheck, Activity, Cpu,
  Database, CheckCircle, Box, ListChecks, ArrowRight,
  User, Lock, LayoutDashboard, Zap
} from 'lucide-react';
import ParticleBackground from './ParticleBackground';

// --- 子组件：退出确认弹窗 ---
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300 p-4">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-slate-100 transform animate-in zoom-in-95">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6 mx-auto">
          <LogOut size={32} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-2 text-center">确认退出？</h3>
        <p className="text-slate-500 mb-8 text-center">退出系统将清除当前未保存的录入数据。</p>
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-slate-100 font-bold text-slate-600 hover:bg-slate-200 transition-all">取消</button>
          <button onClick={onConfirm} className="flex-1 py-4 rounded-2xl bg-slate-900 font-bold text-white hover:bg-red-600 shadow-xl transition-all">确认</button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [riskReport, setRiskReport] = useState("等待系统扫描数据...");

  const [formData, setFormData] = useState({
    modeName: '', productName: '', quantity: '',
    ingredients: [{ id: Date.now(), name: '', percentage: '' }],
    baseInfo: [{ id: Date.now() + 1, key: '', value: '' }]
  });

  const handleInputChange = (field, value) => setFormData({ ...formData, [field]: value });
  const addRow = (type) => {
    const newRow = { id: Date.now(), name: '', percentage: '', key: '', value: '' };
    setFormData({ ...formData, [type]: [...formData[type], newRow] });
  };
  const removeRow = (type, id) => setFormData({ ...formData, [type]: formData[type].filter(item => item.id !== id) });
  const updateDynamicRow = (type, id, field, value) => {
    const updated = formData[type].map(item => item.id === id ? { ...item, [field]: value } : item);
    setFormData({ ...formData, [type]: updated });
  };

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 1200);
  };

  const runEvaluation = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRiskReport(`[DPFS 智能评估报告]\n生成时间: ${new Date().toLocaleString()}\n---------------------------\n商品: ${formData.productName || '未命名'}\n风险等级: 低风险 (SAFE)\n结论: 该农产品符合安全准入标准。`);
      setIsLoading(false);
    }, 2000);
  };

  // ==========================================
  // 1. 【原样保留】你满意的全屏粒子登录页面
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-white relative overflow-hidden">
        <ParticleBackground />
        <header className="relative z-10 w-full p-8 md:p-12 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-950">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">基于DPFS的农产品安全风险智能评估系统</h1>
          </div>
          <div className="text-sm font-mono text-emerald-400 bg-emerald-950 px-4 py-1.5 rounded-full border border-emerald-800">
            System Status: NOMINAL
          </div>
        </header>
        <main className="relative z-10 flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
            <div className="lg:col-span-3 space-y-6 text-left animate-in fade-in slide-in-from-left-6 duration-1000">
              <div className="inline-block px-4 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-full text-xs font-semibold tracking-widest uppercase">
                AI-Powered Security v2.0
              </div>
              <h2 className="text-5xl md:text-6xl font-black leading-tight tracking-tighter">
                为农产品供应链<br />注入<span className="text-emerald-500">智能与安全</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                利用分布式账本与深度学习算法，实时监测、评估并阻断农产品流转过程中的潜在风险。
              </p>
            </div>
            <div className="lg:col-span-2 space-y-10 animate-in fade-in slide-in-from-right-6 duration-1000 delay-300">
              <div>
                <h3 className="text-3xl font-extrabold tracking-tight mb-2">欢迎回来</h3>
                <p className="text-slate-500">请使用您的管理账号进行身份验证。</p>
              </div>
              <div className="space-y-6">
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input type="text" placeholder="输入管理账号" className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-900/50 border border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-lg" />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input type="text" placeholder="输入访问密钥 (密码)" className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-900/50 border border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-lg text-slate-400" />
                </div>
                <button onClick={handleLogin} className="group w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-500 transition-all transform hover:-translate-y-1 shadow-2xl shadow-emerald-950 flex items-center justify-center gap-3">
                  {isLoading ? "系统验证中..." : "验证身份进入系统"}
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </main>
        <footer className="relative z-10 w-full p-8 text-sm text-slate-700 font-mono text-center md:text-left">
          © 2026 DPFS Agriculture Security Lab.
        </footer>
      </div>
    );
  }

  // ==========================================
  // 2. 【全新修改】美化后的登录后工作台
  // ==========================================
  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden text-slate-900 relative">
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={() => setIsLoggedIn(false)} />

      {/* 极简侧边导轨 */}
      <aside className="w-24 flex flex-col items-center py-10 bg-white border-r border-slate-100 z-50">
        <div className="p-4 bg-slate-950 rounded-[2rem] text-emerald-500 mb-16 shadow-xl shadow-slate-200">
          <Zap size={28} fill="currentColor" />
        </div>
        <div className="flex-1 flex flex-col gap-10">
          <button className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm"><LayoutDashboard size={26} /></button>
          <button className="p-4 text-slate-300 hover:text-slate-600 transition-colors"><Database size={26} /></button>
          <button className="p-4 text-slate-300 hover:text-slate-600 transition-colors"><Activity size={26} /></button>
        </div>
        <button onClick={() => setShowLogoutModal(true)} className="p-4 text-slate-300 hover:text-red-500 transition-all">
          <LogOut size={28} />
        </button>
      </aside>

      <main className="flex-1 flex overflow-hidden">
        {/* 左侧录入区 */}
        <div className="flex-[1.3] h-full overflow-y-auto p-12 custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            <header className="mb-12">
              <span className="text-[10px] font-black tracking-[0.3em] text-emerald-600 uppercase mb-3 block">Security Collection</span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">智能风险评估录入</h2>
            </header>

            <div className="space-y-8">
              {/* 卡片1：基础 */}
              <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                  <h3 className="font-bold text-lg">核心商品参数</h3>
                </div>
                <div className="grid grid-cols-3 gap-8">
                  {[
                    { label: '扫描模式', key: 'modeName', ph: '标准模式' },
                    { label: '商品全称', key: 'productName', ph: '输入商品名' },
                    { label: '批次数量', key: 'quantity', ph: '0' }
                  ].map(item => (
                    <div key={item.key}>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-3 ml-1">{item.label}</label>
                      <input onChange={(e) => handleInputChange(item.key, e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-semibold text-slate-700" placeholder={item.ph} />
                    </div>
                  ))}
                </div>
              </div>

              {/* 卡片2：配料 */}
              <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3"><div className="w-2 h-8 bg-emerald-500 rounded-full"></div><h3 className="font-bold text-lg">成分配比清单</h3></div>
                  <button onClick={() => addRow('ingredients')} className="px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black hover:bg-emerald-600 hover:text-white transition-all">+ 新增行</button>
                </div>
                {formData.ingredients.map(row => (
                  <div key={row.id} className="flex gap-4 mb-3 animate-in fade-in slide-in-from-top-2">
                    <input onChange={(e) => updateDynamicRow('ingredients', row.id, 'name', e.target.value)} className="flex-[3] px-6 py-4 rounded-2xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all font-medium" placeholder="成分名" />
                    <input onChange={(e) => updateDynamicRow('ingredients', row.id, 'percentage', e.target.value)} className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all font-medium" placeholder="%" />
                    <button onClick={() => removeRow('ingredients', row.id)} className="p-3 text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={22} /></button>
                  </div>
                ))}
              </div>

              {/* 卡片3：扩展 */}
              <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 mb-10">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3"><div className="w-2 h-8 bg-emerald-500 rounded-full"></div><h3 className="font-bold text-lg">扩展数据项</h3></div>
                  <button onClick={() => addRow('baseInfo')} className="px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black hover:bg-emerald-600 hover:text-white transition-all">+ 新增参数</button>
                </div>
                {formData.baseInfo.map(row => (
                  <div key={row.id} className="flex gap-4 mb-4 group animate-in slide-in-from-top-2">
                    <input onChange={(e) => updateDynamicRow('baseInfo', row.id, 'key', e.target.value)} className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all font-medium" placeholder="数据标签" />
                    <input onChange={(e) => updateDynamicRow('baseInfo', row.id, 'value', e.target.value)} className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all font-medium" placeholder="内容" />
                    <button onClick={() => removeRow('baseInfo', row.id)} className="p-3 text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={22} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：分析区 */}
        <div className="flex-1 h-full bg-slate-900 p-12 flex flex-col relative text-white">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 0.8px, transparent 0.8px)', backgroundSize: '32px 32px' }}></div>
          <div className="relative z-10 h-full flex flex-col">
            <header className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3 text-emerald-500">
                <Activity size={22} className="animate-pulse" /><span className="text-xs font-mono font-black tracking-[0.4em] uppercase">Security Engine</span>
              </div>
              <button onClick={runEvaluation} className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black shadow-2xl shadow-emerald-950 transition-all active:scale-95">运行评估</button>
            </header>
            <div className="flex-1 bg-slate-950/40 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl p-10 flex flex-col overflow-hidden">
              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative mb-10">
                    <div className="w-32 h-32 border-2 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                    <Cpu size={48} className="absolute inset-0 m-auto text-emerald-500 animate-pulse" />
                  </div>
                  <h4 className="text-emerald-400 font-mono tracking-[0.5em] animate-pulse">DPFS ENCRYPTED SCANNING</h4>
                </div>
              ) : (
                <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-6 duration-1000">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20"><CheckCircle size={24} /></div>
                    <h3 className="text-2xl font-black">评估报告</h3>
                  </div>
                  <div className="flex-1 bg-slate-900/80 rounded-3xl p-8 font-mono text-sm text-emerald-400/90 border border-white/5 mb-8 overflow-y-auto">{riskReport}</div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 text-center">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">安全系数</span>
                      <span className="text-5xl font-black">0.99</span>
                    </div>
                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 text-center">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">信誉评级</span>
                      <span className="text-5xl font-black">AAA</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}