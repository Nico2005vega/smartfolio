import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/types";

interface Props { data: CVData; }

export default function CVDocumentClassic({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const accent = config?.accent_color ?? "#16a34a";

  const styles = StyleSheet.create({
    page:       { padding: 36, fontFamily: "Helvetica", fontSize: 9, color: "#374151" },
    header:     { borderBottomWidth: 2, borderBottomColor: accent, paddingBottom: 12, marginBottom: 16 },
    name:       { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 4 },
    contactRow: { flexDirection:"row", flexWrap:"wrap", gap: 8, fontSize: 8, color: "#6b7280", marginTop: 4 },
    bio:        { fontSize: 8, color: "#6b7280", lineHeight: 1.5, marginTop: 6 },
    sectionT:   { fontSize: 8, fontFamily:"Helvetica-Bold", textTransform:"uppercase",
                  letterSpacing: 1.5, color: accent, paddingBottom: 3,
                  borderBottomWidth: 0.5, borderBottomColor: accent+"88", marginBottom: 8, marginTop: 14 },
    row:        { flexDirection:"row", justifyContent:"space-between", marginBottom: 6 },
    rTitle:     { fontFamily:"Helvetica-Bold", fontSize: 9 },
    rSub:       { fontSize: 7.5, color:"#6b7280", marginTop: 1 },
    rDate:      { fontSize: 7.5, color:"#9ca3af", textAlign:"right" },
    skillRow:   { flexDirection:"row", flexWrap:"wrap", gap:4, marginTop:4 },
    skill:      { fontSize: 7, color:"#4b5563", borderWidth:0.5, borderColor:"#d1d5db",
                  borderRadius:3, paddingHorizontal:5, paddingVertical:2 },
  });

  return (
    <Document title={`CV Clásico - ${profile.first_name} ${profile.last_name}`}
      author="Smartfolio · BAN 00329 · UTS Bucaramanga">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
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
                <Text style={{ fontSize:7.5, fontFamily:"Helvetica-Bold", color:"#6b7280", marginBottom:3 }}>
                  {SKILL_CATEGORY_LABELS[cat as keyof typeof SKILL_CATEGORY_LABELS]}
                </Text>
                <View style={styles.skillRow}>
                  {list.map((s) => <Text key={s.id} style={styles.skill}>{s.name}</Text>)}
                </View>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
