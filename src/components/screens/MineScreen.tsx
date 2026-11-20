import React, { useState } from 'react';
import {
  ChevronRight,
  FileText,
  LogOut,
  User,
} from 'lucide-react';
import { MiniProgramHeader } from '../common/MiniProgramHeader';
import { MiniProgramTabBar } from '../common/MiniProgramTabBar';
import { Order } from '../../types/vending';

interface MineScreenProps {
  orders: Order[];
  onNavigateTab: (tab: 'home' | 'mine') => void;
  onOpenOrders: () => void;
}

export const MineScreen: React.FC<MineScreenProps> = ({
  orders,
  onNavigateTab,
  onOpenOrders,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const paidOrdersCount = orders.filter(
    (o) => o.status === '已支付' && o.totalAmount > 0 && o.items.length > 0
  ).length;

  return (
    <div className="relative w-full h-full flex flex-col bg-[#f5f6f8] select-none overflow-hidden font-sans text-slate-800">
      {/* Top Status Bar & Title */}
      <MiniProgramHeader
        dark={false}
        time="11:28"
        transparent={false}
        title="我的"
      />

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* 头像 + 登录用户 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-2 ${
                isLoggedIn
                  ? 'bg-gradient-to-tr from-[#ff6900] to-orange-400 text-white border-orange-100 shadow-sm'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
            >
              {isLoggedIn ? (
                <span className="text-lg font-bold tracking-wider">陈</span>
              ) : (
                <User className="w-7 h-7" />
              )}
            </div>

            <div className="min-w-0">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      微信用户_陈先生
                    </h3>
                    <span className="text-[10px] text-[#07c160] bg-emerald-50 px-1.5 py-0.5 rounded font-medium shrink-0">
                      已登录
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    138****8895
                  </p>
                </>
              ) : (
                <div>
                  <h3 className="text-base font-bold text-slate-900">未登录</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    点击右侧按钮授权微信登录
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
              isLoggedIn
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-1'
                : 'bg-[#07c160] text-white hover:bg-[#06ad56]'
            }`}
          >
            {isLoggedIn ? (
              <>
                <LogOut className="w-3.5 h-3.5" />
                <span>切换</span>
              </>
            ) : (
              <span>微信登录</span>
            )}
          </button>
        </div>

        {/* 订单栏目 */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
          <button
            type="button"
            onClick={onOpenOrders}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#ff6900] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900">我的订单</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>{isLoggedIn ? `${paidOrdersCount} 笔` : '请先登录'}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Mini Program Bottom Tab Bar */}
      <MiniProgramTabBar activeTab="mine" onSelectTab={onNavigateTab} />
    </div>
  );
};
