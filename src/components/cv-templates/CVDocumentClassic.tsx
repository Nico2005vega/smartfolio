import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { CVData, CVStyleConfig, Skill } from "@/types";
import { formatDate } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/types";
import { registerPdfFonts, resolvePdfFont } from "@/lib/pdfFonts";

registerPdfFonts();

interface Props { data: CVData; watermark?: boolean; }

// Habilidades por categoría, respetando el estilo elegido (chips/puntos/barras/texto)
// — antes esta plantilla ignoraba skills_style y siempre mostraba lo mismo.
function SkillsGroup({ list, skillsSt, accent, fontR }: { list: Skill[]; skillsSt: string; accent: string; fontR: string }) {
  if (skillsSt === "dots") return (
    <View style={{ flexDirection: "column", gap: 2 }}>
      {list.map((s) => (
        <View key={s.id} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: accent }} />
          <Text style={{ fontSize: 7, color: "#4b5563", fontFamily: fontR }}>{s.name}</Text>
        </View>
      ))}
    </View>
  );
  if (skillsSt === "bars") return (
    <View style={{ flexDirection: "column", gap: 3 }}>
      {list.map((s, i) => {
        const pct = [85, 70, 90, 75, 80, 65, 88, 72, 78, 68][i % 10];
        return (
          <View key={s.id}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 1 }}>
              <Text style={{ fontSize: 6.5, color: "#374151", fontFamily: fontR }}>{s.name}</Text>
              <Text style={{ fontSize: 6.5, color: "#9ca3af" }}>{pct}%</Text>
            </View>
            <View style={{ height: 2, backgroundColor: "#e5e7eb", borderRadius: 1 }}>
              <View style={{ height: 2, width: `${pct}%`, backgroundColor: accent, borderRadius: 1 }} />
            </View>
          </View>
        );
      })}
    </View>
  );
  if (skillsSt === "text") return (
    <Text style={{ fontSize: 7, color: "#6b7280", lineHeight: 1.6, fontFamily: fontR }}>
      {list.map((s) => s.name).join("  ·  ")}
    </Text>
  );
  // chips (por defecto) — usa el color de acento, no gris fijo
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
      {list.map((s) => (
        <Text key={s.id} style={{
          fontSize: 7, color: accent, fontFamily: fontR,
          borderWidth: 0.75, borderColor: accent, borderRadius: 20,
          paddingHorizontal: 6, paddingVertical: 2, backgroundColor: `${accent}0e`,
        }}>
          {s.name}
        </Text>
      ))}
    </View>
  );
}

export default function CVDocumentClassic({ data, watermark }: Props) {
  const { profile, sections, skills, config } = data;
  const cfg = config as CVStyleConfig | undefined;
  const accent = cfg?.accent_color ?? "#16a34a";
  const { regular: fontR, bold: fontB } = resolvePdfFont(cfg?.font_name);
  const showPhoto = cfg?.show_photo !== false;
  const photoR = cfg?.photo_shape === "square" ? 4 : cfg?.photo_shape === "rounded" ? 12 : 36;
  const skillsSt = cfg?.skills_style ?? "chips";

  const styles = StyleSheet.create({
    page:       { padding: 36, fontFamily: fontR, fontSize: 9, color: "#374151" },
    header:     { alignItems: "center", textAlign: "center", borderBottomWidth: 2, borderBottomColor: accent, paddingBottom: 14, marginBottom: 18 },
    name:       { fontSize: 19, fontFamily: fontB, color: "#111827", marginBottom: 4, textAlign: "center" },
    contactRow: { flexDirection:"row", flexWrap:"wrap", justifyContent: "center", gap: 8, fontSize: 8, color: "#6b7280", marginTop: 6 },
    bio:        { fontSize: 8, color: "#6b7280", lineHeight: 1.5, marginTop: 8, textAlign: "center", maxWidth: 420 },
    sectionT:   { fontSize: 8, fontFamily:fontB, textTransform:"uppercase",
                  letterSpacing: 1.5, color: accent, paddingBottom: 3,
                  borderBottomWidth: 0.5, borderBottomColor: accent, marginBottom: 8, marginTop: 14 },
    row:        { flexDirection:"row", justifyContent:"space-between", marginBottom: 6 },
    rTitle:     { fontFamily:fontB, fontSize: 9 },
    rSub:       { fontSize: 7.5, color:"#6b7280", marginTop: 1 },
    rDate:      { fontSize: 7.5, color:"#9ca3af", textAlign:"right" },
  });

  return (
    <Document title={`CV Clásico - ${profile.first_name} ${profile.last_name}`}
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

        <View style={styles.header}>
          {showPhoto && profile.photo_url && (
            <Image src={profile.photo_url} style={{ width: 72, height: 72, borderRadius: photoR, marginBottom: 10, borderWidth: 2, borderColor: accent }} />
          )}
          <Text style={styles.name}>{profile.first_name} {profile.last_name}</Text>
          <View style={styles.contactRow}>
            {profile.city    && <Text>📍 {profile.city}, {profile.country}</Text>}
            {profile.phone   && <Text>📱 {profile.phone}</Text>}
            {profile.linkedin_url && <Text>🔗 LinkedIn</Text>}
            {profile.website_url  && <Text>🌐 Portafolio</Text>}
          </View>
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
        </View>

        {sections.map((section) => (
          <View key={section.type}>
            <Text style={styles.sectionT}>{section.label}</Text>
            {section.records.map((r) => (
              <View key={r.id} style={styles.row}>
                <View style={{ flex:1 }}>
                  <Text style={styles.rTitle}>{r.title}</Text>
                  <Text style={styles.rSub}>{r.institution}{r.duration_hours ? ` · ${r.duration_hours}h` : ""}</Text>
                </View>
                <View style={{ width:70 }}>
                  <Text style={styles.rDate}>
                    {r.start_date ? formatDate(r.start_date,"MMM yyyy") : ""}
                    {r.end_date ? ` — ${formatDate(r.end_date,"MMM yyyy")}` : ""}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        {Object.values(skills).flat().length > 0 && (
          <View>
            <Text style={styles.sectionT}>Competencias</Text>
            {Object.entries(skills).map(([cat, list]) => list.length > 0 && (
              <View key={cat} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize:7.5, fontFamily:fontB, color:"#6b7280", marginBottom:3 }}>
                  {SKILL_CATEGORY_LABELS[cat as keyof typeof SKILL_CATEGORY_LABELS]}
                </Text>
                <SkillsGroup list={list} skillsSt={skillsSt} accent={accent} fontR={fontR} />
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}