import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CVData, CVStyleConfig, Skill } from "@/types";
import { formatDate } from "@/lib/utils";
import { registerPdfFonts, resolvePdfFont } from "@/lib/pdfFonts";

registerPdfFonts();

interface Props { data: CVData; watermark?: boolean; }

// Las 4 variantes reales, igual a la vista previa (antes solo existía "texto").
function SkillsSection({ allSkills, skillsSt, accent, fontR }: {
  allSkills: Skill[]; skillsSt: string; accent: string; fontR: string;
}) {
  if (skillsSt === "chips") return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
      {allSkills.map((sk) => (
        <Text key={sk.id} style={{
          fontSize: 7, color: accent, fontFamily: fontR,
          borderWidth: 0.75, borderColor: accent, borderRadius: 20,
          paddingHorizontal: 6, paddingVertical: 2, backgroundColor: `${accent}0a`,
        }}>
          {sk.name}
        </Text>
      ))}
    </View>
  );
  if (skillsSt === "dots") return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
      {allSkills.map((sk) => (
        <View key={sk.id} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: accent }} />
          <Text style={{ fontSize: 7, color: "#71717a", fontFamily: fontR }}>{sk.name}</Text>
        </View>
      ))}
    </View>
  );
  if (skillsSt === "bars") return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
      {allSkills.slice(0, 10).map((sk, i) => {
        const pct = [85, 70, 90, 75, 80, 65, 88, 72, 78, 68][i % 10];
        return (
          <View key={sk.id} style={{ width: "45%" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 1 }}>
              <Text style={{ fontSize: 6.5, color: "#52525b", fontFamily: fontR }}>{sk.name}</Text>
              <Text style={{ fontSize: 6.5, color: "#a1a1aa" }}>{pct}%</Text>
            </View>
            <View style={{ height: 2, backgroundColor: "#e4e4e7", borderRadius: 1 }}>
              <View style={{ height: 2, width: `${pct}%`, backgroundColor: accent, borderRadius: 1 }} />
            </View>
          </View>
        );
      })}
    </View>
  );
  // text (por defecto)
  return (
    <Text style={{ fontSize: 8, color: "#71717a", lineHeight: 1.9, fontFamily: fontR }}>
      {allSkills.map((sk) => sk.name).join("  ·  ")}
    </Text>
  );
}

export default function CVDocumentMinimal({ data, watermark }: Props) {
  const { profile, sections, skills, config } = data;
  const accent = config?.accent_color ?? "#18181b";
  const allSkills = Object.values(skills).flat();
  // Minimal es serif por defecto — solo cambia si el usuario elige otra fuente
  const { regular: fontR, bold: fontB } = resolvePdfFont((config as CVStyleConfig | undefined)?.font_name, { regular: "Times-Roman", bold: "Times-Bold" });
  const skillsSt = (config as CVStyleConfig | undefined)?.skills_style ?? "chips";

  const s = StyleSheet.create({
    page:     { padding:"38 44", fontFamily:fontR, fontSize:9, color:"#27272a", backgroundColor:"white" },
    name:     { fontSize:22, fontFamily:fontB, letterSpacing:-0.3, color:"#09090b", marginBottom:8 },
    rule:     { borderBottomWidth:0.7, borderBottomColor:"#e4e4e7", marginBottom:10 },
    contact:  { flexDirection:"row", flexWrap:"wrap", gap:14, fontSize:8, color:"#71717a", marginBottom:6 },
    bio:      { fontSize:8, color:"#52525b", lineHeight:1.7, marginBottom:16, maxWidth:400 },
    secHead:  { flexDirection:"row", alignItems:"center", gap:10, marginBottom:9, marginTop:14 },
    secLbl:   { fontSize:6.5, fontFamily:fontB, textTransform:"uppercase", letterSpacing:2, color:accent },
    secLine:  { flex:1, borderBottomWidth:0.5, borderBottomColor:"#e4e4e7" },
    row:      { flexDirection:"row", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7, gap:10 },
    rMain:    { flex:1 },
    rTitle:   { fontFamily:fontB, fontSize:9.5, color:"#09090b" },
    rSub:     { fontSize:7.5, color:"#71717a", marginTop:2 },
    rDesc:    { fontSize:7, color:"#a1a1aa", marginTop:2, lineHeight:1.5 },
    rDate:    { fontSize:7.5, color:"#a1a1aa", textAlign:"right", minWidth:42, flexShrink:0 },
    skills:   { fontSize:8, color:"#71717a", lineHeight:1.9 },
  });

  return (
    <Document title={`CV Minimalista — ${profile.first_name} ${profile.last_name}`} author="Smartfolio · BAN 00329">
      <Page size="A4" style={s.page}>
        {watermark && (
          <Text style={{
            position: "absolute", top: "48%", left: 0, right: 0,
            textAlign: "center", fontSize: 58, color: "#00000014",
            fontFamily: "Helvetica-Bold", transform: "rotate(-35deg)",
          }}>
            SMARTFOLIO · PLAN GRATUITO
          </Text>
        )}


        {/* Header */}
        <Text style={s.name}>{profile.first_name} {profile.last_name}</Text>
        <View style={s.rule} />
        <View style={s.contact}>
          {profile.city         && <Text>{profile.city}{profile.country ? `, ${profile.country}` : ""}</Text>}
          {profile.phone        && <Text>{profile.phone}</Text>}
          {profile.linkedin_url && <Text>LinkedIn</Text>}
          {profile.github_url   && <Text>GitHub</Text>}
          {profile.website_url  && <Text>Portfolio</Text>}
        </View>
        {profile.bio && <Text style={s.bio}>{profile.bio}</Text>}

        {/* Sections */}
        {sections.map((section) => (
          <View key={section.type}>
            <View style={s.secHead}>
              <Text style={s.secLbl}>{section.label}</Text>
              <View style={s.secLine} />
            </View>
            {section.records.map((r) => (
              <View key={r.id} style={s.row}>
                <View style={s.rMain}>
                  <Text style={s.rTitle}>{r.title}</Text>
                  <Text style={s.rSub}>{r.institution}{r.duration_hours ? ` — ${r.duration_hours}h` : ""}</Text>
                  {r.description && <Text style={s.rDesc}>{r.description}</Text>}
                </View>
                <Text style={s.rDate}>
                  {r.end_date ? formatDate(r.end_date,"yyyy") : formatDate(r.start_date,"yyyy")}
                </Text>
              </View>
            ))}
          </View>
        ))}

        {/* Skills */}
        {allSkills.length > 0 && (
          <View>
            <View style={s.secHead}>
              <Text style={s.secLbl}>Habilidades</Text>
              <View style={s.secLine} />
            </View>
            <SkillsSection allSkills={allSkills} skillsSt={skillsSt} accent={accent} fontR={fontR} />
          </View>
        )}
      </Page>
    </Document>
  );
}