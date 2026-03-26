import { useMemo } from 'react';
import { useItems, type DecryptedItem } from '@/lib/core';
import { BarChart3, TrendingUp, Award, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function AnalyticsApp({ vaultId, encryptionKey }: { vaultId: string, encryptionKey: CryptoKey }) {
  const { items } = useItems(vaultId, encryptionKey);

  const stats = useMemo(() => {
    const expenses = items.filter((i: DecryptedItem) => i.type === 'expense');
    const debits = expenses.filter((e: DecryptedItem) => (e.payload as any).entryType === 'debit');
    const incomeTotal = expenses.filter((e: DecryptedItem) => (e.payload as any).entryType === 'credit').reduce((acc: number, e: DecryptedItem) => acc + (e.payload as any).amount, 0);
    const expenseTotal = debits.reduce((acc: number, e: DecryptedItem) => acc + (e.payload as any).amount, 0);

    const needsTotal = debits.filter((e: DecryptedItem) => (e.payload as any).classification === 'need').reduce((acc: number, e: DecryptedItem) => acc + (e.payload as any).amount, 0);
    const wantsTotal = debits.filter((e: DecryptedItem) => (e.payload as any).classification === 'want').reduce((acc: number, e: DecryptedItem) => acc + (e.payload as any).amount, 0);

    const catTotals = debits.reduce((acc: Record<string, number>, e: DecryptedItem) => {
      const cat = (e.payload as any).category || 'General';
      acc[cat] = (acc[cat] || 0) + (e.payload as any).amount;
      return acc;
    }, {} as Record<string, number>);

    const spikes = Object.entries(catTotals)
      .filter(([_, total]) => (total as number) > (expenseTotal * 0.3) && expenseTotal > 0)
      .map(([cat, _]) => cat);

    return {
      financeStats: { 
        income: incomeTotal, 
        expenses: expenseTotal, 
        net: incomeTotal - expenseTotal,
        needs: needsTotal,
        wants: wantsTotal,
        spikes
      }
    };
  }, [items]);

  const cards = [
    { 
      label: 'Monthly Net', 
      value: `$${stats.financeStats.net.toLocaleString()}`, 
      sub: stats.financeStats.net >= 0 ? 'Surplus' : 'Deficit',
      icon: TrendingUp,
      color: stats.financeStats.net >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
    },
    { 
      label: 'Burn Rate', 
      value: `$${stats.financeStats.expenses.toLocaleString()}`, 
      sub: `Total outgoing`,
      icon: Zap,
      color: 'bg-orange-500/10 text-orange-500'
    },
    { 
      label: 'Saving Power', 
      value: stats.financeStats.income > 0 ? `${Math.round((stats.financeStats.net / stats.financeStats.income) * 100)}%` : '0%', 
      sub: `Income retained`,
      icon: Award,
      color: 'bg-blue-500/10 text-blue-500'
    },
    { 
      label: 'Financial Vault', 
      value: 'Secured', 
      sub: `Zero-trust ledger`,
      icon: Shield,
      color: 'bg-purple-500/10 text-purple-500'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/10 rounded-xl">
            <BarChart3 className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financial Intelligence</h2>
          <p className="text-sm text-muted-foreground">Deep analysis of your spending habits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`p-2 rounded-lg w-fit mb-4 transition-transform group-hover:scale-110 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
            <h3 className="text-3xl font-bold mt-1 tracking-tight">{card.value}</h3>
            <p className="text-xs text-muted-foreground/60 mt-1 font-medium italic">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">Behavioral Balance (50/30/20)</h3>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
              <span className="text-primary font-black">Essentials (Needs)</span>
              <span>${stats.financeStats.needs.toLocaleString()}</span>
            </div>
            <div className="h-3 w-full bg-secondary rounded-full overflow-hidden flex">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stats.financeStats.expenses > 0 ? (stats.financeStats.needs / stats.financeStats.expenses) * 100 : 0}%` }}
                className="h-full bg-primary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
              <span className="text-amber-500 font-black">Discretionary (Wants)</span>
              <span>${stats.financeStats.wants.toLocaleString()}</span>
            </div>
            <div className="h-3 w-full bg-secondary rounded-full overflow-hidden flex">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stats.financeStats.expenses > 0 ? (stats.financeStats.wants / stats.financeStats.expenses) * 100 : 0}%` }}
                className="h-full bg-amber-500"
              />
            </div>
          </div>
          
          {stats.financeStats.spikes.length > 0 && (
            <div className="mt-6 p-4 bg-red-500/5 rounded-xl border border-red-500/20">
              <div className="flex items-center gap-2 mb-2 text-red-500 font-black text-[10px] uppercase tracking-widest">
                <TrendingUp className="w-4 h-4" /> Anomaly Detected
              </div>
              <div className="space-y-1">
                {stats.financeStats.spikes.map((cat: string) => (
                  <p key={cat} className="text-xs font-medium text-red-600">
                    ⚠️ Spike in <span className="font-black uppercase">{cat}</span> exceeds 30% of total spend.
                  </p>
                ))}
                <p className="text-[10px] text-muted-foreground mt-2 italic">Recommendation: Audit recent high-value entries in these categories.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
