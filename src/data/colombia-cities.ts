// ─────────────────────────────────────────────────────────────────
//  colombia-cities.ts
//  Todos los municipios de Colombia organizados por departamento
//  Fuente: DIVIPOLA - DANE
// ─────────────────────────────────────────────────────────────────

export const COLOMBIA_CITIES: Record<string, string[]> = {

  "Bogotá D.C.": ["Bogotá"],

  "Antioquia": [
    "Medellín","Bello","Itagüí","Envigado","Sabaneta","La Estrella","Copacabana",
    "Girardota","Barbosa","Caldas","Rionegro","Marinilla","El Retiro","Guarne",
    "El Santuario","Donmatías","San Pedro de los Milagros","Santa Rosa de Osos",
    "Yarumal","Caucasia","El Bagre","Zaragoza","Segovia","Puerto Berrío","Puerto Nare",
    "Yondó","Apartadó","Turbo","Chigorodó","Carepa","Mutatá","Necoclí",
    "San Pedro de Urabá","San Juan de Urabá","Vigía del Fuerte","Murindó",
    "Andes","Jericó","Jardín","Fredonia","Venecia","Amagá","Titiribí",
    "La Pintada","Montebello","Santa Bárbara","Tarso","Hispania","Betania",
    "Ciudad Bolívar","Concordia","Betulia","Urrao","Frontino","Dabeiba",
    "Cañasgordas","Anzá","Buriticá","San Jerónimo","Sopetrán",
    "Santa Fe de Antioquia","Ituango","Valdivia","Tarazá","Cáceres",
    "Entrerríos","Belmira","San José de la Montaña","Angostura","Campamento",
    "Amalfi","Cisneros","Maceo","Santo Domingo","San Roque","Yolombó",
    "Caracolí","Vegachí","Yalí","Remedios","San Carlos","San Luis","Cocorná",
    "Granada","San Francisco","Argelia","Nariño","Sonsón","Abejorral",
    "La Ceja","Alejandría","El Peñol","Guatapé","San Rafael","San Vicente",
    "Gómez Plata","Carolina del Príncipe","Anorí","La Unión","Caramanta",
    "Balboa","Pueblorrico","San Cristóbal",
  ],

  "Santander": [
    "Bucaramanga","Floridablanca","Girón","Piedecuesta","Barrancabermeja",
    "San Gil","Socorro","Vélez","Málaga","Barbosa","Lebrija","Zapatoca",
    "Rionegro","Puerto Wilches","Puerto Parra","Sabana de Torres",
    "San Vicente de Chucurí","El Carmen de Chucurí","Betulia","Los Santos",
    "Curití","Charalá","Mogotes","San Joaquín","Encino","Páramo","Gámbita",
    "Aguada","Albania","Aratoca","Barichara","Cabrera","California",
    "Capitanejo","Carcasí","Cepitá","Cerrito","Charta","Chipatá","Cimitarra",
    "Concepción","Confines","Contratación","Coromoro","El Guacamayo",
    "El Peñón","El Playón","Enciso","Florián","Galán","Guaca","Guadalupe",
    "Guapotá","Guavatá","Güepsa","Hato","Jesús María","La Belleza",
    "Landázuri","La Paz","Macaravita","Matanza","Molagavita","Ocamonte",
    "Oiba","Onzaga","Palmar","Palmas del Socorro","Pinchote","Puente Nacional",
    "San Andrés","San Benito","San José de Miranda","San Miguel",
    "Santa Bárbara","Santa Helena del Opón","Simacota","Suaita","Sucre",
    "Suratá","Tona","Valle de San José","Vetas","Villanueva","Bolívar","Jordán",
  ],

  "Valle del Cauca": [
    "Cali","Buenaventura","Palmira","Tuluá","Buga","Cartago","Jamundí",
    "Yumbo","Candelaria","Pradera","Florida","Ginebra","Guacarí","El Cerrito",
    "Sevilla","Caicedonia","Alcalá","Ulloa","Ansermanuevo","El Águila",
    "El Cairo","Versalles","La Victoria","Obando","Toro","Roldanillo",
    "Bolívar","La Unión","Riofrío","Trujillo","Dagua","La Cumbre","Vijes",
    "Yotoco","Restrepo","El Dovio","Argelia","Calima","Bugalagrande",
    "Andalucía","Buga","Guacarí","La Victoria","Zarzal","Argelia",
  ],

  "Atlántico": [
    "Barranquilla","Soledad","Malambo","Sabanalarga","Galapa","Puerto Colombia",
    "Baranoa","Sabanagrande","Santo Tomás","Palmar de Varela","Ponedera",
    "Polonuevo","Usiacurí","Juan de Acosta","Piojó","Tubará","Repelón",
    "Manatí","Candelaria","Campo de la Cruz","Suan","Santa Lucía","Luruaco",
  ],

  "Bolívar": [
    "Cartagena","Magangué","El Carmen de Bolívar","Mompós","Turbaco",
    "Arjona","San Juan Nepomuceno","Zambrano","San Estanislao","Villanueva",
    "Santa Rosa","Clemencia","Santa Catalina","Luruaco","Calamar","Mahates",
    "San Jacinto","Talaigua Nuevo","Pinillos","Barranco de Loba",
    "San Martín de Loba","Hatillo de Loba","Margarita","San Fernando",
    "Morales","Achí","Montecristo","Tiquisio","Regidor","Río Viejo",
    "Altos del Rosario","Cantagallo","San Pablo","Santa Rosa del Sur",
    "Simití","Córdoba","El Guamo","Norosí",
  ],

  "Boyacá": [
    "Tunja","Duitama","Sogamoso","Chiquinquirá","Paipa","Moniquirá","Ramiriquí",
    "Villa de Leyva","Soatá","Guateque","Miraflores","Puerto Boyacá","Garagoa",
    "Jenesano","Tibaná","Úmbita","Chivor","Macanal","Tenza","Guayatá","Almeida",
    "La Capilla","Zetaquira","Aquitania","Cuitiva","Iza","Tota","Firavitoba",
    "Pesca","Tópaga","Mongua","Gameza","Floresta","Betéitiva","Paz de Río",
    "Belén","Cerinza","Corrales","Nobsa","Tibasosa","Cómbita","Cucaita",
    "Samacá","Ráquira","Sáchica","San Miguel de Sema","Briceño","Caldas",
    "Chíquiza","Motavita","Oicatá","Siachoque","Soracá","Toca","Viracachá",
    "Boyacá","Ciénega","Nuevo Colón","Rondón","Ventaquemada","Turmequé",
    "Guacamayas","Güicán","El Cocuy","Chiscas","El Espino","Panqueba",
    "La Uvita","Susacón","Socotá","Tipacoque","Covarachía","Boavita",
    "La Victoria","Buenavista","Chita","El Espino","Jericó","Labranzagrande",
    "Pajarito","Pisba","Santa María","Tasco",
  ],

  "Caldas": [
    "Manizales","Villamaría","Chinchiná","Palestina","Neira","Salamina",
    "Aguadas","Pácora","Filadelfia","La Merced","Manzanares","Pensilvania",
    "Marquetalia","Marulanda","La Dorada","Victoria","Samaná","Norcasia",
    "Anserma","Viterbo","Risaralda","Belalcázar","San José","Supía",
    "Riosucio","Marmato","Aranzazu","Líbano","Olivares",
  ],

  "Risaralda": [
    "Pereira","Dosquebradas","Santa Rosa de Cabal","La Virginia","Marsella",
    "Balboa","La Celia","Santuario","Apía","Belén de Umbría","Quinchía",
    "Guática","Mistrató","Pueblo Rico",
  ],

  "Quindío": [
    "Armenia","Calarcá","Montenegro","Quimbaya","La Tebaida","Filandia",
    "Salento","Pijao","Génova","Buenavista","Circasia","Córdoba",
  ],

  "Norte de Santander": [
    "Cúcuta","Ocaña","Pamplona","Villa del Rosario","Los Patios","El Zulia",
    "Puerto Santander","Tibú","La Esperanza","El Carmen","San Calixto",
    "Hacarí","La Playa","Ábrego","Convención","Teorama","El Tarra","Sardinata",
    "Lourdes","Gramalote","Salazar","Santiago","Ragonvalia","Herrán",
    "Bochalema","Chinácota","Cácota","Mutiscua","Silos","Chitagá",
    "Toledo","Labateca","Arboledas","Cucutilla","Villacaro","Durania",
    "El Tarra","Tibú","Cáchira","San Cayetano","Villa Caro",
  ],

  "Tolima": [
    "Ibagué","Espinal","Melgar","Honda","Líbano","Chaparral","Purificación",
    "Mariquita","Fresno","Lérida","Ambalema","Armero","Guayabal","Falan",
    "Flandes","Coello","Natagaima","Ataco","Planadas","Rioblanco","San Antonio",
    "Ortega","Coyaima","Saldaña","San Luis","Rovira","Dolores","Prado",
    "Suárez","Alpujarra","Cunday","Icononzo","Villarrica","Valle de San José",
    "Roncesvalles","Santa Isabel","Murillo","Herveo","Casabianca","Palocabildo",
    "Anzoátegui","Villahermosa","Cajamarca","Alvarado","Piedras","Venadillo",
  ],

  "Huila": [
    "Neiva","Pitalito","Garzón","La Plata","Campoalegre","Palermo","San Agustín",
    "Isnos","Saladoblanco","Oporapa","La Argentina","Tarqui","Timaná","Suaza",
    "Palestina","Acevedo","Guadalupe","Algeciras","Gigante","El Agrado","Tesalia",
    "Yaguará","Aipe","Villavieja","Baraya","Santa María","Colombia","Hobo",
    "Rivera","Tello","Teruel","Iquira","Nataga","Paicol","La Salina",
  ],

  "Nariño": [
    "Pasto","Tumaco","Ipiales","Túquerres","La Unión","El Tambo","Samaniego",
    "Sandoná","Buesaco","Chachagüí","El Peñol","La Florida","Tangua","Yacuanquer",
    "Consacá","Ancuyá","Linares","Providencia","Ospina","Guaitarilla","Funes",
    "Puerres","Córdoba","Potosí","Cumbal","Cuaspud","Aldana","Contadero",
    "Gualmatán","Iles","Imués","Pupiales","Sapuyes","Mallama","Ricaurte",
    "Cumbitara","Los Andes","La Llanada","El Rosario","Leiva","Policarpa",
    "Sotomayor","Barbacoas","El Charco","La Tola","Magüí Payán","Mosquera",
    "Olaya Herrera","Roberto Payán","Santa Bárbara","Taminango","Belén",
    "San Bernardo","Arboleda","La Cruz","San Lorenzo","San Pablo","Albán",
    "San Pedro de Cartago","Francisco Pizarro","Maguí","Colón",
  ],

  "Meta": [
    "Villavicencio","Acacías","Restrepo","Cumaral","El Dorado","Barranca de Upía",
    "Cabuyaro","San Martín","Granada","San Juan de Arama","Vista Hermosa",
    "La Macarena","Uribe","Mesetas","Puerto Rico","Puerto Lleras",
    "San Luis de Cubarral","Castilla la Nueva","Guamal","El Calvario",
    "Fuente de Oro","Lejanías","Mapiripán","Puerto Concordia","Puerto Gaitán",
    "Puerto López","San Carlos de Guaroa","Cubarral","Cumaralito",
  ],

  "Cauca": [
    "Popayán","Santander de Quilichao","Puerto Tejada","Caloto","Corinto",
    "Miranda","Padilla","Timba","Buenos Aires","Suárez","La Sierra","Rosas",
    "La Vega","Almaguer","Bolívar","Mercaderes","San Sebastián","Santa Rosa",
    "Sotará","El Tambo","Piamonte","Argelia","Balboa","Patía","Cajibío",
    "Piendamó","Timbío","Morales","Páez","Inzá","Toribío","Jambaló","Caldono",
    "Silvia","Totoró","Guapi","López de Micay","Timbiquí","El Bordo",
  ],

  "Córdoba": [
    "Montería","Cereté","Lorica","Sahagún","Montelíbano","Planeta Rica",
    "Tierralta","Ayapel","La Apartada","Buenavista","San Marcos","Ciénaga de Oro",
    "San Carlos","Chinú","Momil","Purísima","San Bernardo del Viento","Moñitos",
    "Los Córdobas","Canalete","Puerto Escondido","San Pelayo","San Antero",
    "Cotorra","Chimá","Pueblo Nuevo","Valencia","Tuchín","Chima",
  ],

  "Cesar": [
    "Valledupar","Aguachica","San Alberto","La Gloria","Gamarra","El Banco",
    "Pelaya","La Jagua de Ibirico","Chiriguaná","Curumaní","El Paso",
    "Becerril","Agustín Codazzi","Manaure","La Paz","San Diego","El Copey",
    "Astrea","Pailitas","Chimichagua","Bosconia","Pueblo Bello","San Martín",
    "González","Río de Oro","Tamalameque","Curumaní","El Roble",
  ],

  "Magdalena": [
    "Santa Marta","Ciénaga","Fundación","El Banco","Plato","Ariguaní",
    "Pivijay","Salamina","Remolino","Sitio Nuevo","Pueblo Viejo","Zona Bananera",
    "Algarrobo","Aracataca","Concordia","El Retén","Nueva Granada","Pedraza",
    "Pijiño del Carmen","San Zenón","Santa Bárbara de Pinto","Tenerife",
    "Cerro de San Antonio","Chivolo","Sabanas de San Ángel","Guamal",
  ],

  "La Guajira": [
    "Riohacha","Maicao","Fonseca","San Juan del Cesar","Villanueva","Albania",
    "Barrancas","Distracción","El Molino","Hatonuevo","La Jagua del Pilar",
    "Manaure","Uribia","Urumita",
  ],

  "Sucre": [
    "Sincelejo","Corozal","San Marcos","Sampués","Majagual","Sucre","Guaranda",
    "San Onofre","Toluviejo","Palmito","Morroa","Galeras","Buenavista",
    "El Roble","Los Palmitos","Ovejas","Chalán","Coloso","La Unión","Sincé",
    "San Benito Abad","Caimito","Coveñas","Santiago de Tolú","San Luis de Sincé",
    "San Pedro","Betulia",
  ],

  "Chocó": [
    "Quibdó","Istmina","Tadó","Condoto","Riosucio","Bagadó","Carmen del Darién",
    "Bahía Solano","Nuquí","Bajo Baudó","Bojayá","El Cantón del San Pablo",
    "El Carmen de Atrato","Juradó","Lloró","Medio Atrato","Medio Baudó",
    "Medio San Juan","Nóvita","Río Iro","Río Quito","San José del Palmar",
    "Sipí","Unguía","Unión Panamericana","Litoral del San Juan",
  ],

  "Caquetá": [
    "Florencia","San Vicente del Caguán","Puerto Rico","El Doncello","El Paujil",
    "La Montañita","Belén de los Andaquíes","Cartagena del Chairá","Curillo",
    "Milán","Morelia","San José del Fragua","Solano","Solita","Valparaíso","Albania",
  ],

  "Putumayo": [
    "Mocoa","Puerto Asís","Orito","Villagarzón","Valle del Guamuez","Puerto Caicedo",
    "Leguízamo","Sibundoy","San Francisco","Colón","Santiago","San Andrés",
    "Puerto Guzmán","La Hormiga",
  ],

  "Arauca": [
    "Arauca","Saravena","Tame","Fortul","Arauquita","Puerto Rondón","Cravo Norte",
  ],

  "Casanare": [
    "Yopal","Aguazul","Villanueva","Tauramena","La Salina","Monterrey","Pore",
    "Trinidad","San Luis de Palenque","Paz de Ariporo","Hato Corozal","Nunchía",
    "Orocué","Recetor","Sabanalarga","Sácama","Támara",
  ],

  "Vichada": [
    "Puerto Carreño","La Primavera","Santa Rosalía","Cumaribo",
  ],

  "Guaviare": [
    "San José del Guaviare","El Retorno","Calamar","Miraflores",
  ],

  "Guainía": [
    "Inírida","Barranco Minas","Mapiripana","San Felipe","Puerto Colombia",
    "La Guadalupe","Cacahual","Pana Pana","Morichal",
  ],

  "Amazonas": [
    "Leticia","Puerto Nariño","El Encanto","La Chorrera","La Pedrera",
    "Mirití-Paraná","Puerto Alegría","Puerto Arica","Puerto Santander","Tarapacá",
  ],

  "Vaupés": [
    "Mitú","Carurú","Taraira","Papunaua","Yavaraté","Pacoa",
  ],

  "San Andrés y Providencia": [
    "San Andrés","Providencia","Santa Catalina",
  ],
};

/** Lista de todos los departamentos */
export const DEPARTMENTS = Object.keys(COLOMBIA_CITIES).sort();

/** Ciudades de un departamento dado, ordenadas */
export function getCities(department: string): string[] {
  return (COLOMBIA_CITIES[department] ?? []).sort();
}