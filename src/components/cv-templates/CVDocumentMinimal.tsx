import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props { data: CVData; }

export default function CVDocumentMinimal({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const accent = config?.accent_color ?? "#18181b";
  const allSkills = Object.values(skills).flat();

  const s = StyleSheet.create({
    page:     { padding:"38 44", fontFamily:"Times-Roman", fontSize:9, color:"#27272a", backgroundColor:"white" },
    name:     { fontSize:22, fontFamily:"Times-Bold", letterSpacing:-0.3, color:"#09090b", marginBottom:8 },
    rule:     { borderBottomWidth:0.7, borderBottomColor:"#e4e4e7", marginBottom:10 },
    contact:  { flexDirection:"row", flexWrap:"wrap", gap:14, fontSize:8, color:"#71717a", marginBottom:6 },
    bio:      { fontSize:8, color:"#52525b", lineHeight:1.7, marginBottom:16, maxWidth:400 },
    secHead:  { flexDirection:"row", alignItems:"center", gap:10, marginBottom:9, marginTop:14 },
    secLbl:   { fontSize:6.5, fontFamily:"Times-Bold", textTransform:"uppercase", letterSpacing:2, color:accent },
    secLine:  { flex:1, borderBottomWidth:0.5, borderBottomColor:"#e4e4e7" },
    row:      { flexDirection:"row", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7, gap:10 },
    rMain:    { flex:1 },
    rTitle:   { fontFamily:"Times-Bold", fontSize:9.5, color:"#09090b" },
    rSub:     { fontSize:7.5, color:"#71717a", marginTop:2 },
    rDesc:    { fontSize:7, color:"#a1a1aa", marginTop:2, lineHeight:1.5 },
    rDate:    { fontSize:7.5, color:"#a1a1aa", textAlign:"right", minWidth:42, flexShrink:0 },
    skills:   { fontSize:8, color:"#71717a", lineHeight:1.9 },
  });

  return (
    <Document title={`CV Minimalista — ${profile.first_name} ${profile.last_name}`} author="Smartfolio · BAN 00329">
      <Page size="A4" style={s.page}>

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
            <Text style={s.skills}>
              {allSkills.map((sk) => sk.name).join("  ·  ")}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}