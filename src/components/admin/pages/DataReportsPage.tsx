import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  Percent,
  CheckCircle2,
  HardDrive,
  ScanEye,
  RefreshCw,
} from 'lucide-react';

export const DataReportsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [dimension, setDimension] = useState<'device' | 'product' | 'store'>('device');

  const reportData = [
    { target: '创客大堂01号 (856565)', sales: '¥1,420.00', orders: 355, stockRate: '85%', outOfStockRate: '2.8%', refillRate: '98.5%', onlineRate: '99.8%', visionRate: '99.4%' },
    { target: '软件园三期A座 (856566)', sales: '¥980.50', orders: 245, stockRate: '48%', outOfStockRate: '12.4%', refillRate: '91.2%', onlineRate: '99.1%', visionRate: '98.1%' },
    { target: '五缘湾中心01号 (856588)', sales: '¥310.00', orders: 78, stockRate: '90%', outOfStockRate: '1.2%', refillRate: '99.0%', onlineRate: '88.4%', visionRate: '99.0%' },
    { target: '腾讯大厦A1站 (857001)', sales: '¥2,840.00', orders: 710, stockRate: '72%', outOfStockRate: '4.5%', refillRate: '97.8%', onlineRate: '99.9%', visionRate: '99.6%' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">运营综合数据报表与 KPI 矩阵</h2>
          <p className="text-xs text-slate-500">
            按时间、客户、门店、设备、商品多维剖析销售、缺货率、补货履约与 AI 识别精度
          </p>
        </div>
        <button
          onClick={() => alert('已导出全维数据报表 Excel')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>导出完整分析表</span>
        </button>
      </div>

      {/* Filter Dimension Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-slate-500">统计周期：</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700"
            >
              <option value="today">今日实时</option>
              <option value="7d">近 7 天</option>
              <option value="30d">近 30 天</option>
              <option value="90d">本季度</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500">聚合维度：</span>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setDimension('device')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  dimension === 'device' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                设备维度
              </button>
              <button
                onClick={() => setDimension('product')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  dimension === 'product' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                商品维度
              </button>
              <button
                onClick={() => setDimension('store')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  dimension === 'store' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                门店维度
              </button>
            </div>
          </div>
        </div>

        <div className="text-slate-400">
          全网综合在线率：<strong className="text-emerald-600 font-mono">99.4%</strong> · 补货及时率：
          <strong className="text-indigo-600 font-mono">96.8%</strong>
        </div>
      </div>

      {/* Main KPI Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">分析对象 (设备/门店)</th>
                <th className="py-2.5 px-3 font-semibold text-right">销售额</th>
                <th className="py-2.5 px-3 font-semibold text-right">订单数</th>
                <th className="py-2.5 px-3 font-semibold text-right">在柜饱满率</th>
                <th className="py-2.5 px-3 font-semibold text-right text-rose-600">缺货率</th>
                <th className="py-2.5 px-3 font-semibold text-right text-indigo-600">补货及时率</th>
                <th className="py-2.5 px-3 font-semibold text-right text-emerald-600">设备在线率</th>
                <th className="py-2.5 px-3 font-semibold text-right text-orange-600">识别成功率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-800">{row.target}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">{row.sales}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700">{row.orders} 笔</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700">{row.stockRate}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-rose-600">{row.outOfStockRate}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-indigo-600">{row.refillRate}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">{row.onlineRate}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-orange-600">{row.visionRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
