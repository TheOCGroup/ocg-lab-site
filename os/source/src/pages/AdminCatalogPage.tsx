import React, { useState } from 'react';
import { Product, ProductType, OutcomeCategory, ProductStatus, FulfillmentOption } from '../types';
import { PRODUCTS_DATA } from '../data/products';
import { 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Lock, 
  CheckCircle2, 
  Save, 
  Layers,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminCatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATA);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ProductType>('SaaS');
  const [newOutcome, setNewOutcome] = useState<OutcomeCategory>('Automate Operations');
  const [newPrice, setNewPrice] = useState(199);
  const [newStatus, setNewStatus] = useState<ProductStatus>('Published');
  const [newSummary, setNewSummary] = useState('');

  const handleToggleStatus = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus: ProductStatus = p.status === 'Published' ? 'Draft' : 'Published';
        toast.info(`Updated ${p.title} status to ${nextStatus}`);
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSummary) {
      toast.error('Title and summary are required.');
      return;
    }

    const createdProduct: Product = {
      id: `prod-${Date.now()}`,
      title: newTitle,
      subtitle: `${newType} for ${newOutcome}`,
      type: newType,
      outcomeCategory: newOutcome,
      iconName: 'Layers',
      status: newStatus,
      summary: newSummary,
      problemSolved: 'Automates manual operational friction.',
      intendedAudience: 'Business Owners & Team Leads',
      expectedResult: 'Saves 10+ hours per week.',
      howItWorks: ['Deploy system', 'Connect webhooks', 'Automate workflow'],
      features: ['Automated engine', '24/7 SLA tracking', 'CRM sync'],
      whatsIncluded: ['Product License', 'Documentation', 'Standard Support'],
      integrations: ['Webhooks', 'Zapier'],
      price: newPrice,
      billingModel: newType === 'SaaS' || newType === 'AI Worker' ? 'monthly' : 'one-time',
      fulfillmentOptions: ['DIY', 'INSTALL IT FOR ME'],
      specs: {
        language: 'TypeScript',
        architecture: 'Serverless API',
        deployment: 'Cloud Run',
        latency: '< 50ms'
      },
      techStack: ['TypeScript', 'React', 'Node.js']
    };

    setProducts([createdProduct, ...products]);
    setIsAddingNew(false);
    setNewTitle('');
    setNewSummary('');
    toast.success(`Published new product: ${createdProduct.title}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h1 className="font-heading font-extrabold text-2xl text-white">OCG Lab Admin Catalog Portal</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage catalog products, pricing models, fulfillment options, and release statuses.</p>
        </div>

        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product to Catalog</span>
        </button>
      </div>

      {/* Add New Product Form Drawer */}
      {isAddingNew && (
        <form onSubmit={handleCreateProduct} className="glass-card p-6 rounded-3xl border border-cyan-800 space-y-4">
          <h3 className="font-heading font-bold text-lg text-white">Create New Catalog Product</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Product Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Roof Estimating Assistant"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Product Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as ProductType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="SaaS">SaaS</option>
                <option value="AI Worker">AI Worker</option>
                <option value="Workflow">Workflow</option>
                <option value="Calculator">Calculator</option>
                <option value="Business System">Business System</option>
                <option value="Service">Service</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Price ($ USD)</label>
              <input
                type="number"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Short Product Summary</label>
            <textarea
              rows={2}
              required
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              placeholder="Describe the business bottleneck solved by this product..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md"
            >
              Publish to Storefront
            </button>
          </div>
        </form>
      )}

      {/* Catalog Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-heading font-bold text-lg text-white">Live Catalog Inventory ({products.length} Products)</h3>
          <span className="text-xs font-mono text-cyan-400">Server State: Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Outcome Goal</th>
                <th className="p-3">Price</th>
                <th className="p-3">Publication Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-semibold text-white">{prod.title}</td>
                  <td className="p-3 font-mono text-cyan-400">{prod.type}</td>
                  <td className="p-3 text-slate-300">{prod.outcomeCategory}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">${prod.price}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                      prod.status === 'Published' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {prod.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleStatus(prod.id)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg transition-colors font-medium"
                    >
                      Toggle {prod.status === 'Published' ? 'Draft' : 'Publish'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
