import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { CVData } from "@/types";
import { formatDate } from "@/lib/utils";
import { SKILL_CATEGORY_LABELS } from "@/types";

interface Props { data: CVData; }

export default function CVDocumentTech({ data }: Props) {
  const { profile, sections, skills, config } = data;
  const accent  = config?.accent_color ?? "#06b6d4";
  const darkBg  = "#0f172a";

  const s = StyleSheet.create({
    page:     { flexDirection:"row", fontFamily:"Helvetica", fontSize:9, color:"#374151" },
    sidebar:  { width:150, backgroundColor:darkBg, padding:"24 16", color:"#e2e8f0" },
    main:     { flex:1, padding:"24 22", backgroundColor:"white" },
    sbComment:{ fontSize:6.5, color:accent, letterSpacing:1.5, textTransform:"uppercase", marginBottom:7, fontFamily:"Courier" },
    avImg:    { width:52, height:52, borderRadius:7, border:`2 solid ${accent}`, marginBottom:9 },
    avPlaceh: { width:52, height:52, borderRadius:7, backgroundColor:`${accent}22`, border:`2 solid ${accent}`, marginBottom:9 },
    avInit:   { fontSize:18, fontFamily:"Helvetica-Bold", color:accent, textAlign:"center", paddingTop:12 },
    sbName:   { fontSize:12, fontFamily:"Helvetica-Bold", color:"#f8fafc", lineHeight:1.3, marginBottom:14 },
    sbContact:{ fontSize:7.5, color:"#94a3b8", marginBottom:4 },
    sbCatLbl: { fontSize:6.5, color:`${accent}bb`, textTransform:"uppercase", letterSpacing:1, marginBottom:4, marginTop:9, fontFamily:"Courier" },
    chipRow:  { flexDirection:"row", flexWrap:"wrap", gap:3 },
    chip:     { fontSize:7, color:accent, backgroundColor:`${accent}1a`, borderRadius:3, paddingHorizontal:4, paddingVertical:1, border:`1 solid ${accent}33`, fontFamily:"Courier" },
    hComment: { fontSize:6.5, color:"#94a3b8", fontFamily:"Courier", marginBottom:3 },
    hName:    { fontSize:18, fontFamily:"Helvetica-Bold", color:"#0f172a", marginBottom:3 },
    hBio:     { fontSize:8, color:"#475569", lineHeight:1.6, marginBottom:4, maxWidth:360 },
    hBar:     { borderBottomWidth:2, borderBottomColor:accent, marginBottom:14, marginTop:6 },
    secComment:{ fontSize:6.5, color:accent, textTransform:"uppercase", letterSpacing:1.5, fontFamily:"Courier", marginBottom:6, marginTop:12 },
    card:     { flexDirection:"row", alignItems:"flex-start", backgroundColor:"#f8fafc", borderRadius:4, borderLeft:`3 solid ${accent}`, padding:"7 9", marginBottom:5, gap:8 },
    cardMain: { flex:1 },
    cardTitle:{ fontFamily:"Helvetica-Bold", fontSize:9, color:"#0f172a" },
    cardSub:  { fontSize:7, color:"#64748b", marginTop:2, fontFamily:"Courier" },
    cardDesc: { fontSize:7, color:"#94a3b8", marginTop:2, lineHeight:1.4 },
    cardYear: { fontSize:7, color:accent, backgroundColor:`${accent}1a`, borderRadius:3, paddingHorizontal:5, paddingVertical:1, fontFamily:"Courier" },
  });

  return (
    <Document title={`CV Tech — ${profile.first_name} ${profile.last_name}`} author="Smartfolio · BAN 00329">
      <Page size="A4" style={s.page}>

        {/* ── Sidebar ───────────────────────────────────── */}
        <View style={s.sidebar}>
          <Text style={s.sbComment}>{"// perfil"}</Text>
          {profile.photo_url
            ? <Image src={profile.photo_url} style={s.avImg} />
            : <View style={s.avPlaceh}><Text style={s.avInit}>{profile.first_name?.[0]}{profile.last_name?.[0]}</Text></View>
          }
          <Text style={s.sbName}>{profile.first_name}{"\n"}{profile.last_name}</Text>

          <Text style={s.sbComment}>{"// contacto"}</Text>
          {profile.city         && <Text style={s.sbContact}>📍 {profile.city}</Text>}
          {profile.phone        && <Text style={s.sbContact}>📱 {profile.phone}</Text>}
          {profile.linkedin_url && <Text style={s.sbContact}>🔗 LinkedIn</Text>}
          {profile.github_url   && <Text style={s.sbContact}>💻 GitHub</Text>}

          {Object.values(skills).flat().length > 0 && (
            <View style={{ marginTop:10 }}>
              <Text style={s.sbComment}>{"// stack"}</Text>
              {Object.entries(skills).map(([cat, list]) => list.length > 0 && (
                <View key={cat}>
                  <Text style={s.sbCatLbl}>
                    {SKILL_CATEGORY_LABELS[cat as keyof typeof SKILL_CATEGORY_LABELS]}
                  </Text>
                  <View style={s.chipRow}>
                    {list.map((sk) => <Text key={sk.id} style={s.chip}>{sk.name}</Text>)}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ── Main ─────────────────────────────────────── */}
        <View style={s.main}>
          <Text style={s.hComment}>{"const developer = {"}</Text>
          <Text style={s.hName}>{profile.first_name} {profile.last_name}</Text>
          {profile.bio && <Text style={s.hBio}>{profile.bio}</Text>}
          <Text style={[s.hComment, { marginBottom:0 }]}>{"}"}</Text>
          <View style={s.hBar} />

          {sections.map((section) => (
            <View key={section.type}>
              <Text style={s.secComment}>{"// "}{section.label.toUpperCase()}</Text>
              {section.records.map((r) => (
                <View key={r.id} style={s.card}>
                  <View style={s.cardMain}>
                    <Text style={s.cardTitle}>{r.title}</Text>
                    <Text style={s.cardSub}>{r.institution}{r.duration_hours ? ` | ${r.duration_hours}h` : ""}</Text>
                    {r.description && <Text style={s.cardDesc}>{r.description}</Text>}
                  </View>
                  <Text style={s.cardYear}>
                    {r.end_date ? formatDate(r.end_date,"yyyy") : formatDate(r.start_date,"yyyy")}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}