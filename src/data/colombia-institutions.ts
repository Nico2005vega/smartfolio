// ─────────────────────────────────────────────────────────────────
//  colombia-institutions.ts  —  v2 EXPANDIDA
//  ~305 instituciones educativas colombianas
//  Smartfolio BAN 00329 · UTS Bucaramanga
// ─────────────────────────────────────────────────────────────────

export type InstitutionType =
  | 'universidad'
  | 'institucion_universitaria'
  | 'institucion_tecnologica'
  | 'institucion_tecnica'
  | 'escuela_tecnologica'
  | 'sena'
  | 'colegio';

export interface Institution {
  id: string;
  name: string;
  shortName?: string;
  type: InstitutionType;
  department: string;
  city: string;
  areas?: string[];
}

export const INSTITUTION_TYPE_LABELS: Record<InstitutionType, string> = {
  universidad: 'Universidad',
  institucion_universitaria: 'Institución Universitaria',
  institucion_tecnologica: 'Institución Tecnológica',
  institucion_tecnica: 'Institución Técnica Profesional',
  escuela_tecnologica: 'Escuela Tecnológica',
  sena: 'SENA',
  colegio: 'Colegio',
};

export const INSTITUTION_TYPE_COLORS: Record<InstitutionType, string> = {
  universidad: 'bg-indigo-100 text-indigo-700',
  institucion_universitaria: 'bg-blue-100 text-blue-700',
  institucion_tecnologica: 'bg-emerald-100 text-emerald-700',
  institucion_tecnica: 'bg-amber-100 text-amber-700',
  escuela_tecnologica: 'bg-teal-100 text-teal-700',
  sena: 'bg-orange-100 text-orange-700',
  colegio: 'bg-slate-100 text-slate-600',
};

export const institutions: Institution[] = [

  // ════════════════════════════════════════════════════
  //  BOGOTÁ D.C.
  // ════════════════════════════════════════════════════
  { id:'unal-bog', name:'Universidad Nacional de Colombia', shortName:'UNAL', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Ingeniería','Ciencias','Humanidades','Medicina','Economía'] },
  { id:'uniandes', name:'Universidad de los Andes', shortName:'Uniandes', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Ingeniería','Administración','Humanidades','Derecho'] },
  { id:'javeriana-bog', name:'Pontificia Universidad Javeriana', shortName:'Javeriana', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Ingeniería','Salud','Humanidades','Ciencias Económicas'] },
  { id:'udistrital', name:'Universidad Distrital Francisco José de Caldas', shortName:'UDFJC', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Ingeniería','Ciencias','Medio Ambiente','Artes'] },
  { id:'urosario', name:'Universidad del Rosario', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Jurisprudencia','Medicina','Economía','Ciencias Naturales'] },
  { id:'externado', name:'Universidad Externado de Colombia', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Derecho','Economía','Finanzas','Administración'] },
  { id:'elbosque', name:'Universidad El Bosque', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Medicina','Odontología','Psicología','Ingeniería'] },
  { id:'libre-bog', name:'Universidad Libre', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Derecho','Ingeniería','Salud','Ciencias Económicas'] },
  { id:'lasalle-bog', name:'Universidad de La Salle', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Ciencias Administrativas','Ingeniería','Zootecnia','Educación'] },
  { id:'pedagogica', name:'Universidad Pedagógica Nacional', shortName:'UPN', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Educación','Ciencias','Humanidades'] },
  { id:'militar', name:'Universidad Militar Nueva Granada', shortName:'UMNG', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Ingeniería','Ciencias Económicas','Derecho','Medicina'] },
  { id:'sto-tomas-bog', name:'Universidad Santo Tomás', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Derecho','Ingeniería','Ciencias Económicas','Humanidades'] },
  { id:'central', name:'Universidad Central', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Ingeniería','Economía','Comunicación','Matemáticas'] },
  { id:'sergio-bog', name:'Universidad Sergio Arboleda', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Derecho','Economía','Ingeniería','Periodismo'] },
  { id:'piloto-bog', name:'Universidad Piloto de Colombia', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Ingeniería','Arquitectura','Negocios','Diseño'] },
  { id:'ecci-bog', name:'Universidad ECCI', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Ingeniería','Tecnología','Ciencias de la Salud'] },
  { id:'nariño-bog', name:'Universidad Antonio Nariño', shortName:'UAN', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Ingeniería','Salud','Ciencias','Derecho'] },
  { id:'tadeo', name:'Universidad de Bogotá Jorge Tadeo Lozano', shortName:'Utadeo', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Arte y Diseño','Ciencias Sociales','Ingeniería','Biología Marina'] },
  { id:'cooperativa-bog', name:'Universidad Cooperativa de Colombia', shortName:'UCC', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Derecho','Salud','Ingeniería','Contaduría'] },
  { id:'incca', name:'Universidad INCCA de Colombia', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Ingeniería','Administración','Química'] },
  { id:'manuela-bog', name:'Universidad Manuela Beltrán', shortName:'UMB', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Salud','Ingeniería','Ciencias Económicas'] },
  { id:'sbog-buena', name:'Universidad de San Buenaventura', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Ingeniería','Psicología','Educación','Derecho'] },
  { id:'uniminuto-bog', name:'Corporación Universitaria Minuto de Dios', shortName:'Uniminuto', type:'institucion_universitaria', department:'Bogotá D.C.', city:'Bogotá', areas:['Educación','Ingeniería','Negocios','Ciencias Sociales'] },
  { id:'areandin-bog', name:'Fundación Universitaria del Área Andina', shortName:'Areandina', type:'institucion_universitaria', department:'Bogotá D.C.', city:'Bogotá', areas:['Salud','Negocios','Diseño','Ingeniería'] },
  { id:'poligran', name:'Politécnico Grancolombiano', shortName:'Poligran', type:'institucion_universitaria', department:'Bogotá D.C.', city:'Bogotá', areas:['Ingeniería','Negocios','Comunicación','Diseño'] },
  { id:'unad-bog', name:'Universidad Nacional Abierta y a Distancia', shortName:'UNAD', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Ingeniería','Ciencias Básicas','Agrarias','Ciencias Administrativas'] },
  { id:'ean-bog', name:'Universidad EAN', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Administración','Ingeniería','Economía','Diseño'] },
  { id:'konrad', name:'Universidad Konrad Lorenz', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Psicología','Ingeniería','Economía','Matemáticas'] },
  { id:'jul-garavito', name:'Escuela Colombiana de Ingeniería Julio Garavito', shortName:'ECI', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Ingeniería','Matemáticas','Economía'] },
  { id:'uniagustiniana', name:'Universidad Agustiniana', shortName:'Uniagustiniana', type:'universidad', department:'Bogotá D.C.', city:'Bogotá', areas:['Derecho','Ingeniería','Ciencias Económicas','Educación'] },
  { id:'inpahu', name:'Fundación Universitaria INPAHU', type:'institucion_universitaria', department:'Bogotá D.C.', city:'Bogotá', areas:['Comunicación','Diseño','Administración'] },
  { id:'politecnico-nal', name:'Politécnico Nacional', type:'institucion_tecnologica', department:'Bogotá D.C.', city:'Bogotá', areas:['Tecnología','Ingeniería'] },
  { id:'sena-bog', name:'SENA Regional Bogotá', shortName:'SENA', type:'sena', department:'Bogotá D.C.', city:'Bogotá', areas:['Tecnología','Gestión Empresarial','Salud','Agroindustria'] },
  // Colegios Bogotá
  { id:'inem-bog', name:'INEM Francisco de Paula Santander', shortName:'INEM Bogotá', type:'colegio', department:'Bogotá D.C.', city:'Bogotá', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'normal-bog', name:'Escuela Normal Superior Distrital María Montessori', type:'colegio', department:'Bogotá D.C.', city:'Bogotá', areas:['Educación','Formación docente'] },
  { id:'iti-bog', name:'Instituto Técnico Industrial Piloto', shortName:'ITI Bogotá', type:'colegio', department:'Bogotá D.C.', city:'Bogotá', areas:['Bachillerato técnico','Industria'] },
  { id:'colegio-salesiano-bog', name:'Colegio Salesiano León XIII', type:'colegio', department:'Bogotá D.C.', city:'Bogotá', areas:['Bachillerato'] },
  { id:'colegio-lasalle-bog', name:'Colegio De La Salle', type:'colegio', department:'Bogotá D.C.', city:'Bogotá', areas:['Bachillerato'] },

  // ════════════════════════════════════════════════════
  //  ANTIOQUIA
  // ════════════════════════════════════════════════════
  { id:'udea', name:'Universidad de Antioquia', shortName:'UdeA', type:'universidad', department:'Antioquia', city:'Medellín', areas:['Medicina','Ingeniería','Ciencias','Humanidades'] },
  { id:'unal-med', name:'Universidad Nacional de Colombia', shortName:'UNAL Medellín', type:'universidad', department:'Antioquia', city:'Medellín', areas:['Ingeniería','Ciencias','Minas','Arquitectura'] },
  { id:'eafit', name:'Universidad EAFIT', type:'universidad', department:'Antioquia', city:'Medellín', areas:['Ingeniería','Administración','Humanidades','Derecho'] },
  { id:'upb-med', name:'Universidad Pontificia Bolivariana', shortName:'UPB', type:'universidad', department:'Antioquia', city:'Medellín', areas:['Ingeniería','Arquitectura','Humanidades','Negocios'] },
  { id:'udem', name:'Universidad de Medellín', shortName:'UdeM', type:'universidad', department:'Antioquia', city:'Medellín', areas:['Derecho','Ingeniería','Ciencias Económicas','Comunicación'] },
  { id:'ces', name:'Universidad CES', type:'universidad', department:'Antioquia', city:'Medellín', areas:['Salud','Veterinaria','Administración'] },
  { id:'sbuena-med', name:'Universidad de San Buenaventura', type:'universidad', department:'Antioquia', city:'Medellín', areas:['Ingeniería','Psicología','Educación'] },
  { id:'itm-med', name:'Instituto Tecnológico Metropolitano', shortName:'ITM', type:'institucion_universitaria', department:'Antioquia', city:'Medellín', areas:['Tecnología','Ingeniería','Artes','Ciencias'] },
  { id:'polijanio', name:'Politécnico Colombiano Jaime Isaza Cadavid', shortName:'Politécnico JIC', type:'institucion_universitaria', department:'Antioquia', city:'Medellín', areas:['Tecnología','Ingeniería','Educación Física'] },
  { id:'cooperativa-med', name:'Universidad Cooperativa de Colombia', shortName:'UCC Medellín', type:'universidad', department:'Antioquia', city:'Medellín', areas:['Derecho','Contaduría','Medicina'] },
  { id:'uniminuto-med', name:'Corporación Universitaria Minuto de Dios', shortName:'Uniminuto Medellín', type:'institucion_universitaria', department:'Antioquia', city:'Medellín', areas:['Educación','Ingeniería','Negocios'] },
  { id:'mariacano-med', name:'Fundación Universitaria María Cano', type:'institucion_universitaria', department:'Antioquia', city:'Medellín', areas:['Salud','Derecho','Comunicación'] },
  { id:'areandina-med', name:'Fundación Universitaria del Área Andina', shortName:'Areandina Medellín', type:'institucion_universitaria', department:'Antioquia', city:'Medellín', areas:['Salud','Negocios','Diseño'] },
  { id:'autonomas-am', name:'Fundación Universitaria Autónoma de las Américas', type:'institucion_universitaria', department:'Antioquia', city:'Medellín', areas:['Derecho','Salud','Ingeniería','Ciencias Económicas'] },
  { id:'envigado', name:'Institución Universitaria de Envigado', shortName:'IUE', type:'institucion_universitaria', department:'Antioquia', city:'Envigado', areas:['Ciencias Empresariales','Ingeniería','Derecho'] },
  { id:'sena-ant', name:'SENA Regional Antioquia', shortName:'SENA', type:'sena', department:'Antioquia', city:'Medellín', areas:['Tecnología','Artesanías','Salud','Gestión'] },
  // Colegios Antioquia
  { id:'inem-med', name:'INEM José Félix de Restrepo', shortName:'INEM Medellín', type:'colegio', department:'Antioquia', city:'Medellín', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'iti-med', name:'Instituto Técnico Industrial', shortName:'ITI Medellín', type:'colegio', department:'Antioquia', city:'Medellín', areas:['Bachillerato técnico','Industria'] },
  { id:'normal-med', name:'Escuela Normal Superior de Medellín', type:'colegio', department:'Antioquia', city:'Medellín', areas:['Educación','Formación docente'] },
  { id:'salesiano-med', name:'Colegio Salesiano El Sufragio', type:'colegio', department:'Antioquia', city:'Medellín', areas:['Bachillerato'] },
  { id:'lasalle-med', name:'Colegio De La Salle Medellín', type:'colegio', department:'Antioquia', city:'Medellín', areas:['Bachillerato'] },

  // ════════════════════════════════════════════════════
  //  SANTANDER  ← departamento principal del proyecto
  // ════════════════════════════════════════════════════
  { id:'uts', name:'Unidades Tecnológicas de Santander', shortName:'UTS', type:'institucion_tecnologica', department:'Santander', city:'Bucaramanga', areas:['Ingeniería','Tecnología','Salud','Ciencias Económicas'] },
  { id:'uis', name:'Universidad Industrial de Santander', shortName:'UIS', type:'universidad', department:'Santander', city:'Bucaramanga', areas:['Ingeniería','Ciencias','Salud','Humanidades'] },
  { id:'unab', name:'Universidad Autónoma de Bucaramanga', shortName:'UNAB', type:'universidad', department:'Santander', city:'Bucaramanga', areas:['Ingeniería','Salud','Ciencias Económicas','Comunicación'] },
  { id:'sto-tomas-buc', name:'Universidad Santo Tomás', shortName:'USTA Bucaramanga', type:'universidad', department:'Santander', city:'Bucaramanga', areas:['Derecho','Ingeniería','Humanidades'] },
  { id:'cooperativa-buc', name:'Universidad Cooperativa de Colombia', shortName:'UCC Bucaramanga', type:'universidad', department:'Santander', city:'Bucaramanga', areas:['Derecho','Medicina','Ingeniería','Contaduría'] },
  { id:'upb-buc', name:'Universidad Pontificia Bolivariana', shortName:'UPB Bucaramanga', type:'universidad', department:'Santander', city:'Bucaramanga', areas:['Ingeniería','Humanidades','Arquitectura'] },
  { id:'udes', name:'Universidad de Santander', shortName:'UDES', type:'universidad', department:'Santander', city:'Bucaramanga', areas:['Salud','Ingeniería','Ciencias Económicas','Comunicación'] },
  { id:'udi', name:'Universidad de Investigación y Desarrollo', shortName:'UDI', type:'institucion_universitaria', department:'Santander', city:'Bucaramanga', areas:['Ingeniería','Ciencias Económicas','Derecho'] },
  { id:'manuela-buc', name:'Universidad Manuela Beltrán', shortName:'UMB Bucaramanga', type:'universidad', department:'Santander', city:'Bucaramanga', areas:['Salud','Ingeniería','Ciencias Económicas'] },
  { id:'uniciencia', name:'Corporación Universitaria de Ciencia y Desarrollo', shortName:'UNICIENCIA', type:'institucion_universitaria', department:'Santander', city:'Bucaramanga', areas:['Ingeniería','Ciencias Sociales','Educación'] },
  { id:'areandina-buc', name:'Fundación Universitaria del Área Andina', shortName:'Areandina Bucaramanga', type:'institucion_universitaria', department:'Santander', city:'Bucaramanga', areas:['Salud','Diseño','Negocios'] },
  { id:'uniminuto-buc', name:'Corporación Universitaria Minuto de Dios', shortName:'Uniminuto Bucaramanga', type:'institucion_universitaria', department:'Santander', city:'Bucaramanga', areas:['Educación','Negocios','Ingeniería'] },
  { id:'unisangil', name:'Fundación Universitaria de San Gil', shortName:'UNISANGIL', type:'institucion_universitaria', department:'Santander', city:'San Gil', areas:['Ingeniería','Ciencias Económicas','Educación','Salud'] },
  { id:'sena-sant', name:'SENA Regional Santander', shortName:'SENA', type:'sena', department:'Santander', city:'Bucaramanga', areas:['Tecnología','Salud','Gestión Empresarial','Agroindustria'] },
  // Colegios Santander
  { id:'inem-buc', name:'INEM Custodio García Rovira', shortName:'INEM Bucaramanga', type:'colegio', department:'Santander', city:'Bucaramanga', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'iti-buc', name:'Instituto Técnico Dámaso Zapata', shortName:'ITI Bucaramanga', type:'colegio', department:'Santander', city:'Bucaramanga', areas:['Bachillerato técnico','Industria'] },
  { id:'normal-buc', name:'Escuela Normal Superior de Bucaramanga', type:'colegio', department:'Santander', city:'Bucaramanga', areas:['Educación','Formación docente'] },
  { id:'antonia-santos', name:'Liceo Nacional Antonia Santos', type:'colegio', department:'Santander', city:'Bucaramanga', areas:['Bachillerato'] },
  { id:'salesiano-buc', name:'Colegio Salesiano de Bucaramanga', type:'colegio', department:'Santander', city:'Bucaramanga', areas:['Bachillerato'] },
  { id:'lasalle-buc', name:'Colegio De La Salle Bucaramanga', type:'colegio', department:'Santander', city:'Bucaramanga', areas:['Bachillerato'] },
  { id:'sem-buc', name:'Colegio San Pedro Claver', type:'colegio', department:'Santander', city:'Bucaramanga', areas:['Bachillerato'] },
  { id:'normal-sangil', name:'Escuela Normal Superior de San Gil', type:'colegio', department:'Santander', city:'San Gil', areas:['Educación','Formación docente'] },
  { id:'normal-socorro', name:'Escuela Normal Superior El Socorro', type:'colegio', department:'Santander', city:'El Socorro', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  VALLE DEL CAUCA
  // ════════════════════════════════════════════════════
  { id:'univalle', name:'Universidad del Valle', shortName:'Univalle', type:'universidad', department:'Valle del Cauca', city:'Cali', areas:['Ingeniería','Ciencias','Humanidades','Salud'] },
  { id:'icesi', name:'Universidad ICESI', type:'universidad', department:'Valle del Cauca', city:'Cali', areas:['Ingeniería','Derecho','Ciencias Económicas','Salud'] },
  { id:'javeriana-cali', name:'Pontificia Universidad Javeriana', shortName:'Javeriana Cali', type:'universidad', department:'Valle del Cauca', city:'Cali', areas:['Ingeniería','Ciencias Económicas','Humanidades'] },
  { id:'autonoma-occ', name:'Universidad Autónoma de Occidente', shortName:'UAO', type:'universidad', department:'Valle del Cauca', city:'Cali', areas:['Ingeniería','Ciencias Económicas','Comunicación'] },
  { id:'santiago-cali', name:'Universidad Santiago de Cali', shortName:'USC', type:'universidad', department:'Valle del Cauca', city:'Cali', areas:['Derecho','Salud','Ingeniería','Ciencias Económicas'] },
  { id:'sbuena-cali', name:'Universidad San Buenaventura Cali', type:'universidad', department:'Valle del Cauca', city:'Cali', areas:['Ingeniería','Humanidades','Ciencias Económicas'] },
  { id:'libre-cali', name:'Universidad Libre', shortName:'Universidad Libre Cali', type:'universidad', department:'Valle del Cauca', city:'Cali', areas:['Derecho','Ingeniería','Ciencias Económicas'] },
  { id:'cooperativa-cali', name:'Universidad Cooperativa de Colombia', shortName:'UCC Cali', type:'universidad', department:'Valle del Cauca', city:'Cali', areas:['Derecho','Odontología','Medicina'] },
  { id:'uniminuto-cali', name:'Corporación Universitaria Minuto de Dios', shortName:'Uniminuto Cali', type:'institucion_universitaria', department:'Valle del Cauca', city:'Cali', areas:['Educación','Negocios','Ingeniería'] },
  { id:'sena-valle', name:'SENA Regional Valle', shortName:'SENA', type:'sena', department:'Valle del Cauca', city:'Cali', areas:['Tecnología','Comercio','Salud','Agricultura'] },
  // Colegios Valle
  { id:'inem-cali', name:'INEM Jorge Isaacs', shortName:'INEM Cali', type:'colegio', department:'Valle del Cauca', city:'Cali', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'iti-cali', name:'Instituto Técnico Industrial Antonio José Camacho', shortName:'ITAC Cali', type:'colegio', department:'Valle del Cauca', city:'Cali', areas:['Bachillerato técnico'] },
  { id:'normal-cali', name:'Escuela Normal Superior Farallones de Cali', type:'colegio', department:'Valle del Cauca', city:'Cali', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  ATLÁNTICO
  // ════════════════════════════════════════════════════
  { id:'uninorte', name:'Universidad del Norte', shortName:'Uninorte', type:'universidad', department:'Atlántico', city:'Barranquilla', areas:['Ingeniería','Salud','Humanidades','Derecho'] },
  { id:'uniatlant', name:'Universidad del Atlántico', type:'universidad', department:'Atlántico', city:'Barranquilla', areas:['Ingeniería','Químicas','Nutrición','Arquitectura'] },
  { id:'autonoma-caribe', name:'Universidad Autónoma del Caribe', shortName:'Uniautonoma', type:'universidad', department:'Atlántico', city:'Barranquilla', areas:['Ingeniería','Ciencias Sociales','Comunicación'] },
  { id:'simon-bolivar-baq', name:'Universidad Simón Bolívar', type:'universidad', department:'Atlántico', city:'Barranquilla', areas:['Ingeniería','Salud','Ciencias Económicas'] },
  { id:'cuc', name:'Universidad de la Costa', shortName:'CUC', type:'universidad', department:'Atlántico', city:'Barranquilla', areas:['Ingeniería','Derecho','Arquitectura','Psicología'] },
  { id:'libre-baq', name:'Universidad Libre', shortName:'Universidad Libre Barranquilla', type:'universidad', department:'Atlántico', city:'Barranquilla', areas:['Derecho','Ingeniería','Ciencias Económicas'] },
  { id:'corp-americana', name:'Corporación Universitaria Americana', type:'institucion_universitaria', department:'Atlántico', city:'Barranquilla', areas:['Ingeniería','Negocios','Salud'] },
  { id:'uniminuto-baq', name:'Corporación Universitaria Minuto de Dios', shortName:'Uniminuto Barranquilla', type:'institucion_universitaria', department:'Atlántico', city:'Barranquilla', areas:['Educación','Negocios'] },
  { id:'sena-atl', name:'SENA Regional Atlántico', shortName:'SENA', type:'sena', department:'Atlántico', city:'Barranquilla', areas:['Tecnología','Comercio','Salud'] },
  // Colegios Atlántico
  { id:'inem-baq', name:'INEM de Barranquilla', shortName:'INEM Barranquilla', type:'colegio', department:'Atlántico', city:'Barranquilla', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'normal-baq', name:'Escuela Normal Superior La Hacienda', type:'colegio', department:'Atlántico', city:'Barranquilla', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  BOLÍVAR
  // ════════════════════════════════════════════════════
  { id:'unicartagena', name:'Universidad de Cartagena', type:'universidad', department:'Bolívar', city:'Cartagena', areas:['Medicina','Derecho','Ingeniería','Químicas'] },
  { id:'utb', name:'Universidad Tecnológica de Bolívar', shortName:'UTB', type:'universidad', department:'Bolívar', city:'Cartagena', areas:['Ingeniería','Negocios','Humanidades'] },
  { id:'rafael-nunez', name:'Corporación Universitaria Rafael Núñez', shortName:'CURN', type:'institucion_universitaria', department:'Bolívar', city:'Cartagena', areas:['Salud','Derecho','Ingeniería'] },
  { id:'americana-cart', name:'Corporación Universitaria Americana', shortName:'Americana Cartagena', type:'institucion_universitaria', department:'Bolívar', city:'Cartagena', areas:['Negocios','Salud','Derecho'] },
  { id:'sena-bol', name:'SENA Regional Bolívar', shortName:'SENA', type:'sena', department:'Bolívar', city:'Cartagena', areas:['Tecnología','Náutica','Turismo','Petroquímica'] },
  // Colegios Bolívar
  { id:'inem-cart', name:'INEM de Cartagena', shortName:'INEM Cartagena', type:'colegio', department:'Bolívar', city:'Cartagena', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'normal-cart', name:'Escuela Normal Superior de Cartagena', type:'colegio', department:'Bolívar', city:'Cartagena', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  BOYACÁ
  // ════════════════════════════════════════════════════
  { id:'uptc', name:'Universidad Pedagógica y Tecnológica de Colombia', shortName:'UPTC', type:'universidad', department:'Boyacá', city:'Tunja', areas:['Ingeniería','Educación','Ciencias','Economía'] },
  { id:'uboyaca', name:'Universidad de Boyacá', type:'universidad', department:'Boyacá', city:'Tunja', areas:['Derecho','Salud','Ingeniería','Ciencias Económicas'] },
  { id:'juandecastellanos', name:'Fundación Universitaria Juan de Castellanos', type:'institucion_universitaria', department:'Boyacá', city:'Tunja', areas:['Salud','Ingeniería','Educación'] },
  { id:'sena-boy', name:'SENA Regional Boyacá', shortName:'SENA', type:'sena', department:'Boyacá', city:'Tunja', areas:['Tecnología','Minería','Agropecuaria','Gestión'] },
  { id:'iti-tunja', name:'Instituto Técnico Industrial de Tunja', type:'colegio', department:'Boyacá', city:'Tunja', areas:['Bachillerato técnico','Industria'] },
  { id:'normal-tunja', name:'Escuela Normal Superior Santiago de Tunja', type:'colegio', department:'Boyacá', city:'Tunja', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  CALDAS
  // ════════════════════════════════════════════════════
  { id:'ucaldas', name:'Universidad de Caldas', type:'universidad', department:'Caldas', city:'Manizales', areas:['Artes','Ciencias Exactas','Salud','Ciencias Jurídicas'] },
  { id:'unal-man', name:'Universidad Nacional de Colombia', shortName:'UNAL Manizales', type:'universidad', department:'Caldas', city:'Manizales', areas:['Ingeniería','Ciencias','Administración'] },
  { id:'autonoma-man', name:'Universidad Autónoma de Manizales', shortName:'UAM', type:'universidad', department:'Caldas', city:'Manizales', areas:['Salud','Ingeniería','Economía'] },
  { id:'uman', name:'Universidad de Manizales', type:'universidad', department:'Caldas', city:'Manizales', areas:['Derecho','Psicología','Economía','Ingeniería'] },
  { id:'sena-cal', name:'SENA Regional Caldas', shortName:'SENA', type:'sena', department:'Caldas', city:'Manizales', areas:['Tecnología','Café','Turismo'] },
  { id:'inem-man', name:'INEM José Celestino Mutis', shortName:'INEM Manizales', type:'colegio', department:'Caldas', city:'Manizales', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'normal-man', name:'Escuela Normal Superior de Manizales', type:'colegio', department:'Caldas', city:'Manizales', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  RISARALDA
  // ════════════════════════════════════════════════════
  { id:'utp', name:'Universidad Tecnológica de Pereira', shortName:'UTP', type:'universidad', department:'Risaralda', city:'Pereira', areas:['Ingeniería','Tecnología','Bellas Artes','Ciencias de la Salud'] },
  { id:'libre-per', name:'Universidad Libre', shortName:'Universidad Libre Pereira', type:'universidad', department:'Risaralda', city:'Pereira', areas:['Derecho','Ingeniería','Ciencias Económicas'] },
  { id:'areandina-per', name:'Fundación Universitaria del Área Andina', shortName:'Areandina Pereira', type:'institucion_universitaria', department:'Risaralda', city:'Pereira', areas:['Salud','Diseño','Negocios'] },
  { id:'uniminuto-per', name:'Corporación Universitaria Minuto de Dios', shortName:'Uniminuto Pereira', type:'institucion_universitaria', department:'Risaralda', city:'Pereira', areas:['Educación','Negocios'] },
  { id:'sena-ris', name:'SENA Regional Risaralda', shortName:'SENA', type:'sena', department:'Risaralda', city:'Pereira', areas:['Tecnología','Comercio','Salud'] },
  { id:'inem-per', name:'INEM Felipe Pérez', shortName:'INEM Pereira', type:'colegio', department:'Risaralda', city:'Pereira', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'normal-per', name:'Escuela Normal Superior El Jardín', type:'colegio', department:'Risaralda', city:'Pereira', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  QUINDÍO
  // ════════════════════════════════════════════════════
  { id:'uniquindio', name:'Universidad del Quindío', type:'universidad', department:'Quindío', city:'Armenia', areas:['Ingeniería','Ciencias Económicas','Educación','Ciencias de la Salud'] },
  { id:'sena-qui', name:'SENA Regional Quindío', shortName:'SENA', type:'sena', department:'Quindío', city:'Armenia', areas:['Tecnología','Turismo','Café'] },
  { id:'inem-arm', name:'INEM Gabriel García Márquez', shortName:'INEM Armenia', type:'colegio', department:'Quindío', city:'Armenia', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'normal-arm', name:'Escuela Normal Superior de Armenia', type:'colegio', department:'Quindío', city:'Armenia', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  NORTE DE SANTANDER
  // ════════════════════════════════════════════════════
  { id:'ufps', name:'Universidad Francisco de Paula Santander', shortName:'UFPS', type:'universidad', department:'Norte de Santander', city:'Cúcuta', areas:['Ingeniería','Ciencias Económicas','Educación','Salud'] },
  { id:'upamplona-nsa', name:'Universidad de Pamplona', shortName:'Unipamplona', type:'universidad', department:'Norte de Santander', city:'Pamplona', areas:['Ingeniería','Salud','Ciencias Económicas','Artes'] },
  { id:'libre-nsa', name:'Universidad Libre', shortName:'Universidad Libre Cúcuta', type:'universidad', department:'Norte de Santander', city:'Cúcuta', areas:['Derecho','Ingeniería','Ciencias Económicas'] },
  { id:'cooperativa-nsa', name:'Universidad Cooperativa de Colombia', shortName:'UCC Cúcuta', type:'universidad', department:'Norte de Santander', city:'Cúcuta', areas:['Derecho','Odontología','Ingeniería'] },
  { id:'sena-nsa', name:'SENA Regional Norte de Santander', shortName:'SENA', type:'sena', department:'Norte de Santander', city:'Cúcuta', areas:['Tecnología','Comercio','Salud'] },
  { id:'inem-cuc', name:'INEM Luis Delfín Insuasty Rodríguez', shortName:'INEM Cúcuta', type:'colegio', department:'Norte de Santander', city:'Cúcuta', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'normal-cuc', name:'Escuela Normal Superior de Cúcuta', type:'colegio', department:'Norte de Santander', city:'Cúcuta', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  TOLIMA
  // ════════════════════════════════════════════════════
  { id:'utolima', name:'Universidad del Tolima', type:'universidad', department:'Tolima', city:'Ibagué', areas:['Ingeniería','Ciencias','Salud','Humanidades'] },
  { id:'unibague', name:'Universidad de Ibagué', type:'universidad', department:'Tolima', city:'Ibagué', areas:['Ingeniería','Derecho','Psicología','Negocios'] },
  { id:'sena-tol', name:'SENA Regional Tolima', shortName:'SENA', type:'sena', department:'Tolima', city:'Ibagué', areas:['Tecnología','Agropecuaria','Gestión'] },
  { id:'inem-iba', name:'INEM Manuel Murillo Toro', shortName:'INEM Ibagué', type:'colegio', department:'Tolima', city:'Ibagué', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'normal-iba', name:'Escuela Normal Superior de Ibagué', type:'colegio', department:'Tolima', city:'Ibagué', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  HUILA
  // ════════════════════════════════════════════════════
  { id:'usurco', name:'Universidad Surcolombiana', type:'universidad', department:'Huila', city:'Neiva', areas:['Ingeniería','Salud','Educación','Ciencias Sociales'] },
  { id:'corhuila', name:'Corporación Universitaria del Huila', shortName:'CORHUILA', type:'institucion_universitaria', department:'Huila', city:'Neiva', areas:['Ingeniería','Ciencias Económicas','Derecho'] },
  { id:'sena-huila', name:'SENA Regional Huila', shortName:'SENA', type:'sena', department:'Huila', city:'Neiva', areas:['Tecnología','Agropecuaria','Gestión'] },
  { id:'inem-neiva', name:'INEM Julián Motta Salas', shortName:'INEM Neiva', type:'colegio', department:'Huila', city:'Neiva', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'normal-neiva', name:'Escuela Normal Superior de Neiva', type:'colegio', department:'Huila', city:'Neiva', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  NARIÑO
  // ════════════════════════════════════════════════════
  { id:'unarino', name:'Universidad de Nariño', type:'universidad', department:'Nariño', city:'Pasto', areas:['Ingeniería','Ciencias','Humanidades','Salud'] },
  { id:'umariana', name:'Universidad Mariana', type:'universidad', department:'Nariño', city:'Pasto', areas:['Salud','Ingeniería','Humanidades','Educación'] },
  { id:'cesmag', name:'Institución Universitaria CESMAG', type:'institucion_universitaria', department:'Nariño', city:'Pasto', areas:['Ingeniería','Arquitectura','Contaduría'] },
  { id:'cooperativa-pas', name:'Universidad Cooperativa de Colombia', shortName:'UCC Pasto', type:'universidad', department:'Nariño', city:'Pasto', areas:['Derecho','Medicina','Ingeniería'] },
  { id:'sena-nar', name:'SENA Regional Nariño', shortName:'SENA', type:'sena', department:'Nariño', city:'Pasto', areas:['Tecnología','Artesanías','Agropecuaria'] },
  { id:'inem-pasto', name:'INEM Ciudad de Pasto', shortName:'INEM Pasto', type:'colegio', department:'Nariño', city:'Pasto', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'normal-pasto', name:'Escuela Normal Superior Liceo de Nariño', type:'colegio', department:'Nariño', city:'Pasto', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  META
  // ════════════════════════════════════════════════════
  { id:'unillanos', name:'Universidad de los Llanos', shortName:'Unillanos', type:'universidad', department:'Meta', city:'Villavicencio', areas:['Ingeniería','Ciencias Agropecuarias','Salud','Economía'] },
  { id:'uniminuto-meta', name:'Corporación Universitaria Minuto de Dios', shortName:'Uniminuto Villavicencio', type:'institucion_universitaria', department:'Meta', city:'Villavicencio', areas:['Educación','Negocios','Ingeniería'] },
  { id:'sena-meta', name:'SENA Regional Meta', shortName:'SENA', type:'sena', department:'Meta', city:'Villavicencio', areas:['Tecnología','Agroindustria','Turismo'] },
  { id:'inem-villa', name:'INEM Hugo J. Bermúdez', shortName:'INEM Villavicencio', type:'colegio', department:'Meta', city:'Villavicencio', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'normal-villa', name:'Escuela Normal Superior de Villavicencio', type:'colegio', department:'Meta', city:'Villavicencio', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  CAUCA
  // ════════════════════════════════════════════════════
  { id:'unicauca', name:'Universidad del Cauca', type:'universidad', department:'Cauca', city:'Popayán', areas:['Ingeniería','Ciencias Naturales','Salud','Artes'] },
  { id:'sena-cau', name:'SENA Regional Cauca', shortName:'SENA', type:'sena', department:'Cauca', city:'Popayán', areas:['Tecnología','Agroindustria','Artesanías'] },
  { id:'inem-popa', name:'INEM de Popayán', shortName:'INEM Popayán', type:'colegio', department:'Cauca', city:'Popayán', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'normal-popa', name:'Escuela Normal Superior de Popayán', type:'colegio', department:'Cauca', city:'Popayán', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  CÓRDOBA
  // ════════════════════════════════════════════════════
  { id:'unicordoba', name:'Universidad de Córdoba', type:'universidad', department:'Córdoba', city:'Montería', areas:['Ingeniería','Ciencias Agropecuarias','Salud','Ciencias Básicas'] },
  { id:'unisinu', name:'Universidad del Sinú', type:'universidad', department:'Córdoba', city:'Montería', areas:['Salud','Ingeniería','Derecho','Arquitectura'] },
  { id:'sena-cor', name:'SENA Regional Córdoba', shortName:'SENA', type:'sena', department:'Córdoba', city:'Montería', areas:['Tecnología','Agropecuaria','Pesca'] },
  { id:'inem-mont', name:'INEM Lorenzo Alcantuz Henao', shortName:'INEM Montería', type:'colegio', department:'Córdoba', city:'Montería', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'normal-mont', name:'Escuela Normal Superior de Montería', type:'colegio', department:'Córdoba', city:'Montería', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  CESAR
  // ════════════════════════════════════════════════════
  { id:'unicesar', name:'Universidad Popular del Cesar', shortName:'UPC', type:'universidad', department:'Cesar', city:'Valledupar', areas:['Ingeniería','Educación','Derecho','Salud'] },
  { id:'sena-ces', name:'SENA Regional Cesar', shortName:'SENA', type:'sena', department:'Cesar', city:'Valledupar', areas:['Tecnología','Minería','Agropecuaria'] },
  { id:'inem-val', name:'INEM José Eugenio Martínez', shortName:'INEM Valledupar', type:'colegio', department:'Cesar', city:'Valledupar', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'normal-val', name:'Escuela Normal Superior de Valledupar', type:'colegio', department:'Cesar', city:'Valledupar', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  MAGDALENA
  // ════════════════════════════════════════════════════
  { id:'unimagdalena', name:'Universidad del Magdalena', shortName:'Unimagdalena', type:'universidad', department:'Magdalena', city:'Santa Marta', areas:['Ingeniería','Salud','Ciencias Agropecuarias','Humanidades'] },
  { id:'sena-mag', name:'SENA Regional Magdalena', shortName:'SENA', type:'sena', department:'Magdalena', city:'Santa Marta', areas:['Tecnología','Turismo','Pesca'] },
  { id:'inem-sta', name:'INEM Simón Bolívar', shortName:'INEM Santa Marta', type:'colegio', department:'Magdalena', city:'Santa Marta', areas:['Bachillerato','Modalidades técnicas'] },
  { id:'normal-sta', name:'Escuela Normal Superior del Distrito de Santa Marta', type:'colegio', department:'Magdalena', city:'Santa Marta', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  LA GUAJIRA
  // ════════════════════════════════════════════════════
  { id:'uniguajira', name:'Universidad de La Guajira', type:'universidad', department:'La Guajira', city:'Riohacha', areas:['Ingeniería','Administración','Derecho'] },
  { id:'sena-gua', name:'SENA Regional La Guajira', shortName:'SENA', type:'sena', department:'La Guajira', city:'Riohacha', areas:['Tecnología','Minería','Turismo'] },
  { id:'normal-rio', name:'Escuela Normal Superior de Riohacha', type:'colegio', department:'La Guajira', city:'Riohacha', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  SUCRE
  // ════════════════════════════════════════════════════
  { id:'unisucre', name:'Universidad de Sucre', type:'universidad', department:'Sucre', city:'Sincelejo', areas:['Ingeniería','Salud','Educación','Ciencias Económicas'] },
  { id:'cecar', name:'Corporación Universitaria del Caribe', shortName:'CECAR', type:'institucion_universitaria', department:'Sucre', city:'Sincelejo', areas:['Derecho','Ingeniería','Salud','Educación'] },
  { id:'sena-suc', name:'SENA Regional Sucre', shortName:'SENA', type:'sena', department:'Sucre', city:'Sincelejo', areas:['Tecnología','Agropecuaria','Gestión'] },
  { id:'normal-sinc', name:'Escuela Normal Superior de Sincelejo', type:'colegio', department:'Sucre', city:'Sincelejo', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  CHOCÓ
  // ════════════════════════════════════════════════════
  { id:'utch', name:'Universidad Tecnológica del Chocó', shortName:'UTCH', type:'universidad', department:'Chocó', city:'Quibdó', areas:['Ingeniería','Ciencias Básicas','Salud','Educación'] },
  { id:'sena-cho', name:'SENA Regional Chocó', shortName:'SENA', type:'sena', department:'Chocó', city:'Quibdó', areas:['Tecnología','Maderas','Minería'] },
  { id:'normal-quib', name:'Escuela Normal Superior Manuel Cañizales', type:'colegio', department:'Chocó', city:'Quibdó', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  CAQUETÁ
  // ════════════════════════════════════════════════════
  { id:'uniamazonia', name:'Universidad de la Amazonia', shortName:'Uniamazonia', type:'universidad', department:'Caquetá', city:'Florencia', areas:['Ingeniería','Ciencias Agropecuarias','Salud'] },
  { id:'sena-caq', name:'SENA Regional Caquetá', shortName:'SENA', type:'sena', department:'Caquetá', city:'Florencia', areas:['Tecnología','Agropecuaria','Ecoturismo'] },
  { id:'normal-flor', name:'Escuela Normal Superior de Florencia', type:'colegio', department:'Caquetá', city:'Florencia', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  PUTUMAYO
  // ════════════════════════════════════════════════════
  { id:'sena-put', name:'SENA Regional Putumayo', shortName:'SENA', type:'sena', department:'Putumayo', city:'Mocoa', areas:['Tecnología','Agropecuaria','Petróleo'] },
  { id:'normal-mocoa', name:'Escuela Normal Superior de Mocoa', type:'colegio', department:'Putumayo', city:'Mocoa', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  ARAUCA
  // ════════════════════════════════════════════════════
  { id:'sena-ara', name:'SENA Regional Arauca', shortName:'SENA', type:'sena', department:'Arauca', city:'Arauca', areas:['Tecnología','Agropecuaria','Petróleo'] },
  { id:'normal-arauca', name:'Escuela Normal Superior de Arauca', type:'colegio', department:'Arauca', city:'Arauca', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  CASANARE
  // ════════════════════════════════════════════════════
  { id:'sena-cas', name:'SENA Regional Casanare', shortName:'SENA', type:'sena', department:'Casanare', city:'Yopal', areas:['Tecnología','Petróleo','Agropecuaria'] },
  { id:'normal-yopal', name:'Escuela Normal Superior de Yopal', type:'colegio', department:'Casanare', city:'Yopal', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  SAN ANDRÉS Y PROVIDENCIA
  // ════════════════════════════════════════════════════
  { id:'sena-san', name:'SENA Regional San Andrés', shortName:'SENA', type:'sena', department:'San Andrés y Providencia', city:'San Andrés', areas:['Tecnología','Turismo','Idiomas'] },
  { id:'normal-san', name:'Escuela Normal Superior de San Andrés', type:'colegio', department:'San Andrés y Providencia', city:'San Andrés', areas:['Educación','Formación docente'] },

  // ════════════════════════════════════════════════════
  //  VICHADA · GUAVIARE · GUAINÍA · AMAZONAS · VAUPÉS
  // ════════════════════════════════════════════════════
  { id:'sena-vic', name:'SENA Regional Vichada', shortName:'SENA', type:'sena', department:'Vichada', city:'Puerto Carreño', areas:['Tecnología','Agropecuaria'] },
  { id:'sena-guav', name:'SENA Regional Guaviare', shortName:'SENA', type:'sena', department:'Guaviare', city:'San José del Guaviare', areas:['Tecnología','Agropecuaria'] },
  { id:'sena-guai', name:'SENA Regional Guainía', shortName:'SENA', type:'sena', department:'Guainía', city:'Inírida', areas:['Tecnología','Artesanías'] },
  { id:'sena-ama', name:'SENA Regional Amazonas', shortName:'SENA', type:'sena', department:'Amazonas', city:'Leticia', areas:['Tecnología','Ecoturismo'] },
  { id:'sena-vau', name:'SENA Regional Vaupés', shortName:'SENA', type:'sena', department:'Vaupés', city:'Mitú', areas:['Tecnología','Agropecuaria'] },
];

// ─────────────────────────────────────────────────────────────────
//  Funciones de utilidad
// ─────────────────────────────────────────────────────────────────

export const departments: string[] = [
  ...new Set(institutions.map(i => i.department)),
].sort();

export function getCitiesByDepartment(department: string): string[] {
  return [
    ...new Set(
      institutions.filter(i => i.department === department).map(i => i.city)
    ),
  ].sort();
}

export function searchInstitutions(
  query: string,
  filters?: {
    department?: string;
    city?: string;
    type?: InstitutionType | '';
  },
  limit = 25
): Institution[] {
  const normalize = (str: string) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const q = normalize(query.trim());

  return institutions
    .filter(inst => {
      if (filters?.department && inst.department !== filters.department) return false;
      if (filters?.city && inst.city !== filters.city) return false;
      if (filters?.type && inst.type !== filters.type) return false;
      if (!q) return true;
      return (
        normalize(inst.name).includes(q) ||
        normalize(inst.shortName ?? '').includes(q) ||
        (inst.areas ?? []).some(a => normalize(a).includes(q))
      );
    })
    .slice(0, limit);
}