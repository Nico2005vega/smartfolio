import { Sk, SkStyle } from "@/components/ui/Skeleton";

export default function DocumentsLoading() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <style>{SkStyle}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", gap: "16px" }}>
        <div>
          <Sk style={{ width: 180, height: 26, marginBottom: 8 }} />
          <Sk style={{ width: 130, height: 13 }} />
        </div>
        <Sk style={{ width: 140, height: 38, borderRadius: 12 }} />
      </div>

      {/* Document cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            background: "white", borderRadius: "14px",
            border: "1px solid #f0f0f0", padding: "16px 18px",
            display: "flex", alignItems: "center", gap: "14px",
          }}>
            <Sk style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <Sk style={{ width: "55%", height: 15, marginBottom: 7 }} />
              <Sk style={{ width: "30%", height: 11 }} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <Sk style={{ width: 34, height: 34, borderRadius: 9 }} />
              <Sk style={{ width: 34, height: 34, borderRadius: 9 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}