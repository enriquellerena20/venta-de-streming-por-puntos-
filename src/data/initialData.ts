import { User, Product } from '../types';

export const initialUsers: User[] = [
  {
    id: 'admin-001',
    name: 'Administrador',
    email: 'admin@streamkeys.com',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    points: 999999,
    avatar: '👑',
    createdAt: new Date('2024-01-01'),
    isActive: true
  }
];

export const initialProducts: Product[] = [
  {
    id: 'netflix-basico',
    service: 'Netflix',
    serviceLogo: '🎬',
    planName: 'Básico',
    description: 'Juegos, series y películas; sin publicidad y sin límite',
    features: [
      { text: 'Ver contenido en 1 dispositivo a la vez', included: true },
      { text: 'Reproducción en 720p (HD)', included: true },
      { text: 'Descargar en 1 dispositivo compatible', included: true },
      { text: 'Sin anuncios', included: true },
      { text: 'Acceso a juegos móviles de Netflix', included: true },
      { text: 'Reproducción en 4K + HDR', included: false }
    ],
    price: 200,
    duration: '1 mes',
    color: 'from-red-600 to-red-800',
    isActive: true,
    credentials: [
      { id: 'nf-b-001', email: 'netflix.cuenta1@gmail.com', password: 'Streaming2024!', isAssigned: false },
      { id: 'nf-b-002', email: 'peliseries.nf@outlook.com', password: 'NetflixPremium#1', isAssigned: false }
    ]
  },
  {
    id: 'netflix-estandar',
    service: 'Netflix',
    serviceLogo: '🎬',
    planName: 'Estándar',
    description: 'Series, películas y juegos en Full HD para toda la familia',
    features: [
      { text: 'Ver contenido en 2 dispositivos a la vez', included: true },
      { text: 'Reproducción en 1080p (Full HD)', included: true },
      { text: 'Descargar en 2 dispositivos', included: true },
      { text: 'Sin anuncios', included: true },
      { text: 'Acceso a juegos móviles de Netflix', included: true },
      { text: 'Audio espacial', included: true }
    ],
    price: 350,
    duration: '1 mes',
    color: 'from-red-600 to-red-800',
    isActive: true,
    credentials: [
      { id: 'nf-s-001', email: 'netflix.standard@gmail.com', password: 'StdPass2024!', isAssigned: false }
    ]
  },
  {
    id: 'netflix-premium',
    service: 'Netflix',
    serviceLogo: '🎬',
    planName: 'Premium',
    description: 'La mejor experiencia Netflix con 4K, HDR y Dolby Atmos',
    features: [
      { text: 'Ver contenido en 4 dispositivos a la vez', included: true },
      { text: 'Reproducción en 4K (Ultra HD) + HDR', included: true },
      { text: 'Descargar en 6 dispositivos', included: true },
      { text: 'Audio Dolby Atmos', included: true },
      { text: 'Sin anuncios', included: true },
      { text: 'Netflix Spatial Audio', included: true }
    ],
    price: 500,
    duration: '1 mes',
    color: 'from-red-600 to-red-800',
    isActive: true,
    credentials: [
      { id: 'nf-p-001', email: 'premium4k.netflix@gmail.com', password: 'Ultra4K#2024', isAssigned: false }
    ]
  },
  {
    id: 'hbo-estandar',
    service: 'HBO Max',
    serviceLogo: '🎭',
    planName: 'Estándar',
    description: 'Películas de estreno, series exclusivas y documentales',
    features: [
      { text: 'Streaming en Full HD 1080p', included: true },
      { text: 'Ver en 2 dispositivos a la vez', included: true },
      { text: 'Descargas en 30 dispositivos', included: true },
      { text: 'Contenido exclusivo de HBO', included: true },
      { text: 'Series de DC Comics', included: true },
      { text: 'Estrenos de Warner Bros', included: true }
    ],
    price: 280,
    duration: '1 mes',
    color: 'from-purple-600 to-purple-900',
    isActive: true,
    credentials: [
      { id: 'hbo-s-001', email: 'hbomax.cuenta@gmail.com', password: 'HBOseries2024!', isAssigned: false },
      { id: 'hbo-s-002', email: 'maxstreaming@outlook.com', password: 'Warner#Movies1', isAssigned: false }
    ]
  },
  {
    id: 'hbo-platinum',
    service: 'HBO Max',
    serviceLogo: '🎭',
    planName: 'Platinum',
    description: 'La experiencia completa HBO con 4K Dolby Vision y Atmos',
    features: [
      { text: 'Streaming en 4K Dolby Vision', included: true },
      { text: 'Audio Dolby Atmos', included: true },
      { text: 'Ver en 4 dispositivos a la vez', included: true },
      { text: 'Descargas ilimitadas', included: true },
      { text: 'Todo el contenido HBO, DC y Warner', included: true },
      { text: 'Sin anuncios', included: true }
    ],
    price: 450,
    duration: '1 mes',
    color: 'from-purple-600 to-purple-900',
    isActive: true,
    credentials: [
      { id: 'hbo-p-001', email: 'platinum.hbomax@gmail.com', password: 'Plat4K#HBO24', isAssigned: false }
    ]
  },
  {
    id: 'spotify-individual',
    service: 'Spotify',
    serviceLogo: '🎵',
    planName: 'Individual',
    description: 'Música sin límites, sin anuncios y con descarga offline',
    features: [
      { text: 'Música sin anuncios', included: true },
      { text: 'Escucha sin conexión', included: true },
      { text: 'Reproducción a demanda', included: true },
      { text: 'Calidad de audio alta', included: true },
      { text: 'Letras de canciones', included: true },
      { text: 'Organiza la cola de reproducción', included: true }
    ],
    price: 150,
    duration: '1 mes',
    color: 'from-green-500 to-green-700',
    isActive: true,
    credentials: [
      { id: 'sp-i-001', email: 'spotify.music@gmail.com', password: 'MusicPremium24!', isAssigned: false },
      { id: 'sp-i-002', email: 'beats.spotify@outlook.com', password: 'Spotify#Beats1', isAssigned: false },
      { id: 'sp-i-003', email: 'premium.spot@gmail.com', password: 'NoAds2024Pass', isAssigned: false }
    ]
  },
  {
    id: 'spotify-duo',
    service: 'Spotify',
    serviceLogo: '🎵',
    planName: 'Dúo',
    description: 'Premium para 2 personas que viven juntas',
    features: [
      { text: '2 cuentas Premium', included: true },
      { text: 'Música sin anuncios', included: true },
      { text: 'Escucha sin conexión', included: true },
      { text: 'Duo Mix: playlist para los dos', included: true },
      { text: 'Calidad de audio alta', included: true },
      { text: 'Reproducción a demanda', included: true }
    ],
    price: 220,
    duration: '1 mes',
    color: 'from-green-500 to-green-700',
    isActive: true,
    credentials: [
      { id: 'sp-d-001', email: 'duo.spotify@gmail.com', password: 'DuoMix2024!', isAssigned: false }
    ]
  },
  {
    id: 'disney-estandar',
    service: 'Disney+',
    serviceLogo: '🏰',
    planName: 'Estándar',
    description: 'Disney, Pixar, Marvel, Star Wars y National Geographic',
    features: [
      { text: 'Streaming en Full HD 1080p', included: true },
      { text: 'Ver en 2 dispositivos a la vez', included: true },
      { text: 'Descargas en 10 dispositivos', included: true },
      { text: 'Contenido de Disney, Pixar, Marvel', included: true },
      { text: 'Star Wars completo', included: true },
      { text: 'National Geographic', included: true }
    ],
    price: 250,
    duration: '1 mes',
    color: 'from-blue-600 to-blue-900',
    isActive: true,
    credentials: [
      { id: 'dp-s-001', email: 'disney.magic@gmail.com', password: 'MagicKingdom24!', isAssigned: false },
      { id: 'dp-s-002', email: 'marvel.disney@outlook.com', password: 'Avengers#2024', isAssigned: false }
    ]
  },
  {
    id: 'prime-video',
    service: 'Prime Video',
    serviceLogo: '📦',
    planName: 'Estándar',
    description: 'Miles de películas y series exclusivas de Amazon',
    features: [
      { text: 'Streaming en 4K UHD', included: true },
      { text: 'Audio HDR10+', included: true },
      { text: 'Ver en 3 dispositivos a la vez', included: true },
      { text: 'Descargas disponibles', included: true },
      { text: 'Series Amazon Originals', included: true },
      { text: 'Canales adicionales disponibles', included: true }
    ],
    price: 180,
    duration: '1 mes',
    color: 'from-cyan-500 to-blue-600',
    isActive: true,
    credentials: [
      { id: 'pv-s-001', email: 'prime.video@gmail.com', password: 'AmazonPrime24!', isAssigned: false },
      { id: 'pv-s-002', email: 'streaming.prime@outlook.com', password: 'Original#Prime1', isAssigned: false }
    ]
  },
  {
    id: 'crunchyroll-mega',
    service: 'Crunchyroll',
    serviceLogo: '🍥',
    planName: 'Mega Fan',
    description: 'El mejor anime del mundo sin anuncios y con estrenos',
    features: [
      { text: 'Sin anuncios', included: true },
      { text: 'Toda la biblioteca de anime', included: true },
      { text: 'Nuevos episodios 1 hora después de Japón', included: true },
      { text: 'Ver en 4 dispositivos a la vez', included: true },
      { text: 'Descarga offline', included: true },
      { text: 'Acceso a juegos y eventos', included: true }
    ],
    price: 200,
    duration: '1 mes',
    color: 'from-orange-500 to-orange-700',
    isActive: true,
    credentials: [
      { id: 'cr-m-001', email: 'anime.crunchy@gmail.com', password: 'OtakuPremium24!', isAssigned: false },
      { id: 'cr-m-002', email: 'megafan.cr@outlook.com', password: 'Anime#Mega2024', isAssigned: false }
    ]
  },
  {
    id: 'appletv-plus',
    service: 'Apple TV+',
    serviceLogo: '🍎',
    planName: 'Estándar',
    description: 'Series y películas originales Apple en 4K',
    features: [
      { text: 'Streaming en 4K HDR', included: true },
      { text: 'Audio Dolby Atmos', included: true },
      { text: 'Ver en 6 dispositivos a la vez', included: true },
      { text: 'Compartir con hasta 5 personas', included: true },
      { text: 'Apple Originals exclusivos', included: true },
      { text: 'Sin anuncios', included: true }
    ],
    price: 170,
    duration: '1 mes',
    color: 'from-gray-700 to-gray-900',
    isActive: true,
    credentials: [
      { id: 'atv-s-001', email: 'appletv.premium@gmail.com', password: 'AppleOriginal24!', isAssigned: false }
    ]
  },
  {
    id: 'paramount-estandar',
    service: 'Paramount+',
    serviceLogo: '⭐',
    planName: 'Estándar',
    description: 'Películas de Paramount, CBS, MTV, Nickelodeon y más',
    features: [
      { text: 'Streaming en Full HD', included: true },
      { text: 'Ver en 3 dispositivos a la vez', included: true },
      { text: 'Descargas disponibles', included: true },
      { text: 'CBS, MTV, Comedy Central', included: true },
      { text: 'Nickelodeon completo', included: true },
      { text: 'NFL y Champions League', included: true }
    ],
    price: 190,
    duration: '1 mes',
    color: 'from-blue-500 to-indigo-700',
    isActive: true,
    credentials: [
      { id: 'pp-s-001', email: 'paramount.stream@gmail.com', password: 'MountainTop24!', isAssigned: false },
      { id: 'pp-s-002', email: 'cbs.paramount@outlook.com', password: 'StarTrek#2024', isAssigned: false }
    ]
  }
];
