import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Scan,
  TrendingUp,
  Tag,
  Barcode,
  Layers,
  X,
  Edit2,
  DollarSign,
  History,
  Check,
} from 'lucide-react';
import { ProductSKU } from '../../../types/admin';

interface ProductManagementPageProps {
  products: ProductSKU[];
  onUpdateProduct: (product: ProductSKU) => void;
  onAddProduct: (product: ProductSKU) => void;
}

export const ProductManagementPage: React.FC<ProductManagementPageProps> = ({
  products,
  onUpdateProduct,
  onAddProduct,
}) => {
  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState<ProductSKU | null>(null);
  const [drawerTab, setDrawerTab] = useState<'base' | 'vision' | 'pricing' | 'sales'>('base');

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== 'ALL' && p.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.includes(q)
      );
    }
    return true;
  });

  const handleToggleStatus = (p: ProductSKU) => {
    const nextStatus = p.status === 'on_shelf' ? 'off_shelf' : 'on_shelf';
    onUpdateProduct({ ...p, status: nextStatus });
    if (selectedProduct?.id === p.id) {
      setSelectedProduct({ ...p, status: nextStatus });
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">商品与 SKU 资料中心</h2>
          <p className="text-xs text-slate-500">
            商品基础档案、条形码、成本售价规则与 AI 视觉特征识别训练集管理
          </p>
        </div>
        <button
          onClick={() => {
            const newSku: ProductSKU = {
              id: `p-${Date.now()}`,
              sku: `SKU-DRK-00${products.length + 1}`,
              name: '维他柠檬茶饮料',
              spec: '250ml/盒',
              barcode: '6901009988112',
              category: '茶饮料',
              costPrice: 2.1,
              sellingPrice: 3.5,
              status: 'on_shelf',
              image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=300',
              visionTrained: true,
              featureCode: 'FEAT_VITA_LEMON_250',
              shelfLifeDays: 360,
              totalStockAllDevices: 20,
              monthlySales: 780,
            };
            onAddProduct(newSku);
            setSelectedProduct(newSku);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff6900] hover:bg-[#ea5e00] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新增商品档案</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1">
            <span className="text-slate-500">商品分类：</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">全部分类</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500">上下架状态：</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">全部状态</option>
              <option value="on_shelf">上架中</option>
              <option value="off_shelf">已下架</option>
            </select>
          </div>

          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索商品名 / SKU / 条形码..."
              className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="text-slate-400 text-xs">
          共 <strong className="text-slate-800 font-mono">{filteredProducts.length}</strong> 款在库 SKU
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">商品图 / SKU</th>
                <th className="py-2.5 px-3 font-semibold">商品名称与规格</th>
                <th className="py-2.5 px-3 font-semibold">国际条码</th>
                <th className="py-2.5 px-3 font-semibold">分类</th>
                <th className="py-2.5 px-3 font-semibold text-right">成本底价</th>
                <th className="py-2.5 px-3 font-semibold text-right">标准售价</th>
                <th className="py-2.5 px-3 font-semibold text-center">AI视觉特征库</th>
                <th className="py-2.5 px-3 font-semibold text-center">状态</th>
                <th className="py-2.5 px-3 font-semibold text-right">月销量</th>
                <th className="py-2.5 px-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    selectedProduct?.id === p.id ? 'bg-orange-50/40' : ''
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-100 p-1 shrink-0"
                      />
                      <span className="font-mono text-slate-600 font-medium">{p.sku}</span>
                    </div>
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900">{p.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{p.spec}</div>
                  </td>

                  <td className="py-2.5 px-3 font-mono text-slate-600">
                    {p.barcode}
                  </td>

                  <td className="py-2.5 px-3">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                      {p.category}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    ¥{p.costPrice.toFixed(2)}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono font-bold text-orange-600">
                    ¥{p.sellingPrice.toFixed(2)}
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                        p.visionTrained
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <Scan className="w-3 h-3" />
                      {p.visionTrained ? '已训练' : '待建模'}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        p.status === 'on_shelf'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {p.status === 'on_shelf' ? '上架中' : '已下架'}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono text-slate-700 tabular-nums">
                    {p.monthlySales} 件
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="text-orange-600 hover:text-orange-700 font-medium cursor-pointer"
                      >
                        详情
                      </button>
                      <span className="text-slate-200">|</span>
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`font-medium cursor-pointer ${
                          p.status === 'on_shelf'
                            ? 'text-slate-500 hover:text-rose-600'
                            : 'text-emerald-600 hover:text-emerald-700'
                        }`}
                      >
                        {p.status === 'on_shelf' ? '下架' : '上架'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Detail Drawer */}
      {selectedProduct && (
        <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl border-l border-slate-200 z-40 flex flex-col animate-in slide-in-from-right duration-200 text-slate-800">
          <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-10 h-10 object-contain rounded-lg bg-white border border-slate-200 p-1"
              />
              <div>
                <h3 className="font-bold text-sm text-slate-900">{selectedProduct.name}</h3>
                <span className="font-mono text-xs text-slate-500">{selectedProduct.sku}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedProduct(null)}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Tabs */}
          <div className="px-4 border-b border-slate-200 flex items-center gap-4 text-xs font-semibold bg-white">
            {[
              { id: 'base', label: '基础资料' },
              { id: 'vision', label: 'AI识别资料' },
              { id: 'pricing', label: '价格与利润规则' },
              { id: 'sales', label: '近30天销售记录' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDrawerTab(tab.id as any)}
                className={`py-3 relative transition-colors cursor-pointer ${
                  drawerTab === tab.id
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {drawerTab === 'base' && (
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">商品名称</span>
                    <span className="font-bold text-slate-800">{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">包装规格</span>
                    <span className="text-slate-800">{selectedProduct.spec}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">国际条码 (EAN-13)</span>
                    <span className="font-mono font-medium text-slate-800">{selectedProduct.barcode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">保质期</span>
                    <span className="text-slate-800">{selectedProduct.shelfLifeDays} 天</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">在柜总库存</span>
                    <span className="font-mono font-bold text-slate-900">{selectedProduct.totalStockAllDevices} 件</span>
                  </div>
                </div>

                <div className="p-3 border border-slate-200 rounded-xl">
                  <span className="font-semibold text-slate-700 block mb-2">适用售卖机型</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">GJ-V4-SmartVision 智能视觉柜</span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">GJ-V3-DualCamera 双目重力柜</span>
                  </div>
                </div>
              </div>
            )}

            {drawerTab === 'vision' && (
              <div className="space-y-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-800 leading-relaxed">
                  ✓ 该商品已完成 3D 视觉特征建模，包含 360 度罐身轮廓、顶视图与底部印刷条码向量提取。
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1.5">
                  <div className="text-slate-400">特征码 (Feature Vector ID):</div>
                  <div className="text-slate-800 font-bold">{selectedProduct.featureCode}</div>
                  <div className="text-slate-400 mt-2">单罐标准重量比对值:</div>
                  <div className="text-slate-800 font-bold">360g ± 15g (配合重力传感器双模判定)</div>
                </div>
              </div>
            )}

            {drawerTab === 'pricing' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-slate-500 text-[11px]">进货成本价</div>
                    <div className="font-mono text-base font-bold text-slate-900 mt-1">
                      ¥{selectedProduct.costPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-slate-500 text-[11px]">标准终端零售价</div>
                    <div className="font-mono text-base font-bold text-orange-600 mt-1">
                      ¥{selectedProduct.sellingPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                  <span className="text-slate-500">单品毛利率</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {(
                      ((selectedProduct.sellingPrice - selectedProduct.costPrice) /
                        selectedProduct.sellingPrice) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            )}

            {drawerTab === 'sales' && (
              <div className="space-y-2">
                <div className="text-slate-500 mb-2">近 30 天出货流水概览：</div>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                  <div className="p-2.5 flex justify-between items-center bg-slate-50/50">
                    <div>
                      <div className="font-medium text-slate-800">创客大堂01号柜 (856565)</div>
                      <div className="text-[11px] text-slate-400">2026-06-16 14:33:29</div>
                    </div>
                    <span className="font-mono font-bold text-slate-800">x 1 件 (¥4.00)</span>
                  </div>
                  <div className="p-2.5 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-slate-800">创客大堂01号柜 (856565)</div>
                      <div className="text-[11px] text-slate-400">2026-06-16 14:10:05</div>
                    </div>
                    <span className="font-mono font-bold text-slate-800">x 1 件 (¥4.00)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
