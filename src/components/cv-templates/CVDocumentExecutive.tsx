import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CVData, CVStyleConfig, Skill } from "@/types";
import { formatDate } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/types";
import { registerPdfFonts, resolvePdfFont } from "@/lib/pdfFonts";

registerPdfFonts();

interface Props { data: CVData; watermark?: boolean; }

// Replica exactamente las 4 variantes de la vista previa: chips/bars/dots son
// listas planas de todas las habilidades; "text" (el único caso que SÍ agrupa
// por categoría en la vista previa) mantiene esa agrupación.
function SkillsSection({ skills, skillsSt, accent, fontR, fontB }: {
  skills: Record<string, Skill[]>; skillsSt: string; accent: string; fontR: string; fontB: string;
}) {
  const allSkills = Object.values(skills).flat();

  if (skillsSt === "chips") return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
      {allSkills.map((s) => (
        <Text key={s.id} style={{
          fontSize: 7, color: accent, fontFamily: fontR,
          borderWidth: 0.75, borderColor: accent, borderRadius: 20,
          paddingHorizontal: 6, paddingVertical: 2, backgroundColor: `${accent}0d`,
        }}>
          {s.name}
        </Text>
      ))}
    </View>
  );

  if (skillsSt === "bars") return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
      {allSkills.slice(0, 10).map((s, i) => {
        const pct = [85, 70, 90, 75, 80, 65, 88, 72, 78, 68][i % 10];
        return (
          <View key={s.id} style={{ width: "45%" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
              <Text style={{ fontSize: 6.5, color: "#374151", fontFamily: fontR }}>{s.name}</Text>
              <Text style={{ fontSize: 6.5, color: "#9ca3af" }}>{pct}%</Text>
            </View>
            <View style={{ height: 2.5, backgroundColor: "#e5e7eb", borderRadius: 2 }}>
              <View style={{ height: 2.5, width: `${pct}%`, backgroundColor: accent, borderRadius: 2 }} />
            </View>
          </View>
        );
      })}
    </View>
  );

  if (skillsSt === "dots") return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
      {allSkills.map((s) => (
        <View key={s.id} style={{ flexDirection: "row", alignItems: "center", gap: 5, width: "45%" }}>
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: accent }} />
          <Text style={{ fontSize: 7, color: "#6b7280", fontFamily: fontR }}>{s.name}</Text>
        </View>
      ))}
    </View>
  );

  // text (por defecto) — agrupado por categoría, igual que la vista previa
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
      {Object.entries(skills).map(([cat, list]) => list.length > 0 && (
        <View key={cat} style={{ minWidth: 120 }}>
          <Text style={{ fontSize: 7.5, fontFamily: fontB, color: "#6b7280", marginBottom: 2 }}>
            {SKILL_CATEGORY_LABELS[cat as keyof typeof SKILL_CATEGORY_LABELS]}
          </Text>
          <Text style={{ fontSize: 7.5, color: "#9ca3af", lineHeight: 1.5, fontFamily: fontR }}>
            {list.map((s) => s.name).join("  ·  ")}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function CVDocumentExecutive({ data, watermark }: Props) {
  const { profile, sections, skills, config } = data;
  const cfg = config as CVStyleConfig | undefined;
  const accent = cfg?.accent_color ?? "#374151";
  const { regular: fontR, bold: fontB } = resolvePdfFont(cfg?.font_name);
  const skillsSt = cfg?.skills_style ?? "chips";

  const styles = StyleSheet.create({
    page:   { padding: 42, fontFamily: fontR, fontSize: 9, color: "#374151" },
    name:   { fontSize: 20, fontFamily:fontB, textTransform:"uppercase",
              color:"#111827", letterSpacing: 2 },
    bar:    { width:32, height:2, backgroundColor: accent, marginVertical: 8 },
    contact:{ flexDirection:"row", flexWrap:"wrap", gap:6, fontSize:7.5, color:"#9ca3af", marginBottom:10 },
    bio:    { fontSize:8, color:"#6b7280", lineHeight:1.6, marginBottom:14, maxWidth:400 },
    secT:   { fontSize:7, fontFamily:fontB, textTransform:"uppercase",
              letterSpacing:2, color: accent, marginBottom: 8, marginTop:14 },
    row:    { flexDirection:"row", justifyContent:"space-between", marginBottom:8, paddingBottom:6,
              borderBottomWidth:0.3, borderBottomColor:"#e5e7eb" },
    rTitle: { fontFamily:fontB, fontSize:9, color:"#111827" },
    rSub:   { fontSize:7.5, color:"#6b7280", marginTop:2 },
    rDesc:  { fontSize:7, color:"#9ca3af", marginTop:2, lineHeight:1.4 },
    rDate:  { fontSize:7.5, color:"#9ca3af", textAlign:"right", minWidth:60 },
  });

  return (
    <Document title={`CV Ejecutivo - ${profile.first_name} ${profile.last_name}`}
      author="Smartfolio · BAN 00329 · UTS Bucaramanga">
      <Page size="A4" style={styles.page}>
        {watermark && (
          <Text style={{
            position: "absolute", top: "48%", left: 0, right: 0,
            textAlign: "center", fontSize: 58, color: "#00000014",
            fontFamily: "Helvetica-Bold", transform: "rotate(-35deg)",
          }}>
            SMARTFOLIO · PLAN GRATUITO
          </Text>
        )}

        <Text style={styles.name}>{profile.first_name} {profile.last_name}</Text>
        <View style={styles.bar} />
        <View style={styles.contact}>
          {profile.city    && <Text>📍 {profile.city}</Text>}
          {profile.phone   && <Text>📱 {profile.phone}</Text>}
          {profile.linkedin_url && <Text>🔗 LinkedIn</Text>}
          {profile.website_url  && <Text>🌐 Portafolio</Text>}
        </View>
        {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

        {sections.map((section) => (
          <View key={section.type}>
            <Text style={styles.secT}>{section.label}</Text>
            {section.records.map((r) => (
              <View key={r.id} style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rTitle}>{r.title}</Text>
                  <Text style={styles.rSub}>{r.institution}{r.duration_hours ? ` · ${r.duration_hours}h` : ""}</Text>
                  {r.description && <Text style={styles.rDesc}>{r.description}</Text>}
                </View>
                <Text style={styles.rDate}>
                  {r.end_date
                    ? formatDate(r.end_date, "yyyy")
                    : formatDate(r.start_date, "yyyy")}
                </Text>
              </View>
            ))}
          </View>
        ))}

        {Object.values(skills).flat().length > 0 && (
          <View>
            <Text style={styles.secT}>Competencias</Text>
            <SkillsSection skills={skills} skillsSt={skillsSt} accent={accent} fontR={fontR} fontB={fontB} />
          </View>
        )}
      </Page>
    </Document>
  );
}