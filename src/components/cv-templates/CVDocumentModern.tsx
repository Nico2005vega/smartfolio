import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import type { CVData, CVStyleConfig, AcademicRecord, Skill } from "@/types";
import { formatDate } from "@/lib/utils";
import { registerPdfFonts, resolvePdfFont } from "@/lib/pdfFonts";

registerPdfFonts();

interface Props { data: CVData; watermark?: boolean; }

function getCfg(c: CVStyleConfig | undefined) {
  const family = resolvePdfFont(c?.font_name);
  return {
    accent:    String(c?.accent_color ?? "#059669"),
    fontR:     family.regular,
    fontB:     family.bold,
    px:        Number(c?.font_size ?? 13) * 0.72,
    lh:        Number(c?.line_height ?? 1.4),
    photoR:    c?.photo_shape === "square" ? 4 : c?.photo_shape === "rounded" ? 14 : 31,
    secStyle:  (c?.section_style ?? "underline") as string,
    skillsSt:  (c?.skills_style  ?? "chips")     as string,
    cardSt:    (c?.card_style    ?? "flat")      as string,
    showPhoto: c?.show_photo !== false,
    showIcons: c?.show_icons !== false,
    upper:     c?.uppercase  === true,
  };
}
type Cfg = ReturnType<typeof getCfg>;

/* Section header — 4 variantes, igual que en el CV Builder */
// Nota: nunca combinamos section.icon (emoji) con texto en negrita+mayúsculas.
// Las fuentes estándar de react-pdf (Helvetica/Times/Courier) no tienen esos
// glifos, y colocarlos junto a texto en uppercase corrompe visualmente lo que
// sigue. Los otros 5 templates de Smartfolio ya evitan esto mismo; aquí
// seguimos la misma convención por consistencia.
function SecHead({ label, cfg }: { label: string; cfg: Cfg }) {
  const { secStyle, px, accent, fontB } = cfg;
  const base = { fontSize: px - 1, fontFamily: fontB, textTransform: "uppercase" as const, letterSpacing: 1.2 };

  if (secStyle === "left-bar") return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
      <View style={{ width: 3, height: 12, backgroundColor: accent, borderRadius: 1.5 }} />
      <Text style={{ ...base, color: accent }}>{label}</Text>
    </View>
  );
  if (secStyle === "filled") return (
    <View style={{ backgroundColor: `${accent}22`, paddingVertical: 3, paddingHorizontal: 7, borderRadius: 4, marginBottom: 8, alignSelf: "flex-start" }}>
      <Text style={{ ...base, color: accent }}>{label}</Text>
    </View>
  );
  if (secStyle === "minimal") return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ ...base, fontSize: px - 2, letterSpacing: 1.8, color: "#9ca3af" }}>{label}</Text>
    </View>
  );
  return (
    <View style={{ borderBottomWidth: 1.2, borderBottomColor: accent, paddingBottom: 3, marginBottom: 8 }}>
      <Text style={{ ...base, color: accent }}>{label}</Text>
    </View>
  );
}

/* Tarjeta de registro — 4 variantes */
function Card({ r, cfg }: { r: AcademicRecord; cfg: Cfg }) {
  const { fontR, fontB, cardSt, accent, px, lh } = cfg;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variants: Record<string, any> = {
    flat:     { flexDirection: "row", gap: 8, marginBottom: 5, borderRadius: 6, padding: 5 },
    shadow:   { flexDirection: "row", gap: 8, marginBottom: 5, borderRadius: 6, padding: 5, backgroundColor: "#fafafa" },
    bordered: { flexDirection: "row", gap: 8, marginBottom: 5, borderRadius: 6, padding: 5, borderWidth: 0.75, borderColor: "#e5e7eb" },
    accent:   { flexDirection: "row", gap: 8, marginBottom: 5, borderRadius: 4, padding: 5, paddingLeft: 8, backgroundColor: `${accent}10`, borderLeftWidth: 2.5, borderLeftColor: accent },
  };
  return (
    <View style={variants[cardSt] ?? variants.flat}>
      <View style={{ width: 34, flexShrink: 0 }}>
        <Text style={{ fontSize: px - 3, color: "#9ca3af", textAlign: "right" }}>
          {r.end_date ? formatDate(r.end_date, "yyyy") : formatDate(r.start_date, "yyyy")}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: px, fontFamily: fontB, color: "#111827", lineHeight: lh }}>{r.title}</Text>
        <Text style={{ fontSize: px - 2, color: "#6b7280", marginTop: 1.5, fontFamily: fontR }}>
          {r.institution}{r.duration_hours ? ` · ${r.duration_hours}h` : ""}
        </Text>
        {r.description ? (
          <Text style={{ fontSize: px - 3, color: "#9ca3af", marginTop: 2, lineHeight: 1.4, fontFamily: fontR }}>{r.description}</Text>
        ) : null}
      </View>
    </View>
  );
}

/* Habilidades en el sidebar — 4 variantes */
function SidebarSkills({ allSkills, cfg }: { allSkills: Skill[]; cfg: Cfg }) {
  const { skillsSt, px, fontR } = cfg;
  if (allSkills.length === 0) return null;

  if (skillsSt === "dots") return (
    <View style={{ flexDirection: "column", gap: 3 }}>
      {allSkills.slice(0, 14).map(s => (
        <View key={s.id} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: "rgba(255,255,255,0.55)" }} />
          <Text style={{ fontSize: px - 2, color: "rgba(255,255,255,0.9)", fontFamily: fontR }}>{s.name}</Text>
        </View>
      ))}
    </View>
  );
  if (skillsSt === "bars") return (
    <View style={{ flexDirection: "column", gap: 6 }}>
      {allSkills.slice(0, 8).map((s, i) => {
        const pct = [90, 75, 85, 70, 80, 65, 88, 72][i % 8];
        return (
          <View key={s.id}>
            <Text style={{ fontSize: px - 3, color: "rgba(255,255,255,0.8)", marginBottom: 2, fontFamily: fontR }}>{s.name}</Text>
            <View style={{ height: 2.5, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 1.5 }}>
              <View style={{ height: 2.5, width: `${pct}%`, backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 1.5 }} />
            </View>
          </View>
        );
      })}
    </View>
  );
  if (skillsSt === "text") return (
    <Text style={{ fontSize: px - 2, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, fontFamily: fontR }}>
      {allSkills.map(s => s.name).join("  ·  ")}
    </Text>
  );
  return (
    <View style={{ flexDirection: "column", gap: 3 }}>
      {allSkills.slice(0, 12).map(s => (
        <View key={s.id} style={{ backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 0.75, borderColor: "rgba(255,255,255,0.25)", borderRadius: 3, paddingVertical: 2.5, paddingHorizontal: 6, alignSelf: "flex-start" }}>
          <Text style={{ fontSize: px - 2, color: "white", fontFamily: fontR }}>{s.name}</Text>
        </View>
      ))}
    </View>
  );
}

export default function CVDocumentModern({ data, watermark }: Props) {
  const { profile, sections, skills, config } = data;
  const cfg = getCfg(config);
  const { accent, fontR, fontB, px, lh, photoR, showPhoto } = cfg;
  const allSkills = Object.values(skills).flat();
  const name = cfg.upper
    ? `${profile.first_name} ${profile.last_name}`.toUpperCase()
    : `${profile.first_name} ${profile.last_name}`;

  return (
    <Document title={`CV Moderno - ${profile.first_name} ${profile.last_name}`}
      author="Smartfolio · BAN 00329 · UTS Bucaramanga">
      <Page size="A4" style={{ flexDirection: "row", fontFamily: fontR, fontSize: px, color: "#1f2937" }}>

        {watermark && (
          <Text style={{
            position: "absolute", top: "48%", left: 0, right: 0,
            textAlign: "center", fontSize: 58, color: "#00000014",
            fontFamily: "Helvetica-Bold", transform: "rotate(-35deg)",
          }}>
            SMARTFOLIO · PLAN GRATUITO
          </Text>
        )}

        {/* Sidebar */}
        <View style={{ width: 160, backgroundColor: accent, padding: 18 }}>
          {showPhoto && (
            profile.photo_url ? (
              <Image src={profile.photo_url} style={{ width: 62, height: 62, borderRadius: photoR, marginBottom: 12 }} />
            ) : (
              <View style={{ width: 62, height: 62, borderRadius: photoR, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Text style={{ fontSize: 20, fontFamily: fontB, color: "white" }}>
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </Text>
              </View>
            )
          )}

          <Text style={{ fontSize: px + 1, fontFamily: fontB, color: "white", marginBottom: 10, lineHeight: 1.2 }}>
            {name}
          </Text>

          <View style={{ marginBottom: 14, gap: 5 }}>
            {profile.city         ? <Text style={{ fontSize: px - 2, color: "rgba(255,255,255,0.9)" }}>📍 {profile.city}{profile.country ? `, ${profile.country}` : ""}</Text> : null}
            {profile.phone        ? <Text style={{ fontSize: px - 2, color: "rgba(255,255,255,0.9)" }}>📱 {profile.phone}</Text> : null}
            {profile.linkedin_url ? <Text style={{ fontSize: px - 2, color: "rgba(255,255,255,0.9)" }}>🔗 LinkedIn</Text> : null}
            {profile.github_url   ? <Text style={{ fontSize: px - 2, color: "rgba(255,255,255,0.9)" }}>💻 GitHub</Text> : null}
            {profile.website_url  ? <Text style={{ fontSize: px - 2, color: "rgba(255,255,255,0.9)" }}>🌐 Portafolio</Text> : null}
          </View>

          {allSkills.length > 0 && (
            <View>
              <Text style={{ fontSize: px - 4, fontFamily: fontB, textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>
                Habilidades
              </Text>
              <SidebarSkills allSkills={allSkills} cfg={cfg} />
            </View>
          )}
        </View>

        {/* Contenido principal */}
        <View style={{ flex: 1, padding: 18 }}>
          {!showPhoto && (
            <Text style={{ fontSize: px + 7, fontFamily: fontB, color: accent, marginBottom: 5 }}>{name}</Text>
          )}
          {profile.bio ? (
            <Text style={{ fontSize: px - 1, color: "#4b5563", lineHeight: lh, marginBottom: 10, fontFamily: fontR }}>{profile.bio}</Text>
          ) : null}

          <View style={{ flexDirection: "column", gap: 12 }}>
            {sections.map(section => (
              <View key={section.type}>
                <SecHead label={section.label} cfg={cfg} />
                {section.records.map(r => <Card key={r.id} r={r} cfg={cfg} />)}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}