import React, { useState } from 'react';
import { Plus, Trash2, LogOut, ShieldCheck, Activity, Cpu, Database, CheckCircle, Box, ListChecks, ArrowRight, User, Lock } from 'lucide-react';
import ParticleBackground from './ParticleBackground'; // 引入刚才创建的粒子背景组件

// --- 子组件：退出确认弹窗 (保持原有逻辑，增强毛玻璃效果) ---
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xl animate-in fade-in duration-300 p-4">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-slate-100 transform animate-in zoom-in-95 leading-relaxed">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
          <LogOut size={32} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-2">确认退出？</h3>
        <p className="text-slate-500 mb-10">退出系统将清除当前未保存的录入数据，是否继续？</p>
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-slate-100 font-bold text-slate-600 hover:bg-slate-200 transition-all">取消</button>
          <button onClick={onConfirm} className="flex-1 py-4 rounded-2xl bg-slate-900 font-bold text-white hover:bg-red-600 shadow-xl transition-all">确认退出</button>
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

  // 表单状态管理
  const [formData, setFormData] = useState({
    modeName: '', productName: '', quantity: '',
    ingredients: [{ id: Date.now(), name: '', percentage: '' }],
    baseInfo: [{ id: Date.now() + 1, key: '', value: '' }]
  });

  // --- 逻辑处理函数 (保持不变) ---
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
    console.log("发送 JSON 数据:", JSON.stringify(formData, null, 2));
    setTimeout(() => {
      setRiskReport(`[DPFS 智能评估报告]\n生成时间: ${new Date().toLocaleString()}\n---------------------------\n商品: ${formData.productName || '未命名'}\n风险等级: 低风险 (SAFE)\n结论: 该农产品符合安全准入标准，通过认证。`);
      setIsLoading(false);
    }, 2000);
  };

  // --- 视图渲染 ---

  // 1. 全屏沉浸式登录界面
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-white relative overflow-hidden">

        {/* 全屏动态粒子背景 */}
        <ParticleBackground />

        {/* 顶部导航 (非对称布局) */}
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

        {/* 主内容区 (全屏拉伸) */}
        <main className="relative z-10 flex-1 flex items-center justify-center p-6 md:p-12">

          {/* 登录主体布局 (左品牌，右表单) */}
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">

            {/* 左侧：品牌与口号 */}
            <div className="lg:col-span-3 space-y-6 text-left animate-in fade-in slide-in-from-left-6 duration-1000">
              <div className="inline-block px-4 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-full text-xs font-semibold tracking-widest uppercase">
                AI-Powered Security v2.0
              </div>
              <h2 className="text-5xl md:text-6xl font-black leading-tight tracking-tighter">
                为农产品供应链<br />
                注入<span className="text-emerald-500">智能与安全</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                利用分布式账本与深度学习算法，实时监测、评估并阻断农产品流转过程中的潜在风险，确保每一份食品都真实可信。
              </p>
            </div>

            {/* 右侧：纯粹的登录表单 (不使用卡片) */}
            <div className="lg:col-span-2 space-y-10 animate-in fade-in slide-in-from-right-6 duration-1000 delay-300">
              <div>
                <h3 className="text-3xl font-extrabold tracking-tight mb-2">欢迎回来</h3>
                <p className="text-slate-500">请使用您的管理账号进行身份验证。</p>
              </div>

              <div className="space-y-6">
                {/* 用户名 */}
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="输入账号"
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-900/50 border border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-lg"
                  />
                </div>
                {/* 密码 */}
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="输入密码"
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-900/50 border border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-lg text-slate-400"
                  />
                </div>

                {/* 登录按钮 */}
                <button onClick={handleLogin} className="group w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-500 transition-all transform hover:-translate-y-1 shadow-2xl shadow-emerald-950 flex items-center justify-center gap-3 active:scale-[0.98]">
                  {isLoading ? "系统验证中..." : "验证身份进入系统"}
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="pt-6 text-center text-xs text-slate-600 font-mono tracking-widest uppercase">
                Secure Access Protocol Active
              </div>
            </div>
          </div>
        </main>

        {/* 底部版权 (非对称布局) */}
        <footer className="relative z-10 w-full p-8 text-sm text-slate-700 font-mono text-center md:text-left">
          © 2026 DPFS Agriculture Security Lab. All rights reserved.
        </footer>
      </div>
    );
  }

  // 2. 主工作台界面 (保持左右分栏不变)
  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden text-slate-900">
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={() => setIsLoggedIn(false)} />

      {/* 左侧录入 (保持不变) */}
      <div className="w-[60%] h-full overflow-y-auto p-12 border-r border-slate-100">
        <div className="max-w-2xl mx-auto">
          {/* ... 左侧代码与之前完全相同，这里省略以节省空间 ... */}
          {/* 这里是你的左侧录入区代码 */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <span className="text-emerald-600 font-bold text-xs tracking-widest uppercase bg-emerald-50 px-3 py-1 rounded-full">Data Entry</span>
              <h2 className="text-3xl font-black text-slate-900 mt-3 tracking-tight">商品信息录入</h2>
            </div>
            <button onClick={() => setShowLogoutModal(true)} className="group p-3 text-slate-300 hover:text-red-500 transition-all">
              <LogOut size={24} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>

          <div className="space-y-10">
            {/* 基础信息组 */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: '模式名', key: 'modeName', placeholder: 'TEST' },
                { label: '商品名', key: 'productName', placeholder: '海天酱油' },
                { label: '数量', key: 'quantity', placeholder: '5' }
              ].map(item => (
                <div key={item.key}>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{item.label}</label>
                  <input onChange={(e) => handleInputChange(item.key, e.target.value)} type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" placeholder={item.placeholder} />
                </div>
              ))}
            </div>

            {/* 配料表 */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><Database size={18} className="text-emerald-500" /> 配料组成</h4>
                <button onClick={() => addRow('ingredients')} className="text-emerald-600 text-xs font-bold hover:text-emerald-700">+ 增加配料</button>
              </div>
              {formData.ingredients.map((row) => (
                <div key={row.id} className="flex gap-3 mb-3 animate-in slide-in-from-left-4 duration-300 group">
                  <input onChange={(e) => updateDynamicRow('ingredients', row.id, 'name', e.target.value)} className="flex-[3] px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:bg-slate-100" placeholder="配料名称" />
                  <input onChange={(e) => updateDynamicRow('ingredients', row.id, 'percentage', e.target.value)} className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:bg-slate-100" placeholder="%" />
                  <button onClick={() => removeRow('ingredients', row.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"><Trash2 size={18} /></button>
                </div>
              ))}
            </section>

            {/* 基础信息 */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><ListChecks size={18} className="text-emerald-500" /> 扩展信息</h4>
                <button onClick={() => addRow('baseInfo')} className="text-emerald-600 text-xs font-bold hover:text-emerald-700">+ 增加参数</button>
              </div>
              {formData.baseInfo.map((row) => (
                <div key={row.id} className="flex gap-3 mb-3 animate-in slide-in-from-left-4 duration-300 group">
                  <input onChange={(e) => updateDynamicRow('baseInfo', row.id, 'key', e.target.value)} className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:bg-slate-100" placeholder="项目" />
                  <input onChange={(e) => updateDynamicRow('baseInfo', row.id, 'value', e.target.value)} className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:bg-slate-100" placeholder="内容" />
                  <button onClick={() => removeRow('baseInfo', row.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"><Trash2 size={18} /></button>
                </div>
              ))}
            </section>
            <button onClick={runEvaluation} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-200 active:scale-[0.98]">
              执行智能风险评估
            </button>
          </div>
        </div>
      </div>

      {/* 右侧：分析区 (保持不变) */}
      <div className="w-[40%] h-full bg-slate-900 p-12 flex flex-col relative text-white">
        {/* ... 右侧代码与之前完全相同 ... */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#34d399 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>
        <div className="flex items-center gap-3 mb-10 relative z-10">
          <Activity size={20} className="text-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-emerald-500 tracking-[0.4em] uppercase font-bold">Assessment Monitor</span>
        </div>
        <div className="flex-1 bg-slate-800/40 rounded-[3rem] border border-slate-700/50 p-10 backdrop-blur-xl relative flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <div className="relative"><Cpu size={56} className="text-emerald-500 animate-bounce" /></div>
              <p className="text-emerald-400 font-mono text-sm animate-pulse">ANALYZING DPFS...</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="flex items-center gap-3 mb-8 text-emerald-500">
                <CheckCircle size={24} /><span className="font-mono text-sm">扫描结果</span>
              </div>
              <pre className="text-emerald-400 font-mono text-sm leading-relaxed whitespace-pre-wrap bg-slate-900/50 p-6 rounded-2xl border border-emerald-500/10">
                {riskReport}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}