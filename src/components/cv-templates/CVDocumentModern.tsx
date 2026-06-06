import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props { data: CVData; }

export default function CVDocumentModern({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const accent = config?.accent_color ?? "#16a34a";
  const allSkills = Object.values(skills).flat();

  const styles = StyleSheet.create({
    page:      { flexDirection: "row", fontFamily: "Helvetica", fontSize: 9, color: "#374151" },
    sidebar:   { width: 155, backgroundColor: accent, padding: 16, color: "white" },
    content:   { flex: 1, padding: 20 },
    avatar:    { width: 60, height: 60, borderRadius: 30, marginBottom: 12,
                 border: "2px solid rgba(255,255,255,0.4)" },
    avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, marginBottom: 12,
                         backgroundColor: "rgba(255,255,255,0.2)" },
    name:      { fontSize: 16, fontFamily: "Helvetica-Bold", color: accent, marginBottom: 6 },
    bio:       { fontSize: 8, color: "#6b7280", lineHeight: 1.5, marginBottom: 10 },
    email:     { fontSize: 8, color: "#6b7280", marginBottom: 16 },
    secTitle:  { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase",
                 letterSpacing: 1, color: accent, borderBottomWidth: 1.5,
                 borderBottomColor: accent, paddingBottom: 3, marginBottom: 8, marginTop: 12 },
    recordRow: { flexDirection: "row", marginBottom: 6, gap: 8 },
    year:      { width: 30, fontSize: 8, color: "#9ca3af", textAlign: "right" },
    recInfo:   { flex: 1 },
    recTitle:  { fontFamily: "Helvetica-Bold", fontSize: 9 },
    recSub:    { fontSize: 7.5, color: "#6b7280", marginTop: 1 },
    sbLabel:   { fontSize: 7, fontFamily: "Helvetica-Bold", textTransform: "uppercase",
                 letterSpacing: 1, color: "rgba(255,255,255,0.6)", marginBottom: 5, marginTop: 12 },
    sbItem:    { fontSize: 8, color: "#ffffff", backgroundColor: "rgba(255,255,255,0.15)",
                 borderRadius: 3, paddingHorizontal: 6, paddingVertical: 2,
                 marginBottom: 3, border: "1px solid rgba(255,255,255,0.25)" },
    sbContact: { fontSize: 8, color: "rgba(255,255,255,0.85)", marginBottom: 4 },
  });

  return (
    <Document title={`CV - ${profile.first_name} ${profile.last_name}`}
      author="Smartfolio · BAN 00329 · UTS Bucaramanga">
      <Page size="A4" style={styles.page}>

        {/* SIDEBAR */}
        <View style={styles.sidebar}>
          {profile.photo_url ? (
            <Image src={profile.photo_url} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}

          <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: "#fff", marginBottom: 2 }}>
            {profile.first_name}
          </Text>
          <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: "#fff", marginBottom: 10 }}>
            {profile.last_name}
          </Text>

          {profile.city    && <Text style={styles.sbContact}>📍 {profile.city}</Text>}
          {profile.phone   && <Text style={styles.sbContact}>📱 {profile.phone}</Text>}
          {profile.linkedin_url && <Text style={styles.sbContact}>🔗 LinkedIn</Text>}
          {profile.github_url   && <Text style={styles.sbContact}>💻 GitHub</Text>}

          {allSkills.length > 0 && (
            <>
              <Text style={styles.sbLabel}>Habilidades</Text>
              {allSkills.slice(0, 12).map((s) => (
                <Text key={s.id} style={styles.sbItem}>{s.name}</Text>
              ))}
            </>
          )}
        </View>

        {/* CONTENIDO */}
        <View style={styles.content}>
          <Text style={styles.name}>{profile.first_name} {profile.last_name}</Text>
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
          <Text style={styles.email}>✉ contacto@smartfolio.co</Text>

          {sections.map((section) => (
            <View key={section.type}>
              <Text style={styles.secTitle}>{section.label}</Text>
              {section.records.map((r) => (
                <View key={r.id} style={styles.recordRow}>
                  <Text style={styles.year}>
                    {r.end_date ? formatDate(r.end_date, "yyyy") : formatDate(r.start_date, "yyyy")}
                  </Text>
                  <View style={styles.recInfo}>
                    <Text style={styles.recTitle}>{r.title}</Text>
                    <Text style={styles.recSub}>
                      {r.institution}{r.duration_hours ? ` · ${r.duration_hours}h` : ""}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>

      </Page>
    </Document>
  );
}