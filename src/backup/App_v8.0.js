import React, { useState, useEffect } from 'react';
import {
  Plus, Trash2, LogOut, ShieldCheck, Activity, Cpu,
  Database, CheckCircle, Box, ListChecks, ArrowRight,
  User, Lock, LayoutDashboard, Zap, Search, Clock, ChevronRight,
  RefreshCw, ChevronLeft, Check
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

  // --- 新增状态 ---
  const [genAiReport, setGenAiReport] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const [systemData, setSystemData] = useState([]);
  const [systemTotal, setSystemTotal] = useState(0);
  const [currentSystemPage, setCurrentSystemPage] = useState(0);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  useEffect(() => {
    const savedToken = localStorage.getItem('dpfs_token');
    if (savedToken) setIsLoggedIn(true);
  }, []);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [historyItems, setHistoryItems] = useState([
    { id: 1, name: '有机红富士', mode: '标准模式', qty: '1200', time: '2026-03-25 14:20', status: 'SAFE' },
    { id: 2, name: '大红袍茶叶', mode: '深度扫描', qty: '45', time: '2026-03-25 15:10', status: 'SAFE' }
  ]);

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

  // // --- 核心修改：信息录入提交函数 ---
  // const handleSubmitData = async () => {
  //   const token = localStorage.getItem('dpfs_token');
  //   if (!token) return alert("请先登录");

  //   setIsLoading(true);
  //   const payload = {
  //     user_token: parseInt(token),
  //     schema: formData.modeName || "Standard",
  //     product_name: formData.productName,
  //     product_number: parseInt(formData.quantity) || 0,
  //     ingredients: formData.ingredients.map(i => [i.name, i.percentage]),
  //     base_info: formData.baseInfo.map(b => [b.key, b.value]),
  //     risk_report: genAiReport ? 1 : 0
  //   };

  //   try {
  //     const response = await fetch('/api/risk', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(payload)
  //     });
  //     const result = await response.json();

  //     if (result.code === 200) {
  //       const msg = genAiReport ? "产品信息录入成功，开始进行AI评估" : "产品信息录入成功";
  //       showToast(msg);
  //       if (genAiReport && result.risk_info) {
  //         setRiskReport(result.risk_info);
  //       }
  //     } else {
  //       showToast("产品信息录入失败");
  //     }
  //   } catch (error) {
  //     showToast("产品信息录入失败");
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmitData = async () => {
    const token = localStorage.getItem('dpfs_token');
    if (!token) return alert("请先登录");

    setIsLoading(true);

    // 构造请求体
    const payload = {
      user_token: parseInt(token),
      schema: formData.modeName || "Standard",
      product_name: formData.productName,
      product_number: parseInt(formData.quantity) || 0,
      ingredients: formData.ingredients.map(i => [i.name, i.percentage]),
      base_info: formData.baseInfo.map(b => [b.key, b.value]),
      risk_report: genAiReport ? 1 : 0
    };

    try {
      const response = await fetch('/api/risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // 检查 HTTP 状态
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      // 尝试解析文本而非直接 json()，防止后端返回非 JSON 导致崩溃
      const responseText = await response.text();
      console.log("服务器返回原始字符串:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        throw new Error("后端返回的数据不是有效的 JSON 格式");
      }

      console.log("解析后的对象:", result);

      // 严格判断 code
      if (result && (result.code === 200 || Number(result.code) === 200)) {
        const msg = genAiReport ? "产品信息录入成功，开始进行AI评估" : "产品信息录入成功";
        showToast(msg);

        // 安全地更新报告内容
        if (genAiReport) {
          // 使用可选链 ?. 或默认值，防止 result.risk_info 不存在时报错
          setRiskReport(result.risk_info || "服务器未返回具体评估内容。");
        }
      } else {
        showToast(`录入失败: ${result?.message || '业务返回码错误'}`);
      }

    } catch (error) {
      // 这里会打印导致“网络连接异常”的真正元凶
      console.error("【关键报错信息】:", error.message);
      showToast(`录入失败: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleFetchSystemData = async (beginIndex = 0) => {
    const token = localStorage.getItem('dpfs_token');
    if (!token) return alert("会话已过期，请重新登录");
    setIsLoading(true);
    try {
      const checkRes = await fetch('/api/list_tracable_pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_token: parseInt(token), begin: 0, limit: 1 })
      });
      const checkResult = await checkRes.json();
      if (checkResult.code === 200) {
        setSystemTotal(checkResult.total);
        const fetchRes = await fetch('/api/list_tracable_pro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_token: parseInt(token), begin: beginIndex, limit: 20 })
        });
        const fetchResult = await fetchRes.json();
        if (fetchResult.code === 200) {
          setSystemData(fetchResult.trace_pros || []);
          setCurrentSystemPage(beginIndex);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) return alert("请完整输入账号和访问密钥");
    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginForm.username, password: loginForm.password })
      });
      const result = await response.json();
      if (result.code === 0) {
        localStorage.setItem('dpfs_token', result.user_token);
        setIsLoggedIn(true);
      } else {
        alert(result.message || "身份验证失败");
      }
    } catch (error) {
      alert("连接失败");
    } finally {
      setIsLoading(false);
    }
  };

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
                  <input type="text" value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} placeholder="输入管理账号" className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-900/50 border border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-lg" />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="输入访问密钥 (密码)" className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-900/50 border border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-lg text-white" />
                </div>
                <button onClick={handleLogin} className="group w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-500 transition-all transform hover:-translate-y-1 shadow-2xl shadow-emerald-950 flex items-center justify-center gap-3">
                  {isLoading ? "系统验证中..." : "验证身份进入系统"}
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden text-slate-900 relative">
      {/* 提示文本框 */}
      {toast.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 bg-slate-900 text-white rounded-2xl shadow-2xl animate-in slide-in-from-top-4 duration-300 font-bold border border-white/10">
          {toast.message}
        </div>
      )}

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          localStorage.removeItem('dpfs_token');
          setIsLoggedIn(false);
          setShowLogoutModal(false);
        }}
      />

      <aside className="w-24 flex flex-col items-center py-10 bg-white border-r border-slate-100 z-50">
        <div className="p-4 bg-slate-950 rounded-[2rem] text-emerald-500 mb-16 shadow-xl shadow-slate-200">
          <Zap size={28} fill="currentColor" />
        </div>
        <div className="flex-1 flex flex-col gap-10">
          <button onClick={() => setActiveTab('dashboard')} className={`p-4 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-slate-300 hover:text-slate-600'}`}><LayoutDashboard size={26} /></button>
          <button onClick={() => setActiveTab('activity')} className={`p-4 rounded-2xl transition-all ${activeTab === 'activity' ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-slate-300 hover:text-slate-600'}`}><Activity size={26} /></button>
          <button onClick={() => setActiveTab('history')} className={`p-4 rounded-2xl transition-all ${activeTab === 'history' ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-slate-300 hover:text-slate-600'}`}><Database size={26} /></button>
        </div>
        <button onClick={() => setShowLogoutModal(true)} className="p-4 text-slate-300 hover:text-red-500 transition-all"><LogOut size={28} /></button>
      </aside>

      <main className="flex-1 flex overflow-hidden">
        <div className={`h-full overflow-y-auto p-12 custom-scrollbar transition-all duration-500 ${(activeTab === 'history' || activeTab === 'activity') ? 'flex-1 bg-slate-50/50' : 'flex-[1.3]'}`}>
          <div className={`${(activeTab === 'history' || activeTab === 'activity') ? 'max-w-6xl' : 'max-w-3xl'} mx-auto`}>

            {activeTab === 'dashboard' && (
              <>
                <header className="mb-12">
                  <span className="text-[10px] font-black tracking-[0.3em] text-emerald-600 uppercase mb-3 block">Security Collection</span>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">智能风险评估录入</h2>
                </header>
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                      <h3 className="font-bold text-lg">核心商品参数</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-8">
                      {[{ label: '扫描模式', key: 'modeName', ph: '标准模式' }, { label: '商品全称', key: 'productName', ph: '输入商品名' }, { label: '批次数量', key: 'quantity', ph: '0' }].map(item => (
                        <div key={item.key}>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase mb-3 ml-1">{item.label}</label>
                          <input onChange={(e) => handleInputChange(item.key, e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-semibold text-slate-700" placeholder={item.ph} />
                        </div>
                      ))}
                    </div>
                  </div>

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

                  <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 mb-6">
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

                  {/* 新增：生成AI评估报告 & 信息录入按钮 */}
                  <div className="space-y-6 pb-10">
                    <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setGenAiReport(!genAiReport)}>
                      <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${genAiReport ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 bg-white group-hover:border-emerald-200'}`}>
                        {genAiReport && <Check size={18} strokeWidth={4} />}
                      </div>
                      <span className="font-bold text-slate-700">生成AI评估报告</span>
                    </div>
                    <button
                      onClick={handleSubmitData}
                      disabled={isLoading}
                      className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-emerald-600 transition-all transform hover:-translate-y-1 shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isLoading ? <RefreshCw className="animate-spin" size={24} /> : <Box size={24} />}
                      信息录入
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'activity' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                <header className="mb-12 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black tracking-[0.3em] text-emerald-600 uppercase mb-3 block">System Database</span>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">系统溯源数据查询</h2>
                  </div>
                  <button onClick={() => handleFetchSystemData(0)} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-500 shadow-xl shadow-emerald-950/10 transition-all">
                    <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} /> 查询系统数据
                  </button>
                </header>
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 overflow-hidden mb-8">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">所在组</th>
                        <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">产品名称</th>
                        <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">溯源代码前缀</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {systemData.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-8 py-6 font-medium text-slate-600">{item.group_name}</td>
                          <td className="px-8 py-6 font-bold text-slate-800">{item.product_name}</td>
                          <td className="px-8 py-6 font-mono text-xs text-emerald-600 truncate max-w-[300px]">{item.trace_code_prefix}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {systemData.length === 0 && !isLoading && <div className="py-20 text-center text-slate-300 italic font-medium">点击上方按钮同步系统数据</div>}
                </div>
                {systemTotal > 0 && (
                  <div className="flex justify-center items-center gap-6">
                    <button disabled={currentSystemPage === 0 || isLoading} onClick={() => handleFetchSystemData(currentSystemPage - 20)} className="p-4 bg-white rounded-xl border border-slate-100 disabled:opacity-30 hover:text-emerald-500 transition-all"><ChevronLeft size={20} /></button>
                    <div className="text-sm font-bold text-slate-500">第 {Math.floor(currentSystemPage / 20) + 1} / {Math.ceil(systemTotal / 20)} 页 <span className="ml-3 text-slate-300 font-normal">(总计 {systemTotal} 条)</span></div>
                    <button disabled={currentSystemPage + 20 >= systemTotal || isLoading} onClick={() => handleFetchSystemData(currentSystemPage + 20)} className="p-4 bg-white rounded-xl border border-slate-100 disabled:opacity-30 hover:text-emerald-500 transition-all"><ChevronRight size={20} /></button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                <header className="mb-12 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-black tracking-[0.3em] text-emerald-600 uppercase mb-3 block">Distributed Ledger</span>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">历史评估存证账本</h2>
                  </div>
                </header>
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">存证时间</th>
                        <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">商品全称</th>
                        <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">评估模式</th>
                        <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">批次数量</th>
                        <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">状态</th>
                        <th className="px-8 py-6"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {historyItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-8 py-6"><div className="flex items-center gap-2 text-slate-500 font-mono text-xs"><Clock size={14} className="text-emerald-500" /> {item.time}</div></td>
                          <td className="px-8 py-6 font-bold text-slate-700">{item.name}</td>
                          <td className="px-8 py-6"><span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase">{item.mode}</span></td>
                          <td className="px-8 py-6 font-mono text-slate-600 font-bold">{item.qty} units</td>
                          <td className="px-8 py-6"><div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] tracking-widest"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>{item.status}</div></td>
                          <td className="px-8 py-6 text-right"><button className="p-2 text-slate-300 hover:text-emerald-500 transition-colors"><ChevronRight size={20} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧评估面板逻辑修改 */}
        {activeTab === 'dashboard' && (
          <div className="flex-1 h-full bg-slate-900 p-12 flex flex-col relative text-white animate-in slide-in-from-right-full duration-500">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 0.8px, transparent 0.8px)', backgroundSize: '32px 32px' }}></div>

            <div className="relative z-10 h-full flex flex-col">
              <header className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3 text-emerald-500">
                  <Activity size={22} className="animate-pulse" />
                  <span className="text-xs font-mono font-black tracking-[0.4em] uppercase">Security Engine</span>
                </div>
              </header>

              {/* 核心修改点：父容器增加 overflow-hidden，子容器使用 flex-1 和 min-h-0 */}
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
                  <div className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-right-6 duration-1000">
                    <div className="flex items-center gap-3 mb-10 shrink-0"> {/* shrink-0 防止标题被压缩 */}
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <CheckCircle size={24} />
                      </div>
                      <h3 className="text-2xl font-black text-white">评估报告</h3>
                    </div>

                    {/* 文本展示区：增加 overflow-y-auto 和 flex-1 */}
                    <div className="flex-1 bg-slate-900/80 rounded-[2.5rem] p-8 font-mono text-sm text-emerald-400/90 border border-white/5 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner custom-scrollbar">
                      {riskReport}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}