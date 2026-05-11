import { portfolioData } from "./portfolioData"

function formatCurrency(value) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`
}

function App() {
  const totalValue = portfolioData.reduce(
    (sum, item) => sum + item.current_value,
    0
  )

  const totalBuy = portfolioData
    .filter((item) => item.rebalance_amount > 0)
    .reduce((sum, item) => sum + item.rebalance_amount, 0)

  const totalSell = portfolioData
    .filter((item) => item.rebalance_amount < 0)
    .reduce((sum, item) => sum + Math.abs(item.rebalance_amount), 0)

  return (
    <main className="min-h-screen bg-[#0B1020] text-white">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
            ETF Portfolio Analytics
          </p>
          <h1 className="mt-2 text-4xl font-bold">
            ETF Portfolio Rebalancing Dashboard
          </h1>
          <p className="mt-3 max-w-3xl text-gray-300">
            React prototype showing portfolio value, allocation drift, asset
            exposure, and suggested buy/sell actions for a sample CAD ETF
            portfolio.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard title="Total Portfolio Value" value={formatCurrency(totalValue)} />
          <KpiCard title="Buy Needed" value={formatCurrency(totalBuy)} />
          <KpiCard title="Sell Needed" value={formatCurrency(totalSell)} />
          <KpiCard title="Holdings" value={portfolioData.length} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel title="Current Allocation by ETF">
            <div className="space-y-4">
              {portfolioData.map((item) => (
                <AllocationBar
                  key={item.ticker}
                  label={item.ticker}
                  value={item.actual_weight}
                />
              ))}
            </div>
          </Panel>

          <Panel title="Overweight / Underweight by ETF">
            <div className="space-y-4">
              {portfolioData.map((item) => (
                <DriftRow key={item.ticker} item={item} />
              ))}
            </div>
          </Panel>
        </div>

        <Panel title="Rebalancing Recommendations" className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-cyan-200">
                  <th className="py-3 pr-4">Ticker</th>
                  <th className="py-3 pr-4">Fund</th>
                  <th className="py-3 pr-4">Asset Class</th>
                  <th className="py-3 pr-4">Region</th>
                  <th className="py-3 pr-4">Value</th>
                  <th className="py-3 pr-4">Target</th>
                  <th className="py-3 pr-4">Actual</th>
                  <th className="py-3 pr-4">Drift</th>
                  <th className="py-3 pr-4">Amount</th>
                  <th className="py-3 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.map((item) => (
                  <tr
                    key={item.ticker}
                    className="border-b border-slate-800 text-gray-200"
                  >
                    <td className="py-3 pr-4 font-semibold text-white">
                      {item.ticker}
                    </td>
                    <td className="py-3 pr-4">{item.fund_name}</td>
                    <td className="py-3 pr-4">{item.asset_class}</td>
                    <td className="py-3 pr-4">{item.region}</td>
                    <td className="py-3 pr-4">
                      {formatCurrency(item.current_value)}
                    </td>
                    <td className="py-3 pr-4">
                      {formatPercent(item.target_weight)}
                    </td>
                    <td className="py-3 pr-4">
                      {formatPercent(item.actual_weight)}
                    </td>
                    <td
                      className={`py-3 pr-4 font-semibold ${
                        item.allocation_drift >= 0
                          ? "text-red-300"
                          : "text-emerald-300"
                      }`}
                    >
                      {formatPercent(item.allocation_drift)}
                    </td>
                    <td className="py-3 pr-4">
                      {formatCurrency(item.rebalance_amount)}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item.suggested_action === "Buy"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : item.suggested_action === "Sell"
                            ? "bg-red-500/20 text-red-300"
                            : "bg-slate-500/20 text-slate-300"
                        }`}
                      >
                        {item.suggested_action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>
    </main>
  )
}

function KpiCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-cyan-400/40 bg-slate-900 p-5 shadow-lg shadow-cyan-500/10">
      <p className="text-sm text-cyan-200">{title}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    </div>
  )
}

function Panel({ title, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-700 bg-slate-900/90 p-5 shadow-lg ${className}`}
    >
      <h2 className="mb-5 text-lg font-semibold text-white">{title}</h2>
      {children}
    </section>
  )
}

function AllocationBar({ label, value }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium text-white">{label}</span>
        <span className="text-cyan-200">{formatPercent(value)}</span>
      </div>
      <div className="h-3 rounded-full bg-slate-800">
        <div
          className="h-3 rounded-full bg-cyan-400"
          style={{ width: `${Math.min(value * 100, 100)}%` }}
        />
      </div>
    </div>
  )
}

function DriftRow({ item }) {
  const drift = item.allocation_drift
  const width = Math.min(Math.abs(drift) * 500, 100)

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium text-white">{item.ticker}</span>
        <span className={drift >= 0 ? "text-red-300" : "text-emerald-300"}>
          {formatPercent(drift)}
        </span>
      </div>
      <div className="h-3 rounded-full bg-slate-800">
        <div
          className={`h-3 rounded-full ${
            drift >= 0 ? "bg-red-400" : "bg-emerald-400"
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-400">
        {drift >= 0 ? "Over target" : "Under target"}
      </p>
    </div>
  )
}

export default App