import { Service, Therapist, Coupon, Testimonial, BlogPost, BusinessSettings } from '../types';

export const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: "Aura Luxe Spa & Wellness",
  tagline: "Premier Indian Massage Therapy & Holistic Wellness Sanctuary",
  phone: "+91 98200 12345",
  whatsapp: "+91 98200 12345",
  email: "concierge@auraluxespa.in",
  address: "Plot 42, Bandra Reclamation, Bandra West, Mumbai, Maharashtra 400050",
  city: "Mumbai, Maharashtra",
  workingHours: "Mon - Sun: 09:00 AM - 10:00 PM IST",
  currencySymbol: "₹",
  currencyCode: "INR",
  googleMapsUrl: "https://maps.google.com/?q=Bandra+West+Mumbai",
  facebookUrl: "https://facebook.com/auraluxespa",
  instagramUrl: "https://instagram.com/auraluxespa",
  twitterUrl: "https://twitter.com/auraluxespa",
  smtpConfigured: true,
  maxBookingsPerSlot: 3,
  slotIntervalMinutes: 60,
  autoApproveBookings: true,
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: "srv-1",
    title: "Signature Swedish Relaxation Massage",
    slug: "swedish-relaxation-massage",
    category: "relaxation",
    shortDescription: "Gentle long gliding strokes, kneading, and circular movements to release tension and induce deep mental clarity.",
    fullDescription: "Our Signature Swedish Therapy is meticulously tailored for gentlemen seeking ultimate stress relief. Utilizing organic warm botanical oils and smooth rhythmic strokes, this therapy eases muscle stiffness, improves blood circulation, and promotes deep physical and psychological relaxation.",
    price: 1999,
    originalPrice: 2499,
    durationMinutes: 60,
    benefits: [
      "Eases muscular tension & stiffness",
      "Enhances full-body blood circulation",
      "Reduces cortisol & work-related stress",
      "Promotes deep restorative sleep"
    ],
    includedItems: [
      "Warm essential herbal oil blend",
      "Private steam room session (15 mins)",
      "Complimentary Ayurvedic herbal tea",
      "Custom pressure adjustments"
    ],
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop",
    featured: true,
    active: true,
    rating: 4.9,
    reviewsCount: 128,
    faq: [
      { question: "What pressure is used during Swedish massage?", answer: "Light to medium gentle pressure, completely customized to your personal preference." },
      { question: "Are private showers provided?", answer: "We provide luxury private shower facilities with herbal toiletries before and after every therapy session." }
    ]
  },
  {
    id: "srv-2",
    title: "Deep Tissue Muscle Recovery Therapy",
    slug: "deep-tissue-muscle-recovery",
    category: "deep_tissue",
    shortDescription: "Targeted firm pressure addressing chronic tight knots, postural strain, and deep muscle stiffness.",
    fullDescription: "Designed for active executives, professionals, and fitness enthusiasts. Our certified male therapists use focused elbow, forearm, and thumb pressure to target inner muscle layers, breaking down scar tissue and releasing chronic muscular trigger points.",
    price: 2499,
    originalPrice: 2999,
    durationMinutes: 60,
    benefits: [
      "Releases chronic lower back & neck strain",
      "Breaks down deep muscular adhesions & knots",
      "Improves posture & joint flexibility",
      "Accelerates athletic recovery"
    ],
    includedItems: [
      "Ayurvedic Arnica & Mahanarayan oil balm",
      "Targeted trigger point therapy",
      "Post-massage hydrotherapy shower",
      "Refreshing coconut water hydration"
    ],
    imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1200&auto=format&fit=crop",
    featured: true,
    active: true,
    rating: 5.0,
    reviewsCount: 164,
    faq: [
      { question: "Is Deep Tissue painful?", answer: "You may feel intense release on tight knots, but our therapists maintain open communication to keep it comfortably therapeutic." }
    ]
  },
  {
    id: "srv-3",
    title: "Aromatherapy Stress Relief Massage",
    slug: "aromatherapy-stress-relief",
    category: "relaxation",
    shortDescription: "Harmonious sensory ritual combining customized essential oil elixirs with delicate therapeutic strokes.",
    fullDescription: "Immerse your senses in pure organic botanical extracts. Before treatment, your therapist conducts an olfactory consultation to curate a custom blend of Sandalwood, Lavender, Bergamot, and Vetiver to calm your nervous system.",
    price: 2299,
    originalPrice: 2799,
    durationMinutes: 60,
    benefits: [
      "Balances emotional well-being",
      "Soothes tension headache & fatigue",
      "Nourishes & hydrates dry skin",
      "Calms hyperactive nervous system"
    ],
    includedItems: [
      "Bespoke 100% pure essential oil blend",
      "Warm facial steam compress",
      "Scalp and temple massage",
      "Organic chamomile & green tea infusion"
    ],
    imageUrl: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1200&auto=format&fit=crop",
    featured: true,
    active: true,
    rating: 4.8,
    reviewsCount: 92
  },
  {
    id: "srv-4",
    title: "Balinese Harmony Massage",
    slug: "balinese-harmony-massage",
    category: "relaxation",
    shortDescription: "Traditional Balinese palm pressure, gentle stretches, and warm aromatic oils for holistic balance.",
    fullDescription: "An exotic full-body therapy originating from Bali. Combines long soothing strokes, skin rolling, palm pressing, and gentle joint stretching using warm frangipani and coconut oil to stimulate blood circulation and relieve deep muscle tightness.",
    price: 2499,
    originalPrice: 2999,
    durationMinutes: 60,
    benefits: [
      "Restores body energy meridian flow",
      "Enhances joint range of motion",
      "Relieves deep physical exhaustion",
      "Provides deep emotional relaxation"
    ],
    includedItems: [
      "Warm aromatic Frangipani & Coconut oil",
      "Acupressure palm therapy",
      "Warm towel compress",
      "Fresh coconut water infusion"
    ],
    imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop",
    featured: false,
    active: true,
    rating: 4.9,
    reviewsCount: 88
  },
  {
    id: "srv-5",
    title: "Traditional Thai Body Therapy",
    slug: "traditional-thai-massage",
    category: "specialized",
    shortDescription: "Rhythmic acupressure and yoga-like assisted stretches without oil to increase flexibility and vitality.",
    fullDescription: "Performed on a comfortable floor mat, Traditional Thai Massage incorporates gentle assisted yoga postures, deep muscle compression, and Sen energy line work. It releases energy blockages and dramatically enhances physical flexibility.",
    price: 2299,
    originalPrice: 2799,
    durationMinutes: 60,
    benefits: [
      "Dramatically improves joint flexibility & posture",
      "Releases energy blockages along Sen lines",
      "Alleviates stiffness from prolonged sitting",
      "Energizes body and mind"
    ],
    includedItems: [
      "Loose cotton Thai attire provided",
      "Assisted yoga stretching techniques",
      "Herbal hot compress application",
      "Ginger herbal tea"
    ],
    imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop",
    featured: false,
    active: true,
    rating: 4.8,
    reviewsCount: 104
  },
  {
    id: "srv-6",
    title: "Volcanic Hot Stone Therapy",
    slug: "volcanic-hot-stone-therapy",
    category: "specialized",
    shortDescription: "Heated natural basalt stones melt away deep tension while restoring vital energy flow across muscle groups.",
    fullDescription: "Experience deep penetrating heat with polished volcanic basalt stones heated to optimal therapeutic temperatures. Placed along energy meridians and applied with expert hands, hot stones melt away stubborn muscle tightness effortlessly.",
    price: 2999,
    originalPrice: 3599,
    durationMinutes: 75,
    benefits: [
      "Penetrates deep thermal relief into tight muscles",
      "Accelerates toxins flushing",
      "Promotes profound inner serenity",
      "Improves blood and lymph vessel dilation"
    ],
    includedItems: [
      "Heated basalt stone treatment",
      "Warm essential herbal oils",
      "Foot detox compress",
      "Herbal refreshment tray"
    ],
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
    featured: true,
    active: true,
    rating: 4.9,
    reviewsCount: 110
  },
  {
    id: "srv-7",
    title: "Ayurvedic Abhyanga Massage",
    slug: "ayurvedic-abhyanga-massage",
    category: "ayurvedic",
    shortDescription: "Traditional warm herbal oil massage balancing Vata, Pitta, and Kapha doshas for systemic rejuvenation.",
    fullDescription: "An authentic classical Ayurvedic treatment using warm Medicated Sesame or Kshirabala oil chosen specifically for your body dosha type. Synchronized rhythmic strokes boost lymphatic drainage, strengthen immunity, and nourish tissues deeply.",
    price: 2999,
    originalPrice: 3499,
    durationMinutes: 75,
    benefits: [
      "Balances body doshas & restores vitality",
      "Improves skin tone, muscle strength & longevity",
      "Enhances circulation and flushes bodily ama (toxins)",
      "Reduces fatigue and nervous exhaustion"
    ],
    includedItems: [
      "Dosha analysis & warm medicated oil selection",
      "Traditional Steam Bath (Swedana) access",
      "Herbal body wash (Ubtan)",
      "Warm Kasha tea infusion"
    ],
    imageUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200&auto=format&fit=crop",
    featured: true,
    active: true,
    rating: 5.0,
    reviewsCount: 152
  },
  {
    id: "srv-8",
    title: "Kerala Authentic Herbal Oil Massage",
    slug: "kerala-herbal-oil-massage",
    category: "ayurvedic",
    shortDescription: "Deeply restorative authentic Kerala Panchakarma oil therapy for joint vitality, spinal alignment, and rejuvenation.",
    fullDescription: "Sourced directly from authentic Ayurvedic traditions of Kerala. Using generous quantities of warm Dhanwantharam and Murivenna herbal oils, this classical session releases deep joint stiffness, alleviates sciatica, and rejuvenates the entire body.",
    price: 3199,
    originalPrice: 3899,
    durationMinutes: 90,
    benefits: [
      "Relieves joint pain, arthritis & sciatica",
      "Strengthens spinal cord and skeletal alignment",
      "Deeply nourishes nervous system and brain function",
      "Purifies blood and boosts metabolic vitality"
    ],
    includedItems: [
      "Authentic Kerala Dhanwantharam warm oil",
      "Herbal Kizhi poultice application",
      "Traditional Herbal Steam (Swedana)",
      "Herbal Ayurvedic detox drink"
    ],
    imageUrl: "https://images.unsplash.com/photo-1512290900673-7002030f2524?q=80&w=1200&auto=format&fit=crop",
    featured: true,
    active: true,
    rating: 5.0,
    reviewsCount: 178
  },
  {
    id: "srv-9",
    title: "Head, Neck & Shoulder Decompress",
    slug: "head-neck-shoulder-decompress",
    category: "specialized",
    shortDescription: "Fast-acting intensive therapy focused directly on upper body desk fatigue and posture strain.",
    fullDescription: "Created specifically for busy corporate professionals suffering from computer neck, shoulder stiffness, and tension headaches. High intensity focus on the trapezius, cervical spine, and scalp using warm herbal oils.",
    price: 999,
    originalPrice: 1299,
    durationMinutes: 30,
    benefits: [
      "Instant release of upper body tightness",
      "Relieves office posture strain",
      "Alleviates tension headaches",
      "Fits easily into a busy work schedule"
    ],
    includedItems: [
      "Targeted myofascial release",
      "Warm herbal compress collar",
      "Warm Bramhi oil scalp therapy"
    ],
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop",
    featured: false,
    active: true,
    rating: 4.8,
    reviewsCount: 95
  },
  {
    id: "srv-10",
    title: "Foot Reflexology & Acupressure",
    slug: "foot-reflexology-acupressure",
    category: "specialized",
    shortDescription: "Targeted pressure point therapy on foot soles mapped to internal organ systems and circulatory health.",
    fullDescription: "Rejuvenate tired feet with an aromatic warm foot soak followed by precise reflexology stimulation on nerve endings. Releases accumulated physical fatigue, improves leg circulation, and promotes whole-body equilibrium.",
    price: 1299,
    originalPrice: 1599,
    durationMinutes: 45,
    benefits: [
      "Relieves foot fatigue and swelling",
      "Stimulates internal organ health via reflex points",
      "Improves blood flow in lower limbs",
      "Induces deep peaceful sleep"
    ],
    includedItems: [
      "Warm Dead Sea salt foot soak",
      "Kansa vatki bowl stimulation",
      "Soothing peppermint foot cream"
    ],
    imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1200&auto=format&fit=crop",
    featured: false,
    active: true,
    rating: 4.8,
    reviewsCount: 82
  },
  {
    id: "srv-11",
    title: "Sports & Muscle Recovery Therapy",
    slug: "sports-muscle-recovery",
    category: "deep_tissue",
    shortDescription: "Dynamic stretching, joint mobilization, and firm myofascial release for active modern men.",
    fullDescription: "A specialized therapy engineered to improve athletic range of motion, prevent sports injuries, and restore optimal physical performance. Combines passive joint stretches with targeted percussion strokes.",
    price: 2799,
    originalPrice: 3299,
    durationMinutes: 75,
    benefits: [
      "Increases athletic flexibility & movement",
      "Prevents muscle strain and injury",
      "Flushes out lactic acid post-workout",
      "Soothes hip, hamstring & shoulder tightness"
    ],
    includedItems: [
      "Dynamic PNF stretching techniques",
      "Cooling menthol gel therapy",
      "Electrolyte recovery beverage",
      "Personalized posture consultation"
    ],
    imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop",
    featured: false,
    active: true,
    rating: 4.9,
    reviewsCount: 86
  },
  {
    id: "srv-12",
    title: "Couples & Duo Relaxation Suite",
    slug: "couples-duo-relaxation-suite",
    category: "vip_packages",
    shortDescription: "Side-by-side luxurious massage therapy for two in a private VIP suite with Jacuzzi access.",
    fullDescription: "Share an unforgettable wellness experience with a partner or friend. Enjoy side-by-side customized therapies from two certified therapists in our private couple's suite, followed by Jacuzzi hydrotherapy and gourmet herbal refreshments.",
    price: 3999,
    originalPrice: 4999,
    durationMinutes: 90,
    benefits: [
      "Shared relaxation experience in complete privacy",
      "Customized therapy choice for each guest",
      "Access to private Jacuzzi hydrotherapy lounge",
      "Completely serene VIP atmosphere"
    ],
    includedItems: [
      "Private Duo VIP Suite booking",
      "90-min Massage per person",
      "Private Jacuzzi access (20 mins)",
      "Complimentary champagne or fresh juice platter"
    ],
    imageUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200&auto=format&fit=crop",
    featured: true,
    active: true,
    rating: 5.0,
    reviewsCount: 140
  },
  {
    id: "srv-13",
    title: "Full Body Scrub & Herbal Polish",
    slug: "full-body-scrub-herbal-polish",
    category: "specialized",
    shortDescription: "Exfoliating organic walnut and neem scrub followed by a hydrating warm oil skin treatment.",
    fullDescription: "Slough off dead skin cells, unclog pores, and restore radiant skin vitality. Our natural botanical polish combines crushed walnut shells, neem, and saffron extracts, finishing with a soothing warm oil hydration massage.",
    price: 2999,
    originalPrice: 3499,
    durationMinutes: 60,
    benefits: [
      "Exfoliates dead skin cells & removes impurities",
      "Unclogs pores and smoothens skin texture",
      "Enhances skin radiance and collagen generation",
      "Leaves body deeply soft and hydrated"
    ],
    includedItems: [
      "Organic Walnut & Neem Scrub",
      "Steam bath shower access",
      "Saffron & Aloe Vera hydration massage"
    ],
    imageUrl: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1200&auto=format&fit=crop",
    featured: false,
    active: true,
    rating: 4.8,
    reviewsCount: 65
  },
  {
    id: "srv-14",
    title: "Stress & Anxiety Relief Therapy",
    slug: "stress-anxiety-relief-therapy",
    category: "relaxation",
    shortDescription: "Calming craniosacral holding, gentle belly breathing, and rhythmic soothing strokes to dissolve mental overload.",
    fullDescription: "Specifically engineered for high-pressure corporate lives. Combines gentle craniosacral neck holds, soothing abdominal massage, and rhythmic full-body gliding strokes to lower cortisol and soothe anxious nervous energy.",
    price: 2199,
    originalPrice: 2699,
    durationMinutes: 60,
    benefits: [
      "Calms hyperactive mind and anxiety",
      "Lowers elevated blood pressure and heart rate",
      "Promotes deep diaphragmatic breathing",
      "Restores inner emotional stability"
    ],
    includedItems: [
      "Frankincense & Lavender aroma infusion",
      "Head and temple acupressure",
      "Guided relaxation breathwork"
    ],
    imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop",
    featured: false,
    active: true,
    rating: 4.9,
    reviewsCount: 79
  },
  {
    id: "srv-15",
    title: "Back Pain & Spine Relief Therapy",
    slug: "back-pain-spine-relief-therapy",
    category: "deep_tissue",
    shortDescription: "Specialized spinal decompression, warm herbal poultice, and lumbar myofascial release for back relief.",
    fullDescription: "Tailored for individuals suffering from chronic lower back aches, lumbar stiffness, or spinal fatigue. Utilizes warm medicated Kizhi herbal poultices and targeted deep lumbar strokes to release nerve impingements and spinal tension.",
    price: 2399,
    originalPrice: 2899,
    durationMinutes: 60,
    benefits: [
      "Relieves lumbar strain and sciatica discomfort",
      "Decompresses spinal discs and muscle spasms",
      "Restores lower back mobility",
      "Alleviates stiffness from driving or desk work"
    ],
    includedItems: [
      "Kattivasthi warm oil reservoir treatment",
      "Herbal Kizhi compression",
      "Spinal posture consultation"
    ],
    imageUrl: "https://images.unsplash.com/photo-1512290900673-7002030f2524?q=80&w=1200&auto=format&fit=crop",
    featured: false,
    active: true,
    rating: 4.9,
    reviewsCount: 112
  },
  {
    id: "srv-16",
    title: "Royal Maharaja VIP Luxury Experience",
    slug: "royal-maharaja-vip-experience",
    category: "vip_packages",
    shortDescription: "The pinnacle of Indian luxury: 2 hours including Abhyanga, Hot Stone, Facial, and Private Jacuzzi Lounge.",
    fullDescription: "Our signature multi-tiered luxury package crafted for discerning gentlemen. Enjoy a private suite with personal Jacuzzi, followed by a customized 90-minute Ayurvedic Abhyanga & Volcanic Hot Stone combo, custom organic saffron facial, and artisan juice service.",
    price: 4999,
    originalPrice: 5999,
    durationMinutes: 120,
    benefits: [
      "Total body, mind and soul transformation",
      "Private luxury Jacuzzi & steam suite",
      "Combines Abhyanga, Hot Stone & Saffron Facial",
      "Unmatched executive privacy"
    ],
    includedItems: [
      "Private VIP Suite reservation",
      "Jacuzzi hydrotherapy (30 mins)",
      "90-min Custom Therapy",
      "Organic Hydrating Saffron Facial",
      "Artisan refreshment & beverage platter"
    ],
    imageUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200&auto=format&fit=crop",
    featured: true,
    active: true,
    rating: 5.0,
    reviewsCount: 205
  }
];

export const INITIAL_THERAPISTS: Therapist[] = [
  {
    id: "th-1",
    name: "Rajesh Sharma",
    title: "Senior Master Therapist & Certified Sports Specialist",
    experienceYears: 10,
    bio: "Certified neuromuscular practitioner specializing in Deep Tissue, Sports recovery, and Volcanic Hot Stone therapy with over 10 years experience catering to high-profile gentlemen in Mumbai.",
    specialties: ["Deep Tissue", "Sports Therapy", "Hot Stone", "Myofascial Release"],
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
    rating: 5.0,
    reviewCount: 142,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    active: true
  },
  {
    id: "th-2",
    name: "Vikram Patel",
    title: "Holistic Wellness & Swedish Relaxation Specialist",
    experienceYears: 8,
    bio: "Renowned for his serene touch and intuitive understanding of tension distribution. Vikram specializes in Swedish, Aromatherapy, and stress alleviation rituals.",
    specialties: ["Swedish Relaxation", "Aromatherapy", "Organic Warm Oil", "Scalp Therapy"],
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 98,
    availableDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    active: true
  },
  {
    id: "th-3",
    name: "Arjun Verma",
    title: "Ayurvedic Doctor & Classical Abhyanga Practitioner",
    experienceYears: 9,
    bio: "Trained in Kerala Panchakarma institutions, Arjun brings authentic classical Abhyanga and Marma point therapy to relieve joint stiffness and restore body balance.",
    specialties: ["Ayurvedic Abhyanga", "Kerala Oil Massage", "Marma Therapy", "Kizhi Poultice"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 115,
    availableDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    active: true
  },
  {
    id: "th-4",
    name: "Sameer Khan",
    title: "VIP Executive Spa Director & Master Bodywork Therapist",
    experienceYears: 12,
    bio: "Former luxury 5-star hotel spa lead therapist specializing in bespoke multi-modality therapies, custom pressure work, and high-end VIP Royal Maharaja wellness rituals.",
    specialties: ["Royal Maharaja VIP Package", "Balinese Massage", "Thai Stretching", "Hot Stone"],
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
    rating: 5.0,
    reviewCount: 186,
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
    active: true
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: "cp-1",
    code: "WELCOME500",
    discountType: "fixed",
    discountValue: 500,
    minBookingAmount: 1999,
    validUntil: "2026-12-31",
    active: true,
    usageCount: 45
  },
  {
    id: "cp-2",
    code: "AURA10",
    discountType: "percentage",
    discountValue: 10,
    minBookingAmount: 1500,
    validUntil: "2026-12-31",
    active: true,
    usageCount: 62
  },
  {
    id: "cp-3",
    code: "MAHARAJA1000",
    discountType: "fixed",
    discountValue: 1000,
    minBookingAmount: 3999,
    validUntil: "2026-12-31",
    active: true,
    usageCount: 18
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "tst-1",
    clientName: "Rahul Sharma",
    role: "Management Consultant, Bandra Mumbai",
    rating: 5,
    comment: "Aura Luxe is in a league of its own. The ambiance is calming, the hygiene is immaculate, and Rajesh gave me the best Deep Tissue massage I've ever had in my life.",
    serviceTitle: "Deep Tissue Muscle Recovery Therapy",
    date: "2 days ago",
    approved: true
  },
  {
    id: "tst-2",
    clientName: "Akash Verma",
    role: "Senior Software Architect, BKC Mumbai",
    rating: 5,
    comment: "Sitting 10 hours a day at my desk left my lower back and neck in terrible pain. Arjun's Kerala Oil therapy completely eliminated my stiffness. Highly recommended!",
    serviceTitle: "Kerala Authentic Herbal Oil Massage",
    date: "1 week ago",
    approved: true
  },
  {
    id: "tst-3",
    clientName: "Vikram Singh",
    role: "Managing Director, Nariman Point",
    rating: 5,
    comment: "The Royal Maharaja VIP package was an extraordinary weekend sanctuary experience. Private Jacuzzi, exceptional service, and complete executive privacy.",
    serviceTitle: "Royal Maharaja VIP Luxury Experience",
    date: "2 weeks ago",
    approved: true
  },
  {
    id: "tst-4",
    clientName: "Rohit Patel",
    role: "Entrepreneur, Powai Mumbai",
    rating: 5,
    comment: "Authentic Ayurvedic Abhyanga massage with genuine herbal oils. The therapists are extremely respectful, professional, and knowledgeable.",
    serviceTitle: "Ayurvedic Abhyanga Massage",
    date: "3 weeks ago",
    approved: true
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: "blg-1",
    title: "The Healing Power of Ayurvedic Abhyanga Massage in Modern Urban Life",
    slug: "healing-power-of-ayurvedic-abhyanga",
    category: "Ayurvedic Wellness",
    author: "Arjun Verma",
    date: "July 24, 2026",
    readTime: "5 min read",
    summary: "Discover how traditional warm oil Abhyanga massage reduces stress hormones, improves joint longevity, and restores physical vitality.",
    content: "In today's fast-paced urban corporate environment, professionals frequently push physical and mental limits. Classical Abhyanga therapy is far more than a luxury indulgence; it is a critical health maintenance system. Classical Ayurvedic texts highlight how daily warm herbal oil friction nourishes body tissues, enhances lymphatic drainage, balances Vata dosha, and promotes deep REM sleep.",
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
    tags: ["Ayurveda", "Abhyanga", "Stress Management", "Mumbai Wellness"],
    published: true
  },
  {
    id: "blg-2",
    title: "Swedish vs Deep Tissue vs Ayurvedic: Which Massage is Right for You?",
    slug: "massage-comparison-guide-india",
    category: "Therapy Guide",
    author: "Vikram Patel",
    date: "July 15, 2026",
    readTime: "4 min read",
    summary: "A comprehensive breakdown comparing techniques, pressure levels, and targeted benefits to help you choose the ideal session.",
    content: "When selecting a therapy session, gentlemen often wonder whether Swedish, Deep Tissue, or Ayurvedic Abhyanga is best suited for their body. Swedish massage uses long, rhythmic gliding strokes to promote fluid circulation. Deep Tissue targets inner muscle fibers to release chronic knots. Ayurvedic Abhyanga uses warm medicated oils to nourish joints and balance body energies.",
    imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&auto=format&fit=crop",
    tags: ["Swedish", "Deep Tissue", "Ayurveda", "Therapy Comparison"],
    published: true
  },
  {
    id: "blg-3",
    title: "Why Kerala Oil Therapy is Essential for Joint Mobility & Back Pain",
    slug: "kerala-oil-therapy-back-pain-relief",
    category: "Ayurvedic Care",
    author: "Rajesh Sharma",
    date: "June 28, 2026",
    readTime: "6 min read",
    summary: "Essential insights on Dhanwantharam oil, herbal Kizhi poultices, and spinal decompression for long-term back health.",
    content: "Dhanwantharam oil and Murivenna from Kerala are world-renowned for their joint-repairing properties. Combined with warm herbal Kizhi compresses, this classical therapy penetrates deep into spinal joints, relaxing muscle spasms and relieving sciatica pain.",
    imageUrl: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=800&auto=format&fit=crop",
    tags: ["Kerala Oil", "Back Pain", "Joint Health"],
    published: true
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: "bk-101",
    bookingNumber: "AURA-84920",
    firstName: "Aman",
    lastName: "Gupta",
    email: "aman.gupta@example.com",
    phone: "+91 98201 55432",
    age: 36,
    gender: "Male",
    serviceId: "srv-2",
    serviceTitle: "Deep Tissue Muscle Recovery Therapy",
    therapistId: "th-1",
    therapistName: "Rajesh Sharma",
    date: "2026-08-02",
    timeSlot: "02:00 PM",
    durationMinutes: 60,
    price: 2499,
    discountAmount: 250,
    totalPaid: 2249,
    couponCode: "AURA10",
    additionalNotes: "Focused pressure on right shoulder blade.",
    paymentMethod: "upi",
    paymentStatus: "completed",
    status: "confirmed",
    createdAt: "2026-08-01T02:15:00Z"
  },
  {
    id: "bk-102",
    bookingNumber: "AURA-84921",
    firstName: "Karan",
    lastName: "Mehta",
    email: "karan.m@example.com",
    phone: "+91 98199 88776",
    age: 42,
    gender: "Male",
    serviceId: "srv-7",
    serviceTitle: "Ayurvedic Abhyanga Massage",
    therapistId: "th-3",
    therapistName: "Arjun Verma",
    date: "2026-08-02",
    timeSlot: "05:00 PM",
    durationMinutes: 75,
    price: 2999,
    discountAmount: 500,
    totalPaid: 2499,
    couponCode: "WELCOME500",
    additionalNotes: "First time client interested in steam bath.",
    paymentMethod: "pay_at_venue",
    paymentStatus: "pending",
    status: "pending",
    createdAt: "2026-08-01T04:20:00Z"
  }
];

export const FAQ_LIST = [
  {
    id: "faq-1",
    category: "general",
    question: "Is Aura Luxe strictly a professional Men-to-Men spa in Mumbai?",
    answer: "Yes. Aura Luxe is an exclusive, licensed professional Men-to-Men massage therapy center located in Bandra West, Mumbai. All our therapists are certified male practitioners dedicated to providing elite therapeutic wellness in an ethical, comfortable, and highly professional environment."
  },
  {
    id: "faq-2",
    category: "booking",
    question: "How do I make an appointment and check therapist availability?",
    answer: "You can easily book online through our real-time interactive booking portal. Select your desired therapy, choose your preferred male therapist, pick an available time slot, and receive instant booking confirmation via email or SMS/WhatsApp."
  },
  {
    id: "faq-3",
    category: "safety",
    question: "What hygiene and sanitation protocols are followed?",
    answer: "We adhere to strict clinical sanitization standards. Every therapy suite, massage bed, and linen is sanitized and disinfected with UV-C technology between every client. Luxury private hot water showers are provided for every guest."
  },
  {
    id: "faq-4",
    category: "booking",
    question: "What payment methods are accepted (UPI, Paytm, Cards)?",
    answer: "We accept all major Indian payment methods including UPI (Google Pay, PhonePe, Paytm, BHIM), NetBanking, Credit/Debit Cards, and Cash at Venue."
  },
  {
    id: "faq-5",
    category: "services",
    question: "What is the difference between Swedish, Deep Tissue, and Ayurvedic Abhyanga?",
    answer: "Swedish massage uses gentle gliding strokes for stress relaxation. Deep Tissue uses firm pressure to break muscular knots and postural strain. Ayurvedic Abhyanga uses warm herbal oils to nourish joints and balance body doshas."
  }
];

export const mockServices = INITIAL_SERVICES;
export const mockTherapists = INITIAL_THERAPISTS;
export const mockTestimonials = INITIAL_TESTIMONIALS;
export const mockBlogs = INITIAL_BLOGS;
export const mockFaqs = FAQ_LIST;
export const mockSettings = DEFAULT_SETTINGS;


