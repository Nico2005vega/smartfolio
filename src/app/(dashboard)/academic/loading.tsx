export default function AcademicLoading() {
  return (
    <div style={{ padding: "0", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <div style={{ width: "220px", height: "28px", background: "#f0f0f0", borderRadius: "8px", marginBottom: "8px" }} className="animate-pulse" />
          <div style={{ width: "140px", height: "16px", background: "#f0f0f0", borderRadius: "6px" }} className="animate-pulse" />
        </div>
        <div style={{ width: "140px", height: "40px", background: "#f0f0f0", borderRadius: "12px" }} className="animate-pulse" />
      </div>
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", padding: "16px", marginBottom: "16px" }}>
        <div style={{ height: "44px", background: "#f0f0f0", borderRadius: "10px", marginBottom: "12px" }} className="animate-pulse" />
        <div style={{ display: "flex", gap: "8px" }}>
          {[1,2,3].map(i => <div key={i} style={{ width: "100px", height: "32px", background: "#f0f0f0", borderRadius: "8px" }} className="animate-pulse" />)}
        </div>
      </div>
      {[1,2].map(i => (
        <div key={i} style={{ background: "white", borderRadius: "16px", border: "1px solid #f0f0f0", marginBottom: "16px", overflow: "hidden" }}>
          <div style={{ height: "44px", background: "#f8f8f8", borderBottom: "1px solid #f0f0f0" }} />
          {[1,2].map(j => (
            <div key={j} style={{ padding: "16px 20px", borderBottom: "1px solid #f8f8f8", display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ width: "60%", height: "16px", background: "#f0f0f0", borderRadius: "4px", marginBottom: "8px" }} className="animate-pulse" />
                <div style={{ width: "40%", height: "12px", background: "#f0f0f0", borderRadius: "4px" }} className="animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}