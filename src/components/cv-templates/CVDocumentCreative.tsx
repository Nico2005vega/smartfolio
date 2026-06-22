import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/types";

interface Props { data: CVData; }

export default function CVDocumentCreative({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const accent = config?.accent_color ?? "#7c3aed";

  const s = StyleSheet.create({
    page:       { fontFamily:"Helvetica", fontSize:9, color:"#374151" },
    header:     { backgroundColor:accent, padding:"22 28", flexDirection:"row", alignItems:"center", gap:14 },
    avatar:     { width:54, height:54, borderRadius:8, border:"2 solid rgba(255,255,255,0.4)" },
    avPlaceh:   { width:54, height:54, borderRadius:8, backgroundColor:"rgba(255,255,255,0.2)" },
    hName:      { fontSize:17, fontFamily:"Helvetica-Bold", color:"white", marginBottom:4 },
    hContact:   { flexDirection:"row", flexWrap:"wrap", gap:8, fontSize:7.5, color:"rgba(255,255,255,0.9)" },
    hBio:       { fontSize:7.5, color:"rgba(255,255,255,0.88)", lineHeight:1.5, marginTop:4 },
    body:       { flexDirection:"row", flex:1 },
    main:       { flex:1, padding:"18 24" },
    sbr:        { width:148, backgroundColor:"#f8fafc", borderLeft:"1 solid #e2e8f0", padding:"18 13" },
    sbTitle:    { fontSize:6.5, fontFamily:"Helvetica-Bold", textTransform:"uppercase", letterSpacing:1, color:"#94a3b8", marginBottom:10 },
    sbCat:      { fontSize:6.5, fontFamily:"Helvetica-Bold", textTransform:"uppercase", letterSpacing:0.5, color:accent, marginBottom:4, marginTop:9 },
    skillChip:  { fontSize:7.5, color:accent, borderRadius:4, paddingHorizontal:5, paddingVertical:1, marginBottom:3, marginRight:3, border:`1 solid ${accent}55`, backgroundColor:`${accent}18` },
    chipRow:    { flexDirection:"row", flexWrap:"wrap", gap:3 },
    secWrap:    { marginBottom:12 },
    secRow:     { flexDirection:"row", alignItems:"center", gap:6, marginBottom:7 },
    accentBar:  { width:3, height:12, backgroundColor:accent, borderRadius:2 },
    secLabel:   { fontSize:7.5, fontFamily:"Helvetica-Bold", textTransform:"uppercase", letterSpacing:1.5, color:accent },
    card:       { backgroundColor:"#f9fafb", borderRadius:5, borderLeft:`3 solid ${accent}55`, padding:"7 10", marginBottom:5 },
    cardTop:    { flexDirection:"row", justifyContent:"space-between", alignItems:"flex-start", gap:6 },
    cardTitle:  { fontFamily:"Helvetica-Bold", fontSize:9, color:"#111827", flex:1 },
    badge:      { backgroundColor:accent, borderRadius:10, paddingHorizontal:5, paddingVertical:1 },
    badgeTxt:   { fontSize:7, color:"white" },
    cardSub:    { fontSize:7.5, color:"#6b7280", marginTop:2 },
    cardDesc:   { fontSize:7, color:"#9ca3af", marginTop:2, lineHeight:1.4 },
  });

  return (
    <Document title={`CV Creativo — ${profile.first_name} ${profile.last_name}`} author="Smartfolio · BAN 00329">
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          {profile.photo_url
            ? <Image src={profile.photo_url} style={s.avatar} />
            : <View style={s.avPlaceh} />
          }
          <View style={{ flex:1 }}>
            <Text style={s.hName}>{profile.first_name} {profile.last_name}</Text>
            <View style={s.hContact}>
              {profile.city         && <Text>📍 {profile.city}</Text>}
              {profile.phone        && <Text>📱 {profile.phone}</Text>}
              {profile.linkedin_url && <Text>🔗 LinkedIn</Text>}
              {profile.github_url   && <Text>💻 GitHub</Text>}
            </View>
            {profile.bio && <Text style={s.hBio}>{profile.bio}</Text>}
          </View>
        </View>

        {/* Body */}
        <View style={s.body}>

          {/* Main sections */}
          <View style={s.main}>
            {sections.map((section) => (
              <View key={section.type} style={s.secWrap}>
                <View style={s.secRow}>
                  <View style={s.accentBar} />
                  <Text style={s.secLabel}>{section.label}</Text>
                </View>
                {section.records.map((r) => (
                  <View key={r.id} style={s.card}>
                    <View style={s.cardTop}>
                      <Text style={s.cardTitle}>{r.title}</Text>
                      <View style={s.badge}>
                        <Text style={s.badgeTxt}>
                          {r.end_date ? formatDate(r.end_date,"yyyy") : formatDate(r.start_date,"yyyy")}
                        </Text>
                      </View>
                    </View>
                    <Text style={s.cardSub}>{r.institution}{r.duration_hours ? ` · ${r.duration_hours}h` : ""}</Text>
                    {r.description && <Text style={s.cardDesc}>{r.description}</Text>}
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Skills sidebar */}
          <View style={s.sbr}>
            <Text style={s.sbTitle}>Habilidades</Text>
            {Object.entries(skills).map(([cat, list]) => list.length > 0 && (
              <View key={cat}>
                <Text style={s.sbCat}>
                  {SKILL_CATEGORY_LABELS[cat as keyof typeof SKILL_CATEGORY_LABELS]}
                </Text>
                <View style={s.chipRow}>
                  {list.map((sk) => <Text key={sk.id} style={s.skillChip}>{sk.name}</Text>)}
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}