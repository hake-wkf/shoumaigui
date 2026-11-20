import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Clock,
  Thermometer,
  Shield,
  Bell,
  Cpu,
} from 'lucide-react';

export const SystemSettingsPage: React.FC = () => {
  const [heartbeatInterval, setHeartbeatInterval] = useState('30');
  const [maxTempThreshold, setMaxTempThreshold] = useState('8.0');
  const [openDoorTimeout, setOpenDoorTimeout] = useState('60');
  const [minVisionConfidence, setMinVisionConfidence] = useState('90');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('系统运行参数与报警阈值已成功下发至网关服务');
  };

  return (
    <div className="space-y-4 max-w-4xl relative">
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">系统与物联网网关全局设置</h2>
        <p className="text-xs text-slate-500">
          心跳保活周期、冷柜温控报警阈值、AI 识别置信度底线与超时自动告警策略
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5 text-xs">
        {/* Section 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Cpu className="w-4 h-4 text-orange-600" />
            <span>物联网设备心跳与超时检测</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 mb-1 font-medium">
                MQTT 心跳上报间隔 (秒)：
              </label>
              <input
                type="number"
                value={heartbeatInterval}
                onChange={(e) => setHeartbeatInterval(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono text-slate-800"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                连续缺失 3 次心跳将触发「设备离线」告警工单。
              </span>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-medium">
                柜门开启超时告警阈值 (秒)：
              </label>
              <input
                type="number"
                value={openDoorTimeout}
                onChange={(e) => setOpenDoorTimeout(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono text-slate-800"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                开门超此时限将启动蜂鸣器报警并向手机端推送提醒。
              </span>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Thermometer className="w-4 h-4 text-blue-600" />
            <span>冷链温控阈值</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 mb-1 font-medium">
                高温告警温度线 (°C)：
              </label>
              <input
                type="number"
                step="0.5"
                value={maxTempThreshold}
                onChange={(e) => setMaxTempThreshold(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono text-slate-800"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                箱内温度超过此值持续 10 分钟将触发压缩机故障告警。
              </span>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-medium">
                AI 视觉识别最低直通置信度 (%)：
              </label>
              <input
                type="number"
                value={minVisionConfidence}
                onChange={(e) => setMinVisionConfidence(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono text-slate-800"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                低于此置信度将锁定订单并转入人工复核队列。
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#ff6900] hover:bg-orange-600 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
          >
            保存并生效参数
          </button>
        </div>
      </form>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
