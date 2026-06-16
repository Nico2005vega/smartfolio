export default function DashboardLoading() {
  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Header skeleton */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ width: "200px", height: "28px", background: "#f0f0f0", borderRadius: "8px", marginBottom: "8px" }} className="animate-pulse" />
            <div style={{ width: "280px", height: "16px", background: "#f0f0f0", borderRadius: "6px" }} className="animate-pulse" />
          </div>
          <div style={{ width: "120px", height: "40px", background: "#f0f0f0", borderRadius: "12px" }} className="animate-pulse" />
        </div>

        {/* Cards skeleton */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#f0f0f0" }} className="animate-pulse" />
              <div style={{ flex: 1 }}>
                <div style={{ width: "60px", height: "28px", background: "#f0f0f0", borderRadius: "6px", marginBottom: "6px" }} className="animate-pulse" />
                <div style={{ width: "100px", height: "14px", background: "#f0f0f0", borderRadius: "4px" }} className="animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "24px" }}>
          <div style={{ width: "180px", height: "20px", background: "#f0f0f0", borderRadius: "6px", marginBottom: "20px" }} className="animate-pulse" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "12px" }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ height: "80px", background: "#f0f0f0", borderRadius: "12px" }} className="animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}