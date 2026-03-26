import React, { useState } from 'react';
import { Plus, Trash2, LogOut, ShieldCheck, Activity, Cpu, Database, CheckCircle, Box, ListChecks } from 'lucide-react';

/**
 * --- 子组件：退出确认弹窗 ---
 */
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div className="bg-white rounded-[2rem] p-8 md:p-10 max-w-sm w-full shadow-2xl border border-slate-100 transform animate-in zoom-in-95">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
          <LogOut size={32} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">确认退出？</h3>
        <p className="text-slate-500 mb-8 leading-relaxed">退出系统将清除当前未保存的录入数据。</p>
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

  // 1. 表单状态管理
  const [formData, setFormData] = useState({
    modeName: '',
    productName: '',
    quantity: '',
    ingredients: [{ id: Date.now(), name: '', percentage: '' }],
    baseInfo: [{ id: Date.now() + 1, key: '', value: '' }]
  });

  // --- 逻辑处理函数 ---

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const addRow = (type) => {
    const newRow = { id: Date.now(), name: '', percentage: '', key: '', value: '' };
    setFormData({ ...formData, [type]: [...formData[type], newRow] });
  };

  const removeRow = (type, id) => {
    setFormData({ ...formData, [type]: formData[type].filter(item => item.id !== id) });
  };

  const updateDynamicRow = (type, id, field, value) => {
    const updated = formData[type].map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, [type]: updated });
  };

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 800);
  };

  const runEvaluation = () => {
    setIsLoading(true);
    // 控制台打印发送给后端的 JSON
    console.log("发送 JSON 数据到后端:", JSON.stringify(formData, null, 2));

    setTimeout(() => {
      setRiskReport(`[DPFS 智能评估报告]
---------------------------
分析对象: ${formData.productName || '未命名商品'}
分析模式: ${formData.modeName || '默认'}
配料合规度: 98%
风险等级: 低风险 (SAFE)
结论: 该农产品符合安全准入标准，已记录至分布式账本。
生成时间: ${new Date().toLocaleString()}`);
      setIsLoading(false);
    }, 2000);
  };

  // --- 视图渲染 ---

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans text-slate-900">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-100/50 rounded-full blur-[120px]" />
        <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-2xl p-10 md:p-12 rounded-[3rem] border border-white shadow-2xl">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-emerald-200 animate-pulse">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 leading-tight">基于DPFS的农产品<br />安全风险智能评估系统</h1>
          </div>
          <div className="space-y-5">
            <input type="text" placeholder="用户名" className="w-full px-6 py-4 rounded-2xl bg-white/50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" />
            <input type="text" placeholder="密码 (明文)" className="w-full px-6 py-4 rounded-2xl bg-white/50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-slate-600" />
            <button onClick={handleLogin} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all transform hover:-translate-y-1 shadow-xl shadow-slate-200">
              {isLoading ? "验证中..." : "进入系统"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden text-slate-900">
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={() => setIsLoggedIn(false)} />

      {/* 左侧：录入区 (60%) */}
      <div className="w-[60%] h-full overflow-y-auto p-12 lg:p-16 border-r border-slate-100">
        <div className="max-w-2xl mx-auto">
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
                  <input
                    onChange={(e) => handleInputChange(item.key, e.target.value)}
                    type="text"
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    placeholder={item.placeholder}
                  />
                </div>
              ))}
            </div>

            {/* 配料表动态录入 */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><Database size={18} className="text-emerald-500" /> 配料表清单</h4>
                <button onClick={() => addRow('ingredients')} className="text-emerald-600 text-xs font-bold hover:text-emerald-700">+ 增加配料</button>
              </div>
              {formData.ingredients.map((row) => (
                <div key={row.id} className="flex gap-3 mb-3 animate-in slide-in-from-left-4 duration-300 group">
                  <input
                    onChange={(e) => updateDynamicRow('ingredients', row.id, 'name', e.target.value)}
                    className="flex-[3] px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:bg-slate-100" placeholder="配料名称" />
                  <input
                    onChange={(e) => updateDynamicRow('ingredients', row.id, 'percentage', e.target.value)}
                    className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:bg-slate-100" placeholder="百分比" />
                  <button onClick={() => removeRow('ingredients', row.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"><Trash2 size={18} /></button>
                </div>
              ))}
            </section>

            {/* 基础信息动态录入 */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><ListChecks size={18} className="text-emerald-500" /> 扩展基础信息</h4>
                <button onClick={() => addRow('baseInfo')} className="text-emerald-600 text-xs font-bold hover:text-emerald-700">+ 增加参数</button>
              </div>
              {formData.baseInfo.map((row) => (
                <div key={row.id} className="flex gap-3 mb-3 animate-in slide-in-from-left-4 duration-300 group">
                  <input
                    onChange={(e) => updateDynamicRow('baseInfo', row.id, 'key', e.target.value)}
                    className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:bg-slate-100" placeholder="项目 (如: 生产日期)" />
                  <input
                    onChange={(e) => updateDynamicRow('baseInfo', row.id, 'value', e.target.value)}
                    className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:bg-slate-100" placeholder="内容" />
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

      {/* 右侧：结果展示区 (40%) */}
      <div className="w-[40%] h-full bg-slate-900 p-12 flex flex-col relative text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#34d399 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>

        <div className="flex items-center gap-3 mb-10 relative z-10">
          <Activity size={20} className="text-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-emerald-500 tracking-[0.4em] uppercase font-bold">Risk Assessment Monitor</span>
        </div>

        <div className="flex-1 bg-slate-800/40 rounded-[3rem] border border-slate-700/50 p-10 backdrop-blur-xl relative flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <Cpu size={56} className="text-emerald-500 animate-bounce" />
                <div className="absolute inset-0 scale-150 blur-2xl bg-emerald-500/20 animate-pulse"></div>
              </div>
              <p className="text-emerald-400 font-mono text-sm tracking-widest animate-pulse">ANALYZING DPFS DATA...</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-500"><CheckCircle size={24} /></div>
                <span className="font-mono text-sm text-emerald-400 uppercase tracking-widest font-bold">扫描结果</span>
              </div>
              <pre className="text-emerald-400/90 font-mono text-sm leading-relaxed whitespace-pre-wrap bg-slate-900/50 p-6 rounded-2xl border border-emerald-500/10 shadow-inner">
                {riskReport}
              </pre>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <p className="text-[10px] text-slate-500 uppercase mb-1">风险评分</p>
                  <p className="text-2xl font-black text-emerald-400">0.02</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <p className="text-[10px] text-slate-500 uppercase mb-1">系统状态</p>
                  <p className="text-2xl font-black text-emerald-400">稳定</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="mt-8 text-[10px] text-slate-500 text-center font-mono uppercase tracking-widest">
          Secure Multi-Party Computation Active
        </p>
      </div>
    </div>
  );
}