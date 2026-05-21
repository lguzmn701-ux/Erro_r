import { Challenge, LibraryErrorItem, CommunityPost, Achievement } from "./types";

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "chal_1",
    title: "DICTADURA GEOMÉTRICA",
    description: "Crea tu cartel utilizando única y exclusivamente círculos perfectos y textos gigantes. La simetría está penada.",
    constraints: ["Usar solo círculos", "Prohibidos rectángulos o trazados libres", "Mínimo 3 textos superpuestos"],
    durationMinutes: 5,
    difficulty: "EASY",
    points: 150
  },
  {
    id: "chal_2",
    title: "RESTRICCIÓN BICROMÁTICA",
    description: "Diseña un manifiesto visual de protesta contra lo aburrido. Prohibido usar color negro o fondos grises vacíos.",
    constraints: ["Usar únicamente 2 colores neón", "Prohibido el color negro", "Estilo tipográfico ultra condensado"],
    durationMinutes: 4,
    difficulty: "MEDIUM",
    points: 250
  },
  {
    id: "chal_3",
    title: "OBLIGACIÓN TIPOGRÁFICA",
    description: "No se permiten imágenes, trazados ni formas. Todo el peso de tu composición gráfica debe recaer en palabras cortadas y letras superpuestas.",
    constraints: ["Cero imágenes o formas", "Palabras divididas a la mitad", "Espacios vacíos extremos (>80%)"],
    durationMinutes: 6,
    difficulty: "HARD",
    points: 400
  },
  {
    id: "chal_4",
    title: "CAOS DE PIXELS SORTED",
    description: "Carga la plantilla corporativa más limpia que encuentres y sométela a un desastre magnético CRT de intensidad máxima.",
    constraints: ["Vandalizar la plantilla 'Happy Corp'", "Filtro CRT activo obligatoriamente", "Ningún elemento debe quedar legible"],
    durationMinutes: 3,
    difficulty: "CHAOTIC",
    points: 500
  }
];

export const INITIAL_ERROR_LIBRARY: LibraryErrorItem[] = [
  {
    id: "lib_1",
    title: "Glitch #2991-Colapso Cromatico",
    creator: "VNDL_99",
    description: "Error de compresión PNG severo ocurrido durante el renderizado asíncrono de un poster de rave industrial. La distorsión creó una textura cromática insólita.",
    imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop",
    errorType: "Glitch Art",
    year: "2024",
    likes: 245
  },
  {
    id: "lib_2",
    title: "Xerox Shift - Desfase de Tambor",
    creator: "Copier Rebel",
    description: "Un poster político brutalista escaneado a media impresión levantando físicamente el papel. Genera un estiramiento tipográfico análogo único imposible de imitar limpiamente.",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop",
    errorType: "Misprint",
    year: "1991",
    likes: 412
  },
  {
    id: "lib_3",
    title: "Y2K Memory Leak Buffer Overflow",
    creator: "System Error 404",
    description: "Visualización binaria del colapso del reloj de un procesador industrial de 16 bits. La acumulación de datos crudos creó patrones de bento grid asimétricos.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
    errorType: "Compression Artefact",
    year: "2000",
    likes: 189
  },
  {
    id: "lib_4",
    title: "Mallas Rotas S0",
    creator: "ERROR Labs",
    description: "Renderizado erróneo de malla vectorial 3D en gradiente magenta-ácido. Al eliminar la restricción geométrica, se desvelaron los esqueletos fracturados del dibujo.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    errorType: "Brutalist Chaos",
    year: "2025",
    likes: 350
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach_1",
    title: "VÁN_DALO INICIAL",
    description: "Sube un archivo y aplícale una distorsión glitch de intensidad superior al 80%.",
    unlocked: false,
    badgeCode: "💥"
  },
  {
    id: "ach_2",
    title: "MORT_AL EN LA CUENTA ATRÁS",
    description: "Supera un Reto del modo Limitación antes de que expire el temporizador.",
    unlocked: false,
    badgeCode: "⏱️"
  },
  {
    id: "ach_3",
    title: "OBITUARIO DE LA SIMETRÍA",
    description: "Somete tu composición al análisis del Crítico de Arte IA.",
    unlocked: false,
    badgeCode: "👁️"
  },
  {
    id: "ach_4",
    title: "ANTI_PERFECCIONISTA",
    description: "Activa con éxito el aviso de destrucción para salvar un diseño sobre-editado.",
    unlocked: false,
    badgeCode: "💀"
  },
  {
    id: "ach_5",
    title: "DISEÑADOR DEL CAOS",
    description: "Mezcla con IA dos corrientes artísticas incompatibles y guarda la fórmula.",
    unlocked: false,
    badgeCode: "🌪️"
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post_1",
    user: {
      username: "cyber_punk_88",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      level: 4
    },
    title: "SABOTAJE DEL LOGO DE LA BANQUERA",
    imageUrl: "https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?q=80&w=600&auto=format&fit=crop",
    likes: 54,
    tags: ["XeroxGlitch", "AntiCorporate", "GoldStandard"],
    comments: [
      { id: "c1", user: "heinz_57", text: "Esto le daría un infarto a mi profesor de Behance. Me fascina.", time: "Hace 2h" },
      { id: "c2", user: "cyber_punk_88", text: "¡Esa era la idea exacta hermano! Rompamos todo.", time: "Hace 1h" }
    ],
    createdAt: "Hace 3h"
  },
  {
    id: "post_2",
    user: {
      username: "acid_glitcher",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      level: 7
    },
    title: "DISEÑO SUIZO DESPELLEJADO POR EL SOL",
    imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop",
    likes: 120,
    tags: ["SwissPunk", "NeonYellow", "LayoutDestroyer"],
    comments: [
      { id: "c3", user: "grid_dictator", text: "El uso de la tipografía condensada es brillante.", time: "Hace 5h" }
    ],
    createdAt: "Hace 6h"
  }
];
