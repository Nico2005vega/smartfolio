import { Sk, SkStyle } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <style>{SkStyle}</style>

      {/* Banner */}
      <div style={{ background: "linear-gradient(135deg,#052e16,#166534)", borderRadius: 20, padding: "28px 32px", marginBottom: 24 }}>
        <Sk style={{ width: 80, height: 13, marginBottom: 8, background: "rgba(255,255,255,.15)" }}/>
        <Sk style={{ width: 200, height: 26, marginBottom: 12, background: "rgba(255,255,255,.2)" }}/>
        <Sk style={{ width: 280, height: 13, marginBottom: 20, background: "rgba(255,255,255,.12)" }}/>
        <Sk style={{ width: "100%", height: 6, background: "rgba(255,255,255,.1)" }}/>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ background: "white", borderRadius: 16, padding: 18, border: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 14 }}>
            <Sk style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0 }}/>
            <div style={{ flex: 1 }}>
              <Sk style={{ width: 40, height: 22, marginBottom: 6 }}/>
              <Sk style={{ width: 70, height: 12 }}/>
            </div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Quick actions */}
          <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #f0f0f0" }}>
            <Sk style={{ width: 120, height: 15, marginBottom: 14 }}/>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ border: "1px solid #f0f0f0", borderRadius: 12, padding: 14, display: "flex", alignItems: "center", gap: 10 }}>
                  <Sk style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0 }}/>
                  <div style={{ flex: 1 }}>
                    <Sk style={{ width: "80%", height: 13, marginBottom: 5 }}/>
                    <Sk style={{ width: "60%", height: 10 }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Records */}
          <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #f0f0f0" }}>
            <Sk style={{ width: 150, height: 15, marginBottom: 16 }}/>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ background: "#fafafa", borderRadius: 12, padding: 14, border: "1px solid #f0f0f0", textAlign: "center" }}>
                  <Sk style={{ width: 32, height: 32, margin: "0 auto 8px", borderRadius: "50%" }}/>
                  <Sk style={{ width: 30, height: 20, margin: "0 auto 5px" }}/>
                  <Sk style={{ width: 70, height: 11, margin: "0 auto" }}/>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Sk style={{ height: 140, borderRadius: 16 }}/>
          <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #f0f0f0" }}>
            <Sk style={{ width: 100, height: 14, marginBottom: 14 }}/>
            {[0,1,2,3,4].map(i => (
              <Sk key={i} style={{ width: "100%", height: 36, marginBottom: 8, borderRadius: 10 }}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}