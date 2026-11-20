import React, { useState } from 'react';
import {
  ScanEye,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Sliders,
  History,
  ShieldCheck,
  X,
} from 'lucide-react';
import { VisionLog } from '../../../types/admin';

interface VisionLogPageProps {
  logs: VisionLog[];
  onManualOverride: (logId: string, correctedProduct: string, amount: number) => void;
}

export const VisionLogPage: React.FC<VisionLogPageProps> = ({ logs, onManualOverride }) => {
  const [selectedLog, setSelectedLog] = useState<VisionLog | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [overrideModalLog, setOverrideModalLog] = useState<VisionLog | null>(null);
  const [correctedProduct, setCorrectedProduct] = useState('');
  const [correctedAmount, setCorrectedAmount] = useState('4.00');

  const filteredLogs = logs.filter((l) => {
    if (filterStatus !== 'ALL' && l.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">AI 视觉识别取证记录</h2>
          <p className="text-xs text-slate-500">
            双目俯视机位视觉差分比对、置信度分析、多模态重力拟合与人工二次复核流水
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200 font-medium">
            本月平均识别置信度 98.7%
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">识别状态：</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">全部记录</option>
            <option value="SUCCESS">高置信成功 (≥90%)</option>
            <option value="UNCERTAIN">存疑待核对</option>
            <option value="FAILED">识别异常</option>
          </select>
        </div>

        <div className="text-slate-400">
          共 <strong className="text-slate-800 font-mono">{filteredLogs.length}</strong> 条开门取货视觉日志
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">识别时间</th>
                <th className="py-2.5 px-3 font-semibold">设备编号</th>
                <th className="py-2.5 px-3 font-semibold">关联开门事件</th>
                <th className="py-2.5 px-3 font-semibold text-center">监控抓拍快照</th>
                <th className="py-2.5 px-3 font-semibold">AI 模型初测识别商品</th>
                <th className="py-2.5 px-3 font-semibold text-right">算法置信度</th>
                <th className="py-2.5 px-3 font-semibold">最终扣款确认商品</th>
                <th className="py-2.5 px-3 font-semibold text-right">出货结算价</th>
                <th className="py-2.5 px-3 font-semibold text-center">人工复核修正</th>
                <th className="py-2.5 px-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{l.time}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{l.deviceCode}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{l.doorEventId}</td>

                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => setSelectedLog(l)}
                      className="group relative inline-block rounded overflow-hidden border border-slate-200 hover:border-orange-500 cursor-pointer"
                    >
                      <img
                        src={l.imageSnapshot}
                        alt="抓拍"
                        className="w-10 h-7 object-cover group-hover:scale-105 transition-transform"
                      />
                    </button>
                  </td>

                  <td className="py-3 px-3 font-medium text-slate-800">{l.detectedProduct}</td>

                  <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                    <span
                      className={
                        l.confidence >= 0.95
                          ? 'text-emerald-600'
                          : l.confidence >= 0.85
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }
                    >
                      {(l.confidence * 100).toFixed(1)}%
                    </span>
                  </td>

                  <td className="py-3 px-3 font-semibold text-slate-900">{l.finalProduct}</td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    ¥{l.amount.toFixed(2)}
                  </td>

                  <td className="py-3 px-3 text-center">
                    {l.isManualOverride ? (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                        人工修正
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">模型直通</span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setOverrideModalLog(l);
                        setCorrectedProduct(l.finalProduct);
                        setCorrectedAmount(l.amount.toString());
                      }}
                      className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
                    >
                      查看/修正
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snapshot Preview Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-xl max-w-lg w-full overflow-hidden border border-slate-700 shadow-2xl">
            <div className="p-3 bg-slate-950 flex justify-between items-center text-xs border-b border-slate-800">
              <span className="font-bold flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>开门瞬间内部视频抓拍与差分热力图</span>
              </span>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <div className="aspect-4/3 bg-black relative">
              <img src={selectedLog.imageSnapshot} alt="监控抓拍" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-3 font-mono text-[11px] text-emerald-400 bg-black/60 px-2 py-0.5 rounded">
                AI_CONFIDENCE: {(selectedLog.confidence * 100).toFixed(1)}% · {selectedLog.detectedProduct}
              </div>
            </div>
            <div className="p-4 bg-slate-950 text-xs space-y-2">
              <div className="text-slate-300">
                出货判定结果：{selectedLog.finalProduct} (¥{selectedLog.amount.toFixed(2)})
              </div>
              {selectedLog.failReason && (
                <div className="text-rose-400 bg-rose-950/40 border border-rose-800 p-2 rounded">
                  异常说明：{selectedLog.failReason}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manual Override Modal */}
      {overrideModalLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-800">人工复核与商品出货修正</h3>
            <p className="text-slate-500">
              若因用户快速抽离、多罐并排遮挡导致视觉识别与实际出货不符，运营人员可人工核准并回写结存：
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">核定最终出货商品：</label>
                <input
                  type="text"
                  value={correctedProduct}
                  onChange={(e) => setCorrectedProduct(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">核定结算金额(元)：</label>
                <input
                  type="number"
                  step="0.1"
                  value={correctedAmount}
                  onChange={(e) => setCorrectedAmount(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setOverrideModalLog(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onManualOverride(
                    overrideModalLog.id,
                    correctedProduct,
                    parseFloat(correctedAmount) || 0
                  );
                  setOverrideModalLog(null);
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
              >
                保存复核结果
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
