const BAR_COLORS = ['#4A90D9', '#52C9A0', '#FF6B6B', '#9B59B6', '#F39C12']

export default function AttachmentDNAChart({ data }) {
  if (!data?.dna?.length) return null

  const maxPct = Math.max(...data.dna.map((d) => d.percentage), 1)

  return (
    <div>
      <div className="dna-chart">
        {data.dna.map((item, i) => (
          <div key={item.style} className="dna-chart__row">
            <div className="dna-chart__labels">
              <span className="dna-chart__style">{item.style}</span>
              <span className="dna-chart__pct">{item.percentage}%</span>
            </div>
            <div className="dna-chart__track">
              <div
                className="dna-chart__bar"
                style={{
                  width: `${(item.percentage / maxPct) * 100}%`,
                  backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {data.explanation && (
        <p className="mt-4 text-sm leading-relaxed text-[#6b7280]">{data.explanation}</p>
      )}
    </div>
  )
}
