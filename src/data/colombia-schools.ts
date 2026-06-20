// ─────────────────────────────────────────────────────────────────
//  colombia-schools.ts
//  Dataset expandido de colegios de Colombia
//  Para descargar TODOS los del MEN: node scripts/generate-schools.mjs
// ─────────────────────────────────────────────────────────────────

export const COLOMBIA_SCHOOLS: Record<string, Record<string, string[]>> = {

  "Bogotá D.C.": {
    "Bogotá": [
      "INEM Francisco de Paula Santander","INEM El Tunal","INEM Kennedy",
      "Instituto Técnico Industrial Francisco José de Caldas",
      "Instituto Técnico Industrial Piloto",
      "Instituto Técnico Industrial Centro Don Bosco",
      "Liceo Nacional Agustín Nieto Caballero",
      "Escuela Normal Superior Distrital María Montessori",
      "Colegio Mayor de San Bartolomé","Gimnasio Moderno","Colegio Los Nogales",
      "Colegio Helvetia","Colegio Nueva Granada","Colegio Anglo Colombiano",
      "Colegio San Carlos","Instituto Pedagógico Nacional",
      "Colegio La Salle Bogotá","Colegio Salesiano León XIII",
      "Colegio El Minuto de Dios","Colegio Santa Francisca Romana",
      "Colegio Distrital Simón Bolívar","Colegio República de Bolivia",
      "Colegio Militar Cadetes de Colombia","Colegio Agustiniano Norte",
      "Colegio Agustiniano Sur","Colegio San Bartolomé La Merced",
      "Colegio Champagnat Bogotá","Colegio Rochester",
      "Colegio Bilingüe Ramón B. Jimeno",
      "Colegio Distrital República de Colombia","Colegio Pío XII",
      "Institución Educativa Distrital La Candelaria",
      "Colegio Cafam Bogotá","Colegio La Merced",
      "Colegio Integrado de Fontibón","Colegio Luis Ángel Arango",
      "Colegio Gustavo Restrepo","Colegio El Salitre",
      "Colegio Distrital Brasilia","Colegio Juan del Corral",
      "Colegio Guillermo León Valencia","Colegio Antonio Nariño Bogotá",
      "Colegio Manuela Beltrán Bogotá","Colegio Cundinamarca",
      "Colegio Las Américas Bogotá","Colegio Acacia II",
      "Colegio Álvaro Gómez Hurtado","Colegio Débora Arango Pérez",
      "Colegio El Paraíso de Manuela Beltrán","Colegio Fanny Mickey",
      "Colegio Jorge Gaitán Cortés","Colegio La Aurora",
      "Colegio La Belleza Los Libertadores","Colegio Nicolás Gómez Dávila",
      "Colegio Rafael Bernal Jiménez","Colegio San Cristóbal Sur",
      "Colegio Técnico Menorah","Colegio Julio Garavito Armero",
      "Colegio Palermo Bogotá","Colegio Florentino González",
      "Colegio Distrital La Estancia San Isidoro",
      "Colegio Distrital Marco Tulio Fernández",
      "Liceo Femenino Mercedes Nariño",
    ],
  },

  "Antioquia": {
    "Medellín": [
      "INEM José Félix de Restrepo","Instituto Técnico Industrial Medellín",
      "Escuela Normal Superior de Medellín","Colegio Salesiano El Sufragio",
      "Colegio De La Salle Medellín","Colegio San Ignacio","Colegio Alemán de Medellín",
      "Normal Superior María Auxiliadora","Colegio Calasanz",
      "Colegio Colombo Británico","Colegio El Carmelo","Colegio Benediktus",
      "Colegio Marco Fidel Suárez Medellín","Colegio Alfonso López Pumarejo Medellín",
      "Institución Educativa José Miguel de Restrepo y Uribe",
      "Colegio Concejo de Medellín","Institución Educativa Héctor Abad Gómez",
      "Colegio Jesús María El Poblado","Colegio Javiera Londoño",
      "Colegio José Acevedo y Gómez Medellín",
      "Colegio Luis Amigó","Colegio Maestro Fernando Botero",
      "Colegio Palermo Medellín","Colegio Simón Bolívar Medellín",
      "Colegio Camilo Torres Medellín",
      "Institución Educativa Carlos Vieco Ortiz","Colegio El Pinal",
      "Institución Educativa Fe y Alegría La Cima",
      "Colegio Ciudad Don Bosco","Colegio Santa María Goretti Medellín",
      "Instituto Colombo Venezolano Medellín","Colegio Champagnat Medellín",
      "Colegio San José de La Salle Medellín","Colegio Porfirio Barba Jacob",
      "Institución Educativa Jorge Robledo Medellín",
    ],
    "Envigado": [
      "Colegio Tomás Carrasquilla","Institución Educativa San José Envigado",
      "Colegio El Rosario de Envigado","Colegio Cooperativo de Envigado",
      "Institución Educativa Marco Fidel Suárez Envigado",
      "Colegio Biffi Envigado","Instituto Técnico de Envigado",
    ],
    "Bello": [
      "INEM Bello","Colegio San Juan de la Salle Bello",
      "Institución Educativa Héctor Abad Gómez Bello",
      "Colegio Marco Fidel Suárez Bello",
      "Institución Educativa Francisco Miranda Bello",
      "Colegio John F. Kennedy Bello",
      "Institución Educativa Santa Teresita Bello",
    ],
    "Itagüí": [
      "INEM Itagüí","Institución Educativa Santa María Itagüí",
      "Colegio Marco Fidel Suárez Itagüí","Instituto Técnico de Itagüí",
      "Institución Educativa San Juan Bosco Itagüí",
    ],
    "Rionegro": [
      "Colegio Boyacá Rionegro","Instituto Técnico El Pedregal",
      "Escuela Normal Superior de Rionegro","Colegio La Salle Rionegro",
      "Institución Educativa El Tablazo Rionegro",
    ],
    "Sabaneta": [
      "Institución Educativa María Auxiliadora Sabaneta",
      "Colegio San Luis Gonzaga Sabaneta",
    ],
    "Apartadó": [
      "Colegio Agrícola de Urabá","Institución Educativa El Triunfo",
      "Colegio Jorge Robledo Apartadó","Institución Educativa Zapata Apartadó",
    ],
  },

  "Santander": {
    "Bucaramanga": [
      "INEM Custodio García Rovira","Instituto Técnico Dámaso Zapata",
      "Liceo Nacional Antonia Santos","Escuela Normal Superior de Bucaramanga",
      "Colegio Salesiano San Juan Bosco","Colegio De La Salle Bucaramanga",
      "Colegio San Pedro Claver","Colegio La Presentación Bucaramanga",
      "Colegio Bilingüe Buckingham","Colegio Politécnico Santander",
      "Instituto Técnico La Cumbre","Colegio Las Américas Bucaramanga",
      "Colegio Municipal Cabecera del Llano","Colegio Santo Ángel",
      "Instituto Jorge Ardila Duarte","Colegio Champagnat Bucaramanga",
      "Colegio Agustiniano Bucaramanga","Colegio Cafam Bucaramanga",
      "Instituto Nacional de Comercio","Colegio Los Cedros",
      "Institución Educativa Nuestra Señora de las Mercedes",
      "Instituto Técnico Industrial Pedro A. López",
      "Colegio Carlos Ramírez Paris","Colegio La Libertad Bucaramanga",
      "Colegio San Francisco Bucaramanga","Colegio Nueve de Abril",
      "Colegio Ciudadela Real de Minas","Colegio El Pórtico",
      "Colegio Comuneros Ottmaro Martínez","Colegio Nacional Santander",
      "Liceo Moderno de Bucaramanga","Colegio El Rosario Bucaramanga",
      "Instituto Colombo Venezolano Bucaramanga","Colegio Liceo Patria",
      "Colegio Colombo Inglés","Liceo Mercantil","Colegio La Arboleda",
      "Colegio Nueva Castilla","Colegio Americano Bucaramanga",
      "Colegio Juan XXIII Bucaramanga","Colegio Alfredo Cadena D'Costa",
      "Colegio Integrado La Paz Bucaramanga",
      "Instituto Técnico Ricaurte","Colegio San Ángel Bucaramanga",
      "Colegio Santa Inés Bucaramanga",
      "Institución Educativa Técnica Café Madrid",
      "Institución Educativa San Francisco de Asís Bucaramanga",
      "Colegio Integrado Juan Atalaya",
    ],
    "Floridablanca": [
      "Instituto Empresarial Gabriela Mistral",
      "Colegio Técnico Comercial San José",
      "Colegio San Francisco de Asís Floridablanca",
      "CASD Centro de Atención Satélite Floridablanca",
      "Colegio Los Alpes Floridablanca",
      "Colegio Bello Horizonte",
      "Colegio La Presentación Floridablanca",
      "Colegio Los Comuneros Floridablanca",
      "Instituto San Carlos Floridablanca",
      "Instituto Técnico Municipal El Pablón",
      "Institución Educativa Leónidas Acuña",
      "Colegio Técnico San Juan Bosco Floridablanca",
      "Colegio Santander Floridablanca",
      "Colegio Comfenalco Floridablanca",
      "Colegio El Pino Floridablanca",
      "Colegio La Cumbre Floridablanca",
      "Colegio Ruitoque",
      "Colegio El Carrizal Floridablanca",
      "Colegio Sagrada Familia Floridablanca",
      "Colegio Nuestra Señora de las Nieves Floridablanca",
      "Instituto Cristiano de Santander",
      "Colegio Los Arrayanes Floridablanca",
      "Colegio Bilingüe Oxford Floridablanca",
      "Liceo Comercial de Floridablanca",
      "Institución Educativa Técnica Industrial Floridablanca",
      "Colegio Juan Pablo II Floridablanca",
      "Colegio María Auxiliadora Floridablanca",
      "Institución Educativa La Macarena Floridablanca",
      "Colegio Integrado El Páramo",
      "Instituto La Salle Floridablanca",
      "Colegio Campestre Floridablanca",
      "Colegio Horizontes de Floridablanca",
      "Institución Educativa Río de Oro",
      "Colegio Integrado La Yubalina",
    ],
    "Girón": [
      "Colegio La Frontera Girón","Colegio Luis Carlos Galán Sarmiento Girón",
      "Escuela Normal Superior de Girón",
      "Colegio Técnico Agroindustrial de Girón",
      "Instituto Educativo de Girón","Colegio El Carrizal Girón",
      "Institución Educativa Villabel","Colegio Integrado La Llana",
      "Colegio La Presentación Girón","Institución Educativa La Trinidad Girón",
      "Colegio Técnico La Floresta","Colegio El Encanto de Girón",
      "Institución Educativa Alberto Santos Buitrago",
      "Colegio Pedro Claver Girón","Instituto Técnico Girón",
    ],
    "Piedecuesta": [
      "Instituto Técnico Municipal Francisco de Paula Santander Piedecuesta",
      "Escuela Normal Superior de Piedecuesta",
      "Colegio Santo Tomás de Aquino Piedecuesta",
      "Colegio Los Comuneros Piedecuesta",
      "Instituto Eduardo Santos Piedecuesta",
      "Colegio La Presentación Piedecuesta",
      "Institución Educativa Gabriel García Morales",
      "Colegio Integral La Esperanza Piedecuesta",
      "Colegio San Rafael Piedecuesta",
      "Colegio El Divino Niño Piedecuesta",
      "Institución Educativa Técnica Guatiguará",
      "Colegio Bilingüe Santander Piedecuesta",
      "Colegio Campestre de Piedecuesta",
      "Colegio Los Alpes Piedecuesta",
      "Institución Educativa Versalles Piedecuesta",
      "Colegio Juan Pablo II Piedecuesta",
      "Institución Educativa Minas","Colegio Integrado Chimita",
    ],
    "Barrancabermeja": [
      "INEM de Barrancabermeja","Colegio Camilo Torres Restrepo",
      "Instituto de Promoción Social","Colegio La Presentación Barrancabermeja",
      "Instituto Técnico Barrancabermeja","Normal Superior de Barrancabermeja",
      "Colegio El Centro Barrancabermeja","Institución Educativa San Silvestre",
      "Colegio Integrado El Uwapa","Colegio La Fortuna Barrancabermeja",
      "Institución Educativa Bosques de La Esperanza",
      "Colegio Rafael Uribe Uribe Barrancabermeja",
      "Colegio La Consolata Barrancabermeja",
      "Instituto Técnico La Paz Barrancabermeja",
      "Colegio Salesiano de Barrancabermeja",
      "Institución Educativa La Independencia Barrancabermeja",
    ],
    "San Gil": [
      "Colegio Pedro Claver San Gil","Instituto Técnico San Gil",
      "Colegio Mayor San Gil","Colegio La Presentación San Gil",
      "Escuela Normal Superior de San Gil","Colegio Salesiano San Gil",
      "Institución Educativa Nuestra Señora del Carmen San Gil",
      "Colegio Integrado La Laguna","Colegio Técnico La Salle San Gil",
    ],
    "Socorro": [
      "Instituto Técnico Vicente Azuero","Colegio La Presentación Socorro",
      "Escuela Normal Superior El Socorro","Colegio Integrado La Aguada",
      "Instituto Técnico Luis A. Calvo","Colegio Salesiano Socorro",
    ],
    "Vélez": [
      "Escuela Normal Superior Regional de Vélez",
      "Instituto Técnico Industrial Vélez",
      "Colegio La Presentación Vélez",
      "Institución Educativa Técnica Vélez","Colegio Integrado Vélez",
    ],
    "Málaga": [
      "Colegio Guillermo Suárez Báez",
      "Instituto Técnico Agroindustrial de Málaga",
      "Normal Superior de Málaga","Colegio La Presentación Málaga",
    ],
    "Lebrija": [
      "Colegio Técnico Industrial Lebrija",
      "Institución Educativa Las Acacias Lebrija",
      "Colegio Integrado El Guayabo",
      "Institución Educativa Técnica de Lebrija",
    ],
    "Rionegro": [
      "Colegio Integrado de Rionegro Santander",
      "Institución Educativa Juan Atalaya Santander",
      "Instituto Técnico Rionegro Santander",
    ],
    "Sabana de Torres": [
      "Institución Educativa Técnica Sabana de Torres",
      "Colegio San Juan Bosco de Sabana de Torres",
      "Colegio Integrado San José Sabana de Torres",
    ],
    "Barbosa": [
      "Colegio Integrado de Barbosa Santander",
      "Instituto Técnico Barbosa Santander",
      "Colegio La Presentación Barbosa Santander",
    ],
    "San Vicente de Chucurí": [
      "Colegio Agrícola de Chucurí",
      "Institución Educativa Técnica San Vicente de Chucurí",
      "Colegio Integrado La Ceiba",
    ],
    "Puerto Wilches": [
      "Institución Educativa Luis Carlos Galán Puerto Wilches",
      "Colegio Integrado Puerto Wilches",
      "Colegio El Centro Puerto Wilches",
    ],
    "Charalá": [
      "Institución Educativa Técnica de Charalá",
      "Escuela Normal Superior de Charalá",
      "Colegio Integrado Charalá",
    ],
    "Barichara": [
      "Colegio Integrado La Presentación de Barichara",
      "Institución Educativa Técnica de Barichara",
    ],
    "Los Santos": [
      "Institución Educativa Técnica Los Santos",
      "Colegio Integrado Los Santos Santander",
    ],
    "Curití": [
      "Institución Educativa Técnica de Curití",
      "Colegio Integrado Alto de Piedad",
    ],
    "Mogotes": [
      "Institución Educativa Técnica de Mogotes",
      "Colegio Integrado Mogotes",
    ],
    "Zapatoca": [
      "Colegio Agropecuario de Zapatoca",
      "Institución Educativa Técnica de Zapatoca",
    ],
    "Puente Nacional": [
      "Instituto Técnico Comercial Puente Nacional",
      "Institución Educativa de Puente Nacional",
    ],
    "Suaita": ["Institución Educativa Técnica de Suaita"],
    "El Playón": ["Institución Educativa Técnica El Playón"],
    "Concepción": ["Institución Educativa Concepción Santander"],
    "Matanza": ["Institución Educativa Técnica de Matanza"],
    "Onzaga": ["Institución Educativa Técnica de Onzaga"],
    "Galán": ["Institución Educativa Técnica de Galán"],
    "California": ["Institución Educativa de California Santander"],
    "Guapotá": ["Institución Educativa de Guapotá"],
    "Palmar": ["Institución Educativa de Palmar Santander"],
    "Pinchote": ["Institución Educativa Técnica de Pinchote"],
    "Valle de San José": ["Institución Educativa Técnica Valle de San José"],
    "San Andrés": ["Institución Educativa San Andrés Santander"],
    "Capitanejo": ["Institución Educativa Técnica de Capitanejo"],
    "Cepitá": ["Institución Educativa de Cepitá"],
    "Albania": ["Institución Educativa de Albania Santander"],
    "Aratoca": ["Institución Educativa Técnica de Aratoca"],
    "Betulia": ["Institución Educativa de Betulia Santander"],
    "Carcasí": ["Institución Educativa de Carcasí"],
    "Cerrito": ["Institución Educativa de Cerrito Santander"],
    "Charta": ["Institución Educativa de Charta"],
    "Chipatá": ["Institución Educativa de Chipatá"],
    "Confines": ["Institución Educativa de Confines"],
    "Contratación": ["Institución Educativa de Contratación"],
    "Coromoro": ["Institución Educativa de Coromoro"],
    "El Guacamayo": ["Institución Educativa El Guacamayo"],
    "El Peñón": ["Institución Educativa El Peñón Santander"],
    "Encino": ["Institución Educativa de Encino"],
    "Enciso": ["Institución Educativa de Enciso"],
    "Florián": ["Institución Educativa de Florián"],
    "Guadalupe": ["Institución Educativa de Guadalupe Santander"],
    "Guaca": ["Institución Educativa de Guaca"],
    "Guavatá": ["Institución Educativa de Guavatá"],
    "Güepsa": ["Institución Educativa de Güepsa"],
    "Hato": ["Institución Educativa de Hato Santander"],
    "Jesús María": ["Institución Educativa de Jesús María"],
    "La Belleza": ["Institución Educativa de La Belleza"],
    "La Paz": ["Institución Educativa de La Paz Santander"],
    "Landázuri": ["Institución Educativa de Landázuri"],
    "Macaravita": ["Institución Educativa de Macaravita"],
    "Molagavita": ["Institución Educativa de Molagavita"],
    "Ocamonte": ["Institución Educativa de Ocamonte"],
    "Oiba": ["Institución Educativa de Oiba"],
    "Páramo": ["Institución Educativa de Páramo Santander"],
    "Sucre": ["Institución Educativa de Sucre Santander"],
    "Suratá": ["Institución Educativa de Suratá"],
    "Tona": ["Institución Educativa de Tona"],
    "Vetas": ["Institución Educativa de Vetas"],
    "Villanueva": ["Institución Educativa de Villanueva Santander"],
    "Bolívar": ["Institución Educativa de Bolívar Santander"],
    "Gámbita": ["Institución Educativa de Gámbita"],
    "Palmas del Socorro": ["Institución Educativa Palmas del Socorro"],
    "San Benito": ["Institución Educativa San Benito Santander"],
    "San Joaquín": ["Institución Educativa de San Joaquín"],
    "San José de Miranda": ["Institución Educativa San José de Miranda"],
    "San Miguel": ["Institución Educativa San Miguel Santander"],
    "Santa Bárbara": ["Institución Educativa Santa Bárbara Santander"],
    "Santa Helena del Opón": ["Institución Educativa Santa Helena del Opón"],
    "Simacota": ["Institución Educativa de Simacota"],
  },

  "Valle del Cauca": {
    "Cali": [
      "INEM Jorge Isaacs","Instituto Técnico Antonio José Camacho",
      "Escuela Normal Superior Farallones de Cali","Colegio Santa Librada",
      "Liceo Departamental","Colegio Berchmans","Colegio San Juan Bosco Cali",
      "Colegio La Presentación Cali","Colegio Colombo Británico",
      "Colegio Alemán de Cali","Colegio Bolívar Cali",
      "Instituto Champagnat Cali","Colegio La Salle Cali",
      "Colegio Palmas Cali","Colegio Salesiano Cali",
      "Institución Educativa Eustaquio Palacios",
      "Institución Educativa Fernando Velasco Parra",
      "Colegio Comercial de Cali","Institución Educativa Multipropósito",
      "Colegio Militar Simón Bolívar","Colegio Santa Inés Cali",
      "Colegio El Calvertino","Colegio La Inmaculada Cali",
      "Institución Educativa Técnica Comercial La Merced",
      "Colegio María Inmaculada Cali",
    ],
    "Palmira": [
      "INEM Jorge Isaacs Palmira","Instituto Técnico Industrial Palmira",
      "Escuela Normal Superior Pedro Antonio Molina",
      "Colegio La Presentación Palmira","Colegio Salesiano Palmira",
      "Instituto Técnico Agroindustrial Palmira",
      "Institución Educativa Técnica Tulio Enrique Tascón",
    ],
    "Buenaventura": [
      "INEM Simón Bolívar Buenaventura","Colegio Multipropósito Buenaventura",
      "Instituto Técnico Distrital Buenaventura",
      "Institución Educativa Pascual de Andagoya",
    ],
    "Tuluá": [
      "INEM Jorge Isaacs Tuluá","Institución Educativa La Inmaculada Tuluá",
      "Colegio Técnico Tuluá","Colegio Salesiano Tuluá",
      "Institución Educativa Rogelio Velásquez",
    ],
    "Buga": [
      "Colegio Academia Militar de Buga","Colegio La Inmaculada Buga",
      "Instituto Técnico de Buga","Colegio Salesiano Buga",
    ],
    "Cartago": [
      "Colegio Lorencita Villegas de Santos Cartago",
      "Instituto Técnico Cartago","Colegio La Salle Cartago",
      "Institución Educativa San Juan Bosco Cartago",
    ],
    "Jamundí": [
      "Institución Educativa Técnica de Jamundí",
      "Colegio Integrado de Jamundí",
    ],
    "Yumbo": [
      "Institución Educativa Técnica de Yumbo",
      "Colegio Integrado Yumbo",
    ],
  },

  "Atlántico": {
    "Barranquilla": [
      "INEM de Barranquilla","Instituto Técnico Distrital de Barranquilla",
      "Escuela Normal Superior La Hacienda","Colegio Karl Parrish",
      "Instituto Colombo Venezolano","Colegio Biffi La Salle",
      "Colegio San José de Barranquilla","Instituto Salesiano Barranquilla",
      "Colegio La Salle Barranquilla","Colegio Americano Barranquilla",
      "Colegio Santo Tomás de Aquino Barranquilla","Colegio Marymount",
      "Colegio Alemán de Barranquilla",
      "Institución Educativa Técnica Olga González Arraut",
      "Colegio La Presentación Barranquilla",
      "Institución Educativa Distrital José Celestino Mutis",
      "Colegio El Rosario Barranquilla",
      "Colegio San Roque Barranquilla",
    ],
    "Soledad": [
      "Institución Educativa Técnica de Soledad",
      "Colegio Juan Acosta Soledad",
      "Institución Educativa Rafael Núñez Soledad",
    ],
    "Malambo": ["Institución Educativa Técnica de Malambo"],
    "Sabanalarga": [
      "Normal Superior de Sabanalarga","Instituto Técnico Sabanalarga",
    ],
    "Galapa": ["Institución Educativa Técnica de Galapa"],
  },

  "Bolívar": {
    "Cartagena": [
      "INEM de Cartagena","Normal Superior de Cartagena",
      "Colegio La Salle Cartagena","Colegio Biffi Cartagena",
      "Instituto Técnico de Cartagena","Colegio Liceo de Bolívar",
      "Institución Educativa Pedro de Heredia",
      "Colegio Jorge Washington Cartagena",
      "Colegio Comfenalco Cartagena","Colegio Los Laureles Cartagena",
      "Institución Educativa La Milagrosa Cartagena",
      "Colegio Santa Ana Cartagena","Colegio San Patricio Cartagena",
    ],
    "Magangué": [
      "INEM de Magangué","Normal Superior de Magangué",
      "Instituto Técnico Magangué","Colegio La Presentación Magangué",
    ],
    "El Carmen de Bolívar": [
      "INEM de El Carmen de Bolívar",
      "Normal Superior El Carmen de Bolívar",
      "Colegio Integrado El Carmen de Bolívar",
    ],
    "Mompós": [
      "Colegio Pinillos de Mompós","Instituto Técnico de Mompós",
      "Normal Superior de Mompós",
    ],
  },

  "Boyacá": {
    "Tunja": [
      "INEM Carlos Arturo Torres Tunja","Instituto Técnico Industrial de Tunja",
      "Escuela Normal Superior Santiago de Tunja","Colegio de Boyacá",
      "Colegio La Presentación Tunja","Colegio Salesiano Juan de Dios Arias",
      "Colegio La Salle Tunja","Instituto Técnico Gonzalo Suárez Rendón",
      "Colegio Santa María Tunja",
    ],
    "Duitama": [
      "INEM de Duitama","Normal Superior de Duitama",
      "Colegio Silvino Rodríguez","Colegio La Presentación Duitama",
      "Instituto Técnico Industrial Duitama","Colegio La Salle Duitama",
    ],
    "Sogamoso": [
      "INEM de Sogamoso","Normal Superior de Sogamoso",
      "Colegio Sugamuxi","Colegio La Presentación Sogamoso",
      "Instituto Técnico Industrial Sogamoso",
    ],
    "Chiquinquirá": [
      "INEM de Chiquinquirá","Normal Superior de Chiquinquirá",
      "Colegio La Salle Chiquinquirá","Colegio La Presentación Chiquinquirá",
    ],
    "Villa de Leyva": [
      "Institución Educativa Técnica Villa de Leyva",
      "Colegio Integrado Villa de Leyva",
    ],
    "Paipa": ["Instituto Técnico de Paipa","Normal Superior de Paipa"],
  },

  "Caldas": {
    "Manizales": [
      "INEM José Celestino Mutis","Escuela Normal Superior de Manizales",
      "Instituto Técnico Nacional de Comercio","Colegio Santa Isabel Manizales",
      "Colegio La Salle Manizales","Colegio San Luis Gonzaga Manizales",
      "Colegio Salesiano de Manizales","Colegio Alemán de Manizales",
      "Instituto Caldas","Colegio La Presentación Manizales",
      "Colegio Champagnat Manizales",
    ],
    "La Dorada": [
      "INEM de La Dorada","Institución Educativa Técnica La Dorada",
      "Colegio La Presentación La Dorada",
    ],
    "Chinchiná": [
      "Institución Educativa Técnica Chinchiná","Colegio La Salle Chinchiná",
    ],
    "Riosucio": ["Normal Superior de Riosucio","Instituto Técnico Riosucio"],
  },

  "Risaralda": {
    "Pereira": [
      "INEM Felipe Pérez","Escuela Normal Superior El Jardín",
      "Instituto Técnico Superior Pereira","Colegio La Salle Pereira",
      "Colegio Salesiano Pereira","Colegio Deogracias Cardona",
      "Colegio Cooperativo de Pereira","Colegio La Presentación Pereira",
      "Colegio Champagnat Pereira","Instituto Técnico Marillac",
      "Instituto Industrial de Pereira","Colegio Alemán de Pereira",
    ],
    "Dosquebradas": [
      "Instituto Técnico de Dosquebradas",
      "Institución Educativa Las Américas Dosquebradas",
      "Colegio La Salle Dosquebradas",
    ],
    "Santa Rosa de Cabal": [
      "Normal Superior de Santa Rosa de Cabal",
      "Instituto Técnico Santa Rosa de Cabal",
      "Colegio La Presentación Santa Rosa de Cabal",
    ],
    "La Virginia": [
      "Institución Educativa Técnica de La Virginia",
    ],
  },

  "Quindío": {
    "Armenia": [
      "INEM Gabriel García Márquez","Escuela Normal Superior de Armenia",
      "Instituto Técnico Superior de Armenia","Colegio La Salle Armenia",
      "Colegio Académico de Armenia","Colegio Champagnat Armenia",
      "Colegio La Presentación Armenia",
      "Instituto Técnico Industrial Armenia",
      "Colegio Santa Teresita Armenia",
    ],
    "Calarcá": [
      "Instituto Técnico Industrial de Calarcá",
      "Normal Superior de Calarcá","Colegio La Presentación Calarcá",
    ],
    "Montenegro": ["Colegio Integrado de Montenegro","Colegio Técnico Montenegro"],
    "Quimbaya": ["Instituto Técnico de Quimbaya","Colegio Integrado Quimbaya"],
  },

  "Norte de Santander": {
    "Cúcuta": [
      "INEM Luis Delfín Insuasty Rodríguez","Normal Superior de Cúcuta",
      "Instituto Técnico Lucio Pabón Núñez","Colegio La Salle Cúcuta",
      "Colegio Salesiano Cúcuta","Colegio La Presentación Cúcuta",
      "Colegio Sagrado Corazón de Jesús Cúcuta",
      "Institución Educativa Nacional Antonio Nariño Cúcuta",
      "Institución Educativa Mercedes Ábrego",
      "Colegio Nuestra Señora de Fátima Cúcuta",
      "Instituto Técnico de Comercio Cúcuta",
    ],
    "Pamplona": [
      "Normal Superior Regional de Pamplona",
      "Colegio La Presentación Pamplona",
      "Instituto Técnico Pamplona","Colegio Salesiano Pamplona",
    ],
    "Ocaña": [
      "INEM Francisco de Paula Santander Ocaña",
      "Normal Superior de Ocaña","Instituto Técnico Ocaña",
      "Colegio La Presentación Ocaña",
    ],
    "Villa del Rosario": [
      "Institución Educativa Técnica Villa del Rosario",
      "Colegio Integrado Villa del Rosario",
    ],
  },

  "Tolima": {
    "Ibagué": [
      "INEM Manuel Murillo Toro","Normal Superior de Ibagué",
      "Instituto Técnico Industrial Ibagué","Colegio La Presentación Ibagué",
      "Colegio San Simón","Colegio Champagnat Ibagué",
      "Colegio La Salle Ibagué","Colegio Salesiano Ibagué",
      "Instituto Técnico Comercial Ibagué",
      "Institución Educativa Técnica San Isidoro",
    ],
    "Espinal": [
      "INEM de Espinal","Instituto Técnico El Espinal","Normal Superior de Espinal",
    ],
    "Honda": ["Colegio Integrado de Honda","Normal Superior de Honda"],
    "Melgar": ["Institución Educativa Técnica de Melgar"],
    "Líbano": ["Instituto Técnico Superior El Líbano","Normal Superior El Líbano"],
  },

  "Huila": {
    "Neiva": [
      "INEM Julián Motta Salas","Normal Superior de Neiva",
      "Instituto Técnico Industrial Neiva","Colegio La Presentación Neiva",
      "Colegio San Francisco de Asís Neiva","Institución Educativa La Gaitana",
      "Colegio Salesiano Neiva","Colegio La Salle Neiva",
      "Instituto Técnico Comercial Neiva",
    ],
    "Pitalito": [
      "Colegio Integrado de Pitalito","Normal Superior de Pitalito",
      "Instituto Técnico Pitalito",
    ],
    "Garzón": ["INEM Garzón","Normal Superior de Garzón","Instituto Técnico Garzón"],
    "La Plata": ["Institución Educativa Técnica La Plata","Normal Superior La Plata"],
  },

  "Nariño": {
    "Pasto": [
      "INEM Ciudad de Pasto","Liceo de Nariño","Normal Superior de Pasto",
      "Instituto Técnico Industrial de Pasto","Colegio La Presentación Pasto",
      "Colegio San Francisco de Asís Pasto","Instituto Champagnat Pasto",
      "Colegio Salesiano Juan Bosco Pasto","Colegio La Salle Pasto",
      "Colegio Santa María Goretti Pasto",
    ],
    "Tumaco": [
      "Normal Superior La Inmaculada de Tumaco",
      "Instituto Técnico de Tumaco","Colegio Técnico Tumaco",
    ],
    "Ipiales": [
      "Normal Superior de Ipiales","Instituto Técnico Ipiales",
      "Colegio La Presentación Ipiales",
    ],
    "Túquerres": [
      "Institución Educativa Técnica de Túquerres",
      "Normal Superior de Túquerres",
    ],
  },

  "Meta": {
    "Villavicencio": [
      "INEM Hugo J. Bermúdez","Normal Superior de Villavicencio",
      "Colegio La Presentación Villavicencio",
      "Instituto Técnico Industrial Villavicencio",
      "Colegio La Salle Villavicencio","Colegio Champagnat Villavicencio",
      "Colegio San Luis Gonzaga Villavicencio",
      "Colegio Salesiano Villavicencio",
      "Instituto Técnico de Comercio Villavicencio",
    ],
    "Acacías": ["Colegio Integrado de Acacías","Instituto Técnico Acacías"],
    "Granada": ["Colegio Integrado de Granada Meta","Instituto Técnico Granada Meta"],
    "Puerto López": ["Institución Educativa Técnica Puerto López"],
  },

  "Cauca": {
    "Popayán": [
      "INEM de Popayán","Normal Superior de Popayán",
      "Instituto Técnico Industrial Popayán",
      "Colegio Champagnat Popayán","Colegio La Salle Popayán",
      "Colegio La Presentación Popayán","Colegio Salesiano Popayán",
      "Liceo Departamental Popayán",
    ],
    "Santander de Quilichao": [
      "Colegio Técnico de Quilichao",
      "Institución Educativa Normal Superior Quilichao",
      "Colegio La Presentación Quilichao",
    ],
    "Puerto Tejada": ["Institución Educativa Técnica Puerto Tejada"],
  },

  "Córdoba": {
    "Montería": [
      "INEM Lorenzo Alcantuz Henao","Normal Superior de Montería",
      "Instituto Técnico Industrial Montería","Colegio La Presentación Montería",
      "Colegio San José Montería","Colegio La Salle Montería",
      "Colegio Salesiano Montería",
    ],
    "Tierralta": ["Normal Superior de Tierralta","Instituto Técnico Tierralta"],
    "Sahagún": ["Normal Superior de Sahagún","Instituto Técnico Sahagún"],
    "Cereté": ["Institución Educativa Técnica de Cereté","Normal Superior Cereté"],
    "Lorica": ["Institución Educativa Técnica de Lorica","Normal Superior Lorica"],
  },

  "Cesar": {
    "Valledupar": [
      "INEM José Eugenio Martínez","Normal Superior de Valledupar",
      "Instituto Técnico Industrial Valledupar",
      "Colegio La Presentación Valledupar",
      "Colegio Alfonso López Pumarejo Valledupar",
      "Colegio Loperena Valledupar","Colegio La Salle Valledupar",
    ],
    "Aguachica": ["Colegio Integrado de Aguachica","Normal Superior de Aguachica"],
    "Bosconia": ["Institución Educativa Técnica de Bosconia"],
  },

  "Magdalena": {
    "Santa Marta": [
      "INEM Simón Bolívar Santa Marta","Normal Superior de Santa Marta",
      "Instituto Técnico Industrial Santa Marta",
      "Colegio La Presentación Santa Marta","Colegio Liceo Celedón",
      "Colegio La Salle Santa Marta",
    ],
    "Ciénaga": ["Colegio Integrado de Ciénaga","Normal Superior Ciénaga"],
    "Fundación": ["Normal Superior de Fundación","Instituto Técnico Fundación"],
  },

  "La Guajira": {
    "Riohacha": [
      "Normal Superior de Riohacha","Instituto Técnico Industrial Riohacha",
      "Institución Educativa Divina Pastora",
      "Colegio La Presentación Riohacha",
    ],
    "Maicao": ["Normal Superior de Maicao","Institución Educativa Técnica Maicao"],
    "Fonseca": ["Institución Educativa Técnica de Fonseca"],
  },

  "Sucre": {
    "Sincelejo": [
      "Normal Superior de Sincelejo","Instituto Técnico Industrial Sincelejo",
      "Colegio La Presentación Sincelejo",
      "Institución Educativa Camilo Torres Sincelejo",
      "Colegio La Salle Sincelejo",
    ],
    "Corozal": ["Normal Superior de Corozal","Instituto Técnico Corozal"],
    "San Marcos": ["Institución Educativa Técnica de San Marcos"],
  },

  "Chocó": {
    "Quibdó": [
      "Normal Superior Manuel Cañizales","Instituto Técnico Industrial Quibdó",
      "Colegio Integrado de Quibdó","Colegio La Salle Quibdó",
    ],
  },

  "Caquetá": {
    "Florencia": [
      "Normal Superior de Florencia","Instituto Técnico Industrial Florencia",
      "Colegio La Presentación Florencia","Colegio La Salle Florencia",
    ],
    "San Vicente del Caguán": ["Institución Educativa Técnica San Vicente del Caguán"],
  },

  "Arauca": {
    "Arauca": [
      "Normal Superior de Arauca","Instituto Técnico Industrial Arauca",
      "Institución Educativa Técnica Arauca","Colegio La Presentación Arauca",
    ],
    "Saravena": ["Institución Educativa Técnica de Saravena"],
    "Tame": ["Institución Educativa Técnica de Tame"],
  },

  "Casanare": {
    "Yopal": [
      "Normal Superior de Yopal","Instituto Técnico Industrial Yopal",
      "Colegio Integrado de Yopal","Colegio La Presentación Yopal",
    ],
    "Aguazul": ["Institución Educativa Técnica Aguazul"],
    "Villanueva": ["Institución Educativa Técnica de Villanueva Casanare"],
  },

  "Putumayo": {
    "Mocoa": [
      "Normal Superior de Mocoa","Instituto Técnico Industrial Mocoa",
      "Colegio La Presentación Mocoa",
    ],
    "Puerto Asís": ["Colegio Integrado de Puerto Asís","Instituto Técnico Puerto Asís"],
  },

  "Amazonas": {
    "Leticia": [
      "Normal Superior de Leticia","Instituto Técnico Industrial Leticia",
    ],
  },

  "San Andrés y Providencia": {
    "San Andrés": [
      "Normal Superior de San Andrés","Colegio Técnico de San Andrés",
      "Colegio Bautista de San Andrés","Colegio La Sagrada Familia San Andrés",
      "Instituto Técnico de San Andrés",
    ],
  },
};

export function getSchools(department: string, city: string): string[] {
  return COLOMBIA_SCHOOLS[department]?.[city] ?? [];
}

export function searchSchools(
  query: string,
  department?: string,
  city?: string,
  limit = 30
): Array<{ name: string; city: string; department: string }> {
  const norm = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const q = norm(query.trim());
  const results: Array<{ name: string; city: string; department: string }> = [];
  const depts = department ? [department] : Object.keys(COLOMBIA_SCHOOLS);
  for (const dept of depts) {
    const deptData = COLOMBIA_SCHOOLS[dept];
    if (!deptData) continue;
    const cities = city ? [city] : Object.keys(deptData);
    for (const c of cities) {
      for (const school of (deptData[c] ?? [])) {
        if (!q || norm(school).includes(q)) {
          results.push({ name: school, city: c, department: dept });
          if (results.length >= limit) return results;
        }
      }
    }
  }
  return results;
}