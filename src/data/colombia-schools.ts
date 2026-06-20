// ─────────────────────────────────────────────────────────────────
//  colombia-schools.ts
//  Colegios de Colombia organizados por Departamento → Ciudad
//  Fuente: MEN / registros oficiales
// ─────────────────────────────────────────────────────────────────

// Estructura: { "Departamento": { "Ciudad": ["Colegio 1", ...] } }
export const COLOMBIA_SCHOOLS: Record<string, Record<string, string[]>> = {

  // ══════════════════════════════════════════════════════════════
  "Bogotá D.C.": {
    "Bogotá": [
      "INEM Francisco de Paula Santander",
      "INEM El Tunal",
      "Instituto Técnico Industrial Francisco José de Caldas",
      "Instituto Técnico Industrial Piloto",
      "Liceo Nacional Agustín Nieto Caballero",
      "Escuela Normal Superior Distrital María Montessori",
      "Colegio Mayor de San Bartolomé",
      "Gimnasio Moderno",
      "Colegio Los Nogales",
      "Colegio Helvetia",
      "Colegio Nueva Granada",
      "Colegio Anglo Colombiano",
      "Colegio San Carlos",
      "Instituto Pedagógico Nacional",
      "Colegio La Salle Bogotá",
      "Colegio Salesiano San Juan Bosco",
      "Colegio El Minuto de Dios",
      "Colegio Santa Francisca Romana",
      "Colegio Distrital Simón Bolívar",
      "Colegio República de Bolivia",
      "Colegio Militar Cadetes de Colombia",
      "Colegio Agustiniano Norte",
      "Colegio Agustiniano Sur",
      "Colegio San Bartolomé La Merced",
      "Colegio Champagnat Bogotá",
      "Colegio Rochester",
      "Colegio Bilingüe Ramón B. Jimeno",
      "Colegio Distrital República de Colombia",
      "Colegio Pío XII",
      "Institución Educativa Distrital La Candelaria",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Antioquia": {
    "Medellín": [
      "INEM José Félix de Restrepo",
      "Instituto Técnico Industrial",
      "Escuela Normal Superior de Medellín",
      "Colegio Salesiano El Sufragio",
      "Colegio De La Salle Medellín",
      "Colegio San Ignacio",
      "Colegio Alemán de Medellín",
      "Normal Superior María Auxiliadora",
      "Colegio Calasanz",
      "Colegio La Salle Envigado",
      "Colegio San José de la Salle",
      "Colegio Colombo Británico",
      "Colegio El Carmelo",
      "Colegio Benediktus",
      "Colegio Palermo",
      "Colegio Los Alpes Medellín",
      "Institución Educativa José Miguel de Restrepo",
      "Colegio Marco Fidel Suárez",
    ],
    "Envigado": [
      "Colegio Tomás Carrasquilla",
      "Colegio El Rosario de Envigado",
      "Institución Educativa San José",
      "Colegio Cooperativo",
    ],
    "Bello": [
      "INEM Bello",
      "Colegio San Juan de la Salle",
      "Institución Educativa Héctor Abad Gómez",
      "Colegio Adventista",
    ],
    "Rionegro": [
      "Colegio Boyacá Rionegro",
      "Instituto Técnico El Pedregal",
      "Escuela Normal Superior de Rionegro",
    ],
    "Apartadó": [
      "Colegio Agrícola de Urabá",
      "Institución Educativa El Triunfo",
      "Colegio Jorge Robledo",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Santander": {
    "Bucaramanga": [
      "INEM Custodio García Rovira",
      "Instituto Técnico Dámaso Zapata",
      "Liceo Nacional Antonia Santos",
      "Escuela Normal Superior de Bucaramanga",
      "Colegio Salesiano San Juan Bosco",
      "Colegio De La Salle Bucaramanga",
      "Colegio San Pedro Claver",
      "Colegio La Presentación Bucaramanga",
      "Colegio Bilingüe Buckingham",
      "Colegio Politécnico Santander",
      "Instituto Técnico La Cumbre",
      "Colegio Las Américas Bucaramanga",
      "Colegio Municipal Cabecera del Llano",
      "Colegio Santo Ángel",
      "Instituto Jorge Ardila Duarte",
      "Colegio Chapinero Bucaramanga",
      "Instituto Técnico Industrial Pedro A. López",
      "Colegio Champagnat Bucaramanga",
      "Colegio Agustiniano Bucaramanga",
      "Colegio Cafam Bucaramanga",
      "Instituto Nacional de Comercio",
      "Colegio Los Cedros",
      "Institución Educativa Nuestra Señora de las Mercedes",
    ],
    "Floridablanca": [
      "Instituto Empresarial Gabriela Mistral",
      "Colegio Técnico Comercial San José",
      "Colegio San Francisco de Asís Floridablanca",
      "Colegio Los Alpes Floridablanca",
      "Colegio Bello Horizonte",
      "Colegio La Presentación Floridablanca",
      "Colegio Los Comuneros Floridablanca",
      "Instituto San Carlos Floridablanca",
      "CASD Centro de Atención Satélite Floridablanca",
      "Colegio El Pablón",
      "Colegio Integrado El Carmen",
      "Colegio El Rocío de Floridablanca",
      "Instituto Técnico Municipal El Pablón",
      "Colegio Comfenalco Floridablanca",
      "Colegio Santander Floridablanca",
      "Institución Educativa Leónidas Acuña",
      "Colegio Técnico San Juan Bosco",
    ],
    "Girón": [
      "Colegio La Frontera Girón",
      "Colegio Luis Carlos Galán Sarmiento",
      "Escuela Normal Superior de Girón",
      "Colegio Técnico Agroindustrial de Girón",
      "Instituto Educativo de Girón",
      "Colegio El Carrizal",
      "Institución Educativa Villabel",
    ],
    "Piedecuesta": [
      "Instituto Técnico Municipal Francisco de Paula Santander",
      "Escuela Normal Superior de Piedecuesta",
      "Colegio Santo Tomás de Aquino Piedecuesta",
      "Colegio Los Comuneros Piedecuesta",
      "Instituto Eduardo Santos Piedecuesta",
      "Colegio La Presentación Piedecuesta",
      "Institución Educativa Gabriel García Morales",
      "Colegio Integral La Esperanza",
    ],
    "Barrancabermeja": [
      "INEM de Barrancabermeja",
      "Colegio Camilo Torres Restrepo",
      "Instituto de Promoción Social",
      "Colegio La Presentación Barrancabermeja",
      "Instituto Técnico Barrancabermeja",
      "Normal Superior de Barrancabermeja",
      "Colegio El Centro Barrancabermeja",
      "Institución Educativa San Silvestre",
      "Colegio Integrado El Uwapa",
    ],
    "San Gil": [
      "Colegio Pedro Claver San Gil",
      "Instituto Técnico San Gil",
      "Colegio Mayor San Gil",
      "Colegio La Presentación San Gil",
      "Escuela Normal Superior de San Gil",
      "Colegio Salesiano San Gil",
    ],
    "Socorro": [
      "Instituto Técnico Vicente Azuero",
      "Colegio La Presentación Socorro",
      "Escuela Normal Superior El Socorro",
      "Colegio Integrado La Aguada",
    ],
    "Vélez": [
      "Escuela Normal Superior Regional de Vélez",
      "Instituto Técnico Industrial Vélez",
      "Colegio La Presentación Vélez",
      "Institución Educativa Técnica Vélez",
    ],
    "Málaga": [
      "Colegio Guillermo Suárez Báez",
      "Instituto Técnico Agroindustrial de Málaga",
      "Normal Superior de Málaga",
    ],
    "Lebrija": [
      "Colegio Técnico Industrial Lebrija",
      "Institución Educativa Las Acacias",
    ],
    "Zapatoca": [
      "Colegio Agropecuario de Zapatoca",
      "Institución Educativa Técnica",
    ],
    "Rionegro": [
      "Colegio Integrado de Rionegro Santander",
      "Institución Educativa Juan Atalaya",
    ],
    "Sabana de Torres": [
      "Institución Educativa Técnica Sabana de Torres",
      "Colegio San Juan Bosco de Sabana de Torres",
    ],
    "Barbosa": [
      "Colegio Integrado de Barbosa",
      "Instituto Técnico Barbosa Santander",
    ],
    "Puerto Wilches": [
      "Institución Educativa Luis Carlos Galán Sarmiento Puerto Wilches",
    ],
    "San Vicente de Chucurí": [
      "Colegio Agrícola de Chucurí",
      "Institución Educativa Técnica San Vicente",
    ],
    "Charalá": [
      "Institución Educativa Técnica de Charalá",
      "Escuela Normal Superior de Charalá",
    ],
    "Barichara": [
      "Colegio Integrado La Presentación de Barichara",
    ],
    "Los Santos": [
      "Institución Educativa Técnica Los Santos",
    ],
    "Curití": [
      "Institución Educativa Técnica de Curití",
    ],
    "Mogotes": [
      "Institución Educativa Técnica de Mogotes",
    ],
    "Onzaga": [
      "Institución Educativa Técnica de Onzaga",
    ],
    "San Andrés": [
      "Institución Educativa San Andrés Santander",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Valle del Cauca": {
    "Cali": [
      "INEM Jorge Isaacs",
      "Instituto Técnico Antonio José Camacho",
      "Escuela Normal Superior Farallones de Cali",
      "Colegio Santa Librada",
      "Liceo Departamental",
      "Colegio Berchmans",
      "Colegio San Juan Bosco Cali",
      "Colegio La Presentación Cali",
      "Colegio Colombo Británico",
      "Colegio Alemán de Cali",
      "Colegio Bolívar Cali",
      "Instituto Champagnat Cali",
      "Colegio La Salle Cali",
      "Colegio Palmas Cali",
    ],
    "Palmira": [
      "INEM Jorge Isaacs Palmira",
      "Instituto Técnico Industrial Palmira",
      "Escuela Normal Superior Pedro Antonio Molina",
      "Colegio La Presentación Palmira",
    ],
    "Buenaventura": [
      "INEM Simón Bolívar Buenaventura",
      "Colegio Multipropósito",
      "Instituto Técnico Distrital Buenaventura",
    ],
    "Tuluá": [
      "INEM Jorge Isaacs Tuluá",
      "Institución Educativa La Inmaculada",
      "Colegio Técnico Tuluá",
    ],
    "Buga": [
      "Colegio Academia Militar de Buga",
      "Colegio La Inmaculada Buga",
      "Instituto Técnico de Buga",
    ],
    "Cartago": [
      "Colegio Lorencita Villegas de Santos",
      "Instituto Técnico Cartago",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Atlántico": {
    "Barranquilla": [
      "INEM de Barranquilla",
      "Instituto Técnico Distrital",
      "Escuela Normal Superior La Hacienda",
      "Colegio Karl Parrish",
      "Instituto Colombo Venezolano",
      "Colegio Biffi La Salle",
      "Colegio San José de Barranquilla",
      "Instituto Salesiano",
      "Colegio La Salle Barranquilla",
      "Colegio Americano Barranquilla",
      "Colegio Santo Tomás de Aquino",
    ],
    "Soledad": [
      "Institución Educativa Técnica de Soledad",
      "Colegio Juan Acosta Soledad",
    ],
    "Malambo": [
      "Institución Educativa Técnica de Malambo",
    ],
    "Sabanalarga": [
      "Normal Superior de Sabanalarga",
      "Instituto Técnico Sabanalarga",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Bolívar": {
    "Cartagena": [
      "INEM de Cartagena",
      "Normal Superior de Cartagena",
      "Colegio La Salle Cartagena",
      "Colegio Biffi Cartagena",
      "Instituto Técnico de Cartagena",
      "Colegio Liceo de Bolívar",
      "Institución Educativa Pedro de Heredia",
    ],
    "Magangué": [
      "INEM de Magangué",
      "Normal Superior de Magangué",
      "Instituto Técnico Magangué",
    ],
    "El Carmen de Bolívar": [
      "INEM de El Carmen de Bolívar",
      "Normal Superior El Carmen",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Boyacá": {
    "Tunja": [
      "INEM Carlos Arturo Torres Tunja",
      "Instituto Técnico Industrial de Tunja",
      "Escuela Normal Superior Santiago de Tunja",
      "Colegio de Boyacá",
      "Colegio La Presentación Tunja",
      "Colegio Salesiano Juan de Dios Arias",
    ],
    "Duitama": [
      "INEM de Duitama",
      "Normal Superior de Duitama",
      "Colegio Silvino Rodríguez",
    ],
    "Sogamoso": [
      "INEM de Sogamoso",
      "Normal Superior de Sogamoso",
      "Colegio Sugamuxi",
    ],
    "Chiquinquirá": [
      "INEM de Chiquinquirá",
      "Normal Superior de Chiquinquirá",
      "Colegio La Salle Chiquinquirá",
    ],
    "Villa de Leyva": [
      "Institución Educativa Técnica Villa de Leyva",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Caldas": {
    "Manizales": [
      "INEM José Celestino Mutis",
      "Escuela Normal Superior de Manizales",
      "Instituto Técnico Nacional de Comercio",
      "Colegio Santa Isabel Manizales",
      "Colegio La Salle Manizales",
      "Colegio San Luis Gonzaga",
      "Colegio Salesiano de Manizales",
    ],
    "La Dorada": [
      "INEM de La Dorada",
      "Institución Educativa Técnica La Dorada",
    ],
    "Chinchiná": [
      "Institución Educativa Técnica Chinchiná",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Risaralda": {
    "Pereira": [
      "INEM Felipe Pérez",
      "Escuela Normal Superior El Jardín",
      "Instituto Técnico Superior",
      "Colegio La Salle Pereira",
      "Colegio Salesiano Pereira",
      "Colegio Deogracias Cardona",
      "Colegio Cooperativo de Pereira",
      "Colegio Ciudad de Cartago",
    ],
    "Dosquebradas": [
      "Instituto Técnico de Dosquebradas",
      "Institución Educativa Las Américas",
    ],
    "Santa Rosa de Cabal": [
      "Normal Superior de Santa Rosa de Cabal",
      "Instituto Técnico Santa Rosa",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Quindío": {
    "Armenia": [
      "INEM Gabriel García Márquez",
      "Escuela Normal Superior de Armenia",
      "Instituto Técnico Superior de Armenia",
      "Colegio La Salle Armenia",
      "Colegio Academico de Armenia",
    ],
    "Calarcá": [
      "Instituto Técnico Industrial de Calarcá",
      "Normal Superior de Calarcá",
    ],
    "Montenegro": [
      "Colegio Integrado de Montenegro",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Norte de Santander": {
    "Cúcuta": [
      "INEM Luis Delfín Insuasty Rodríguez",
      "Normal Superior de Cúcuta",
      "Instituto Técnico Lucio Pabón Núñez",
      "Colegio La Salle Cúcuta",
      "Colegio Salesiano Cúcuta",
      "Colegio La Presentación Cúcuta",
      "Colegio Sagrado Corazón de Jesús",
      "Institución Educativa Nacional Antonio Nariño",
    ],
    "Pamplona": [
      "Normal Superior Regional de Pamplona",
      "Colegio La Presentación Pamplona",
      "Instituto Técnico Pamplona",
    ],
    "Ocaña": [
      "INEM Francisco de Paula Santander Ocaña",
      "Normal Superior de Ocaña",
      "Instituto Técnico Ocaña",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Tolima": {
    "Ibagué": [
      "INEM Manuel Murillo Toro",
      "Normal Superior de Ibagué",
      "Instituto Técnico Industrial Ibagué",
      "Colegio La Presentación Ibagué",
      "Colegio San Simón",
      "Colegio Champagnat Ibagué",
      "Colegio La Salle Ibagué",
    ],
    "Espinal": [
      "INEM de Espinal",
      "Instituto Técnico El Espinal",
    ],
    "Honda": [
      "Colegio Integrado de Honda",
      "Normal Superior de Honda",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Huila": {
    "Neiva": [
      "INEM Julián Motta Salas",
      "Normal Superior de Neiva",
      "Instituto Técnico Industrial Neiva",
      "Colegio La Presentación Neiva",
      "Colegio San Francisco de Asís Neiva",
      "Institución Educativa La Gaitana",
    ],
    "Pitalito": [
      "Colegio Integrado de Pitalito",
      "Normal Superior de Pitalito",
    ],
    "Garzón": [
      "INEM Garzón",
      "Normal Superior de Garzón",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Nariño": {
    "Pasto": [
      "INEM Ciudad de Pasto",
      "Liceo de Nariño",
      "Normal Superior de Pasto",
      "Instituto Técnico Industrial de Pasto",
      "Colegio La Presentación Pasto",
      "Colegio San Francisco de Asís Pasto",
      "Instituto Champagnat Pasto",
    ],
    "Tumaco": [
      "Normal Superior La Inmaculada de Tumaco",
      "Instituto Técnico de Tumaco",
    ],
    "Ipiales": [
      "Normal Superior de Ipiales",
      "Instituto Técnico Ipiales",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Meta": {
    "Villavicencio": [
      "INEM Hugo J. Bermúdez",
      "Normal Superior de Villavicencio",
      "Colegio La Presentación Villavicencio",
      "Instituto Técnico Industrial Villavicencio",
      "Colegio La Salle Villavicencio",
      "Colegio Champagnat Villavicencio",
      "Colegio San Luis Gonzaga Villavicencio",
    ],
    "Acacías": [
      "Colegio Integrado de Acacías",
    ],
    "Granada": [
      "Colegio Integrado de Granada Meta",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Cauca": {
    "Popayán": [
      "INEM de Popayán",
      "Normal Superior de Popayán",
      "Instituto Técnico Industrial Popayán",
      "Colegio Champagnat Popayán",
      "Colegio La Salle Popayán",
      "Colegio La Presentación Popayán",
    ],
    "Santander de Quilichao": [
      "Colegio Técnico de Quilichao",
      "Institución Educativa Normal Superior",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Córdoba": {
    "Montería": [
      "INEM Lorenzo Alcantuz Henao",
      "Normal Superior de Montería",
      "Instituto Técnico Industrial Montería",
      "Colegio La Presentación Montería",
      "Colegio San José Montería",
    ],
    "Tierralta": [
      "Normal Superior de Tierralta",
    ],
    "Sahagún": [
      "Normal Superior de Sahagún",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Cesar": {
    "Valledupar": [
      "INEM José Eugenio Martínez",
      "Normal Superior de Valledupar",
      "Instituto Técnico Industrial Valledupar",
      "Colegio La Presentación Valledupar",
      "Colegio Alfonso López Pumarejo",
    ],
    "Aguachica": [
      "Colegio Integrado de Aguachica",
      "Normal Superior de Aguachica",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Magdalena": {
    "Santa Marta": [
      "INEM Simón Bolívar Santa Marta",
      "Normal Superior de Santa Marta",
      "Instituto Técnico Industrial Santa Marta",
      "Colegio La Presentación Santa Marta",
      "Colegio Liceo Celedón",
    ],
    "Ciénaga": [
      "Colegio Integrado de Ciénaga",
    ],
    "Fundación": [
      "Normal Superior de Fundación",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "La Guajira": {
    "Riohacha": [
      "Normal Superior de Riohacha",
      "Instituto Técnico Industrial Riohacha",
      "Institución Educativa Divina Pastora",
    ],
    "Maicao": [
      "Normal Superior de Maicao",
      "Institución Educativa Técnica Maicao",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Sucre": {
    "Sincelejo": [
      "Normal Superior de Sincelejo",
      "Instituto Técnico Industrial Sincelejo",
      "Colegio La Presentación Sincelejo",
      "Institución Educativa Camilo Torres Sincelejo",
    ],
    "Corozal": [
      "Normal Superior de Corozal",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Chocó": {
    "Quibdó": [
      "Normal Superior Manuel Cañizales",
      "Instituto Técnico Industrial Quibdó",
      "Colegio Integrado de Quibdó",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Caquetá": {
    "Florencia": [
      "Normal Superior de Florencia",
      "Instituto Técnico Industrial Florencia",
      "Colegio La Presentación Florencia",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Arauca": {
    "Arauca": [
      "Normal Superior de Arauca",
      "Instituto Técnico Industrial Arauca",
      "Institución Educativa Técnica Arauca",
    ],
    "Saravena": [
      "Institución Educativa Técnica de Saravena",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Casanare": {
    "Yopal": [
      "Normal Superior de Yopal",
      "Instituto Técnico Industrial Yopal",
      "Colegio Integrado de Yopal",
    ],
    "Aguazul": [
      "Institución Educativa Técnica Aguazul",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Putumayo": {
    "Mocoa": [
      "Normal Superior de Mocoa",
      "Instituto Técnico Industrial Mocoa",
    ],
    "Puerto Asís": [
      "Colegio Integrado de Puerto Asís",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "Amazonas": {
    "Leticia": [
      "Normal Superior de Leticia",
      "Instituto Técnico Industrial Leticia",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  "San Andrés y Providencia": {
    "San Andrés": [
      "Normal Superior de San Andrés",
      "Colegio Técnico de San Andrés",
      "Colegio Bautista de San Andrés",
    ],
  },
};

/** Obtener colegios de un departamento y ciudad */
export function getSchools(department: string, city: string): string[] {
  return COLOMBIA_SCHOOLS[department]?.[city] ?? [];
}

/** Buscar colegios por texto en todos los departamentos/ciudades */
export function searchSchools(
  query: string,
  department?: string,
  city?: string,
  limit = 30
): Array<{ name: string; city: string; department: string }> {
  const normalize = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const q = normalize(query.trim());

  const results: Array<{ name: string; city: string; department: string }> = [];

  const depts = department ? [department] : Object.keys(COLOMBIA_SCHOOLS);

  for (const dept of depts) {
    const deptData = COLOMBIA_SCHOOLS[dept];
    if (!deptData) continue;

    const cities = city ? [city] : Object.keys(deptData);

    for (const c of cities) {
      const schools = deptData[c] ?? [];
      for (const school of schools) {
        if (!q || normalize(school).includes(q)) {
          results.push({ name: school, city: c, department: dept });
          if (results.length >= limit) return results;
        }
      }
    }
  }

  return results;
}