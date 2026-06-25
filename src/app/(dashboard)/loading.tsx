import { Sk, SkStyle } from "@/components/ui/Skeleton";

export default function GenericLoading() {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <style>{SkStyle}</style>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <Sk style={{ width: 180, height: 28, marginBottom: 8 }}/>
          <Sk style={{ width: 260, height: 14 }}/>
        </div>
        <Sk style={{ width: 120, height: 38, borderRadius: 12 }}/>
      </div>
      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ background: "white", borderRadius: 16, padding: "18px 20px", border: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 14 }}>
            <Sk style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }}/>
            <div style={{ flex: 1 }}>
              <Sk style={{ width: "50%", height: 15, marginBottom: 7 }}/>
              <Sk style={{ width: "35%", height: 12 }}/>
            </div>
            <Sk style={{ width: 80, height: 14 }}/>
          </div>
        ))}
      </div>
    </div>
  );
}