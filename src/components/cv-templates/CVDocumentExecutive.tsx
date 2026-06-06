import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/types";

interface Props { data: CVData; }

export default function CVDocumentExecutive({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const accent = config?.accent_color ?? "#374151";

  const styles = StyleSheet.create({
    page:   { padding: 42, fontFamily: "Helvetica", fontSize: 9, color: "#374151" },
    name:   { fontSize: 20, fontFamily:"Helvetica-Bold", textTransform:"uppercase",
              color:"#111827", letterSpacing: 2 },
    bar:    { width:32, height:2, backgroundColor: accent, marginVertical: 8 },
    contact:{ flexDirection:"row", flexWrap:"wrap", gap:6, fontSize:7.5, color:"#9ca3af", marginBottom:10 },
    bio:    { fontSize:8, color:"#6b7280", lineHeight:1.6, marginBottom:14, maxWidth:400 },
    secT:   { fontSize:7, fontFamily:"Helvetica-Bold", textTransform:"uppercase",
              letterSpacing:2, color: accent, marginBottom: 8, marginTop:14 },
    row:    { flexDirection:"row", justifyContent:"space-between", marginBottom:8, paddingBottom:6,
              borderBottomWidth:0.3, borderBottomColor:"#e5e7eb" },
    rTitle: { fontFamily:"Helvetica-Bold", fontSize:9, color:"#111827" },
    rSub:   { fontSize:7.5, color:"#6b7280", marginTop:2 },
    rDesc:  { fontSize:7, color:"#9ca3af", marginTop:2, lineHeight:1.4 },
    rDate:  { fontSize:7.5, color:"#9ca3af", textAlign:"right", minWidth:60 },
    skillGrid:{ flexDirection:"row", flexWrap:"wrap", gap:12, marginTop:4 },
    skillCat: { minWidth:120 },
    catLabel: { fontSize:7.5, fontFamily:"Helvetica-Bold", color:"#6b7280", marginBottom:2 },
    catSkills:{ fontSize:7.5, color:"#9ca3af", lineHeight:1.5 },
  });

  return (
    <Document title={`CV Ejecutivo - ${profile.first_name} ${profile.last_name}`}
      author="Smartfolio · BAN 00329 · UTS Bucaramanga">
      <Page size="A4" style={styles.page}>
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
            <View style={styles.skillGrid}>
              {Object.entries(skills).map(([cat, list]) => list.length > 0 && (
                <View key={cat} style={styles.skillCat}>
                  <Text style={styles.catLabel}>
                    {SKILL_CATEGORY_LABELS[cat as keyof typeof SKILL_CATEGORY_LABELS]}
                  </Text>
                  <Text style={styles.catSkills}>
                    {list.map(s => s.name).join("  ·  ")}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
