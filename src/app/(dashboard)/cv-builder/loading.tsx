import { Sk, SkStyle } from "@/components/ui/Skeleton";

export default function CVBuilderLoading() {
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <style>{SkStyle}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <Sk style={{ width: 200, height: 28, marginBottom: 8 }}/>
          <Sk style={{ width: 280, height: 14 }}/>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Sk style={{ width: 100, height: 36, borderRadius: 12 }}/>
          <Sk style={{ width: 90, height: 36, borderRadius: 12 }}/>
          <Sk style={{ width: 130, height: 36, borderRadius: 12 }}/>
        </div>
      </div>

      {/* Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20 }}>
        {/* Panel */}
        <div style={{ background: "white", borderRadius: 24, border: "1px solid #f0f0f0", overflow: "hidden" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, padding: 6, background: "#f8fafc", borderBottom: "1px solid #f0f0f0" }}>
            {[0,1,2,3,4].map(i => (
              <Sk key={i} style={{ flex: 1, height: 32, borderRadius: 16 }}/>
            ))}
          </div>
          {/* Content */}
          <div style={{ padding: 16 }}>
            <Sk style={{ width: "100%", height: 44, borderRadius: 16, marginBottom: 12 }}/>
            <Sk style={{ width: 120, height: 12, marginBottom: 12 }}/>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[0,1,2,3,4,5].map(i => (
                <div key={i} style={{ borderRadius: 16, border: "1px solid #f0f0f0", overflow: "hidden" }}>
                  <Sk style={{ width: "100%", height: 80, borderRadius: 0 }}/>
                  <div style={{ padding: 10 }}>
                    <Sk style={{ width: "70%", height: 12, marginBottom: 5 }}/>
                    <Sk style={{ width: "90%", height: 10 }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <Sk style={{ width: 160, height: 14 }}/>
            <Sk style={{ width: 200, height: 14 }}/>
          </div>
          <div style={{ background: "linear-gradient(135deg,#f1f5f9,#e2e8f0)", borderRadius: 24, padding: 20, minHeight: 640, border: "1px solid #e2e8f0" }}>
            <Sk style={{ width: "100%", height: "100%", minHeight: 580, borderRadius: 16 }}/>
          </div>
        </div>
      </div>
    </div>
  );
}