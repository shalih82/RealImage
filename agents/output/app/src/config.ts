export interface SiteConfig {
  language: string
  siteTitle: string
  siteDescription: string
}

export interface NavLink {
  label: string
  targetId: string
}

export interface NavigationConfig {
  brandMark: string
  links: NavLink[]
}

export interface HeroConfig {
  wordmarkText: string
  eyebrow: string
  titleLine1: string
  titleLine2: string
  descriptionLine1: string
  descriptionLine2: string
  ctaText: string
  ctaTargetId: string
}



export interface ProjectMeta {
  label: string
  value: string
}

export interface ProjectData {
  id: string
  title: string
  location?: string
  year: string
  image: string
  subtitle: string
  meta: ProjectMeta[]
  paragraphs: string[]
}

export interface GalleryConfig {
  sectionLabel: string
  title: string
  projects: ProjectData[]
}

export interface MediumItem {
  cn: string
  en: string
  description: string
}

export interface MediumsConfig {
  sectionLabel: string
  items: MediumItem[]
}

export interface FooterEntry {
  text: string
  href?: string
}

export interface FooterColumn {
  heading: string
  entries: FooterEntry[]
}

export interface FooterConfig {
  visionText: string
  brandName: string
  columns: FooterColumn[]
  copyright: string
  videoPath: string
}

export interface ProjectDetailConfig {
  backLabel: string
}

export interface ServiceItem {
  icon: string
  title: string
  tag: string
  description: string
  features: string[]
  startingPrice?: string
}

export interface ServicesPageConfig {
  eyebrow: string
  title: string
  subtitle: string
  services: ServiceItem[]
  cta: {
    heading: string
    subheading: string
    buttonText: string
  }
}

export interface ContactDetail {
  label: string
  value: string
  href?: string
}

export interface SelectOption {
  label: string
  value: string
}

export interface ContactPageConfig {
  eyebrow: string
  title: string
  subtitle: string
  formLabel: string
  availabilityText: string
  submitLabel: string
  details: ContactDetail[]
  serviceOptions: SelectOption[]
  budgetOptions: SelectOption[]
  webhookUrl?: string
  successMessage: {
    title: string
    body: string
  }
}

export interface PhilosophyConfig {
  eyebrow: string
  title: string
  body: string
  rollingWords: string[]
}

export const siteConfig: SiteConfig = {
  language: "en",
  siteTitle: "RealImage Photography | Wedding Photography & Films",
  siteDescription: "Premium wedding photography and videography services. Pre-wedding, traditional, candid, cinematic films, albums and more. Capturing love stories with timeless elegance.",
}

export const navigationConfig: NavigationConfig = {
  brandMark: "RI",
  links: [
    { label: "Home", targetId: "hero-section" },
    { label: "About", targetId: "about" },
    { label: "Services", targetId: "services" },
    { label: "Gallery", targetId: "gallery" },
    { label: "Contact", targetId: "footer" },
  ],
}


export const heroConfig: HeroConfig = {
  wordmarkText: "REALIMAGE",
  eyebrow: "WEDDING PHOTOGRAPHY & FILMS",
  titleLine1: "Capturing",
  titleLine2: "Love Stories",
  descriptionLine1: "Artistic wedding photography and cinematic",
  descriptionLine2: "films that immortalize your special day.",
  ctaText: "View Works",
  ctaTargetId: "gallery",
}


export const galleryConfig: GalleryConfig = {
  sectionLabel: "FEATURED WORKS",
  title: "Selected Stories",
  projects: [
    {
      id: "pre-wedding",
      title: "Pre-Wedding",
      year: "2024",
      image: "images/project-1.jpg",
      subtitle: "A golden hour romance in the wildflower fields of Rajasthan.",
      meta: [
        { label: "TYPE", value: "Pre-Wedding Photography" },
        { label: "STYLE", value: "Editorial / Cinematic" },
      ],
      paragraphs: [
        "The pre-wedding session was set against the breathtaking backdrop of Jaipur's countryside during the golden hour. The couple, deeply in love and completely at ease, moved through fields of wildflowers as the setting sun painted everything in warm amber tones.",
        "We approached this shoot with an editorial fashion sensibility, combining natural candid moments with carefully composed portraits. The flowing gown caught the breeze, creating movement and drama in every frame.",
        "The resulting images capture not just the couple's beauty, but the feeling of that perfect evening — the warmth of the light, the fragrance of the flowers, and the quiet intimacy of two people beginning their journey together.",
      ],
      location: ""
    },
    {
      id: "traditional",
      title: "Traditional",
      year: "2024",
      image: "images/project-2.jpg",
      subtitle: "Sacred rituals beneath the ornate mandap by candlelight.",
      meta: [
        { label: "TYPE", value: "Traditional Wedding" },
        { label: "STYLE", value: "Documentary / Classic" },
      ],
      paragraphs: [
        "This traditional Indian wedding was a three-day celebration of love, family, and cultural heritage. The ceremony took place beneath an exquisitely decorated mandap, with marigold garlands and flickering oil lamps creating an atmosphere of sacred beauty.",
        "Our documentary approach meant we were present for every significant ritual — from the baraat arrival to the pheras around the sacred fire. We worked discreetly, ensuring the sanctity of each moment was preserved while capturing the depth of emotion on display.",
        "The bride's red lehenga, adorned with intricate gold embroidery, glowed in the candlelight. Every detail — from the henna on her hands to the expressions of the elders — was photographed with reverence and artistic precision.",
      ],
      location: ""
    },
    {
      id: "candid",
      title: "Candid",
      year: "2010",
      image: "images/project-3.jpg",
      subtitle: "Genuine laughter and joy in natural window light.",
      meta: [
        { label: "TYPE", value: "Candid Wedding" },
        { label: "STYLE", value: "Photojournalistic" },
      ],
      paragraphs: [
        "The best wedding photographs are often the ones nobody planned. This image of the bride sharing a moment of pure joy with her bridesmaids was captured entirely candidly — no posing, no direction, just genuine emotion unfolding naturally.",
        "We specialize in this photojournalistic approach, staying alert and ready to capture the spontaneous moments that make each wedding unique. The soft window light in the heritage venue created the perfect natural studio.",
        "These candid frames become the most treasured images for our couples — the laughter, the tears, the stolen glances, and the unguarded expressions of love that can never be replicated.",
      ],
      location: ""
    },
    {
      id: "post-wedding",
      title: "Post-Wedding",
      year: "2010",
      image: "images/project-4.jpg",
      subtitle: "A dreamy silhouette against the golden Maldivian sunset.",
      meta: [
        { label: "TYPE", value: "Post-Wedding Photography" },
        { label: "STYLE", value: "Fine Art / Cinematic" },
      ],
      paragraphs: [
        "After the excitement of the wedding day, this post-wedding session in the Maldives offered the couple a chance to slow down and simply be together. The pristine beach and dramatic sunset provided a canvas of unparalleled beauty.",
        "We worked during the 'golden hour' — that magical window when the sun sits low on the horizon, casting everything in warm, diffused light. The resulting silhouettes against the golden sky have an almost painterly quality.",
        "Post-wedding shoots allow for creative freedom that the wedding day itself may not. Without the pressure of schedules and guests, couples can relax, explore stunning locations, and create art that extends their wedding story into a new chapter.",
      ],
      location: ""
    },
    {
      id: "engagement",
      title: "Engagement",
      year: "2024",
      image: "images/project-5.jfif",
      subtitle: "A sparkling ring ceremony amid white and gold florals.",
      meta: [
        { label: "TYPE", value: "Engagement Ceremony" },
        { label: "STYLE", value: "Elegant / Romantic" },
      ],
      paragraphs: [
        "The engagement ceremony unfolded in a lavish Mumbai venue draped in cascading white roses and shimmering gold accents. Every corner was designed to reflect the couple's refined taste and their deep connection.",
        "We captured the electric moment of the ring exchange — the trembling hands, the tears of joy, the thunderous applause of loved ones. The bokeh of fairy lights in the background added a dreamlike quality to each frame.",
        "From the intimate glances shared over champagne to the jubilant group portraits, this engagement album tells the story of a promise made, a future imagined, and a love celebrated by all who witnessed it.",
      ],
      location: ""
    },
    {
      id: "haldi",
      title: "Haldi",
      year: "2023",
      image: "images/project-6.jfif",
      subtitle: "Vibrant turmeric celebrations under a sunlit canopy.",
      meta: [
        { label: "TYPE", value: "Haldi Ceremony" },
        { label: "STYLE", value: "Vibrant / Candid" },
      ],
      paragraphs: [
        "The Haldi ceremony was a riot of colour and emotion, set beneath a beautifully draped canopy in a heritage haveli in Jodhpur. Marigold garlands hung from every pillar as the morning sun filtered through the sheer fabric above.",
        "Family members took turns applying turmeric paste to the bride while traditional folk music played in the background. The laughter was infectious, and the candid moments we captured radiate pure, unscripted joy.",
        "These photographs are among the most vibrant in any wedding album — the golden yellows of the turmeric, the bright smiles, and the warmth of tradition passed down through generations.",
      ],
      location: ""
    },
    {
      id: "reception",
      title: "Reception",
      year: "2024",
      image: "images/project-7.jfif",
      subtitle: "A grand ballroom celebration under crystal chandeliers.",
      meta: [
        { label: "TYPE", value: "Wedding Reception" },
        { label: "STYLE", value: "Cinematic / Dramatic" },
      ],
      paragraphs: [
        "The reception was held in one of Delhi's most prestigious ballrooms — a space of towering ceilings, crystal chandeliers, and dramatic spotlighting that set the stage for an unforgettable evening.",
        "We used the venue's moody blue and gold lighting to create cinematic compositions, capturing the couple's first dance as wisps of theatrical haze caught the light around them. The result feels more like a film still than a photograph.",
        "From the grand entrance to the last dance of the night, every moment was photographed with an eye for storytelling — the toasts, the emotional speeches, the stolen kisses, and the unbridled celebration of two families becoming one.",
      ],
      location: ""
    },
    {
      id: "destination",
      title: "Destination",
      year: "2023",
      image: "images/project-8.jfif",
      subtitle: "An intimate mountain ceremony amid misty green valleys.",
      meta: [
        { label: "TYPE", value: "Destination Wedding" },
        { label: "STYLE", value: "Fine Art / Landscape" },
      ],
      paragraphs: [
        "Perched on a cliff overlooking the misty tea plantations of Munnar, this destination wedding was a celebration of nature's grandeur and intimate love. The couple chose this breathtaking location for its serenity and dramatic vistas.",
        "As rays of sunlight broke through the clouds, we captured the couple silhouetted against the rolling green valleys below. The bride's flowing saree moved with the mountain breeze, creating ethereal compositions.",
        "Destination weddings offer a unique photographic canvas — where the landscape becomes as much a character in the story as the couple themselves. These images blend epic scale with tender intimacy in a way only nature can provide.",
      ],
      location: ""
    },
  ],

}

export const mediumsConfig: MediumsConfig = {
  sectionLabel: "WHAT WE DO",
  items: [
    {
      cn: "Pre",
      en: "WEDDING",
      description: "Artistic pre-wedding sessions in scenic locations. Candid moments, romantic poses, and story-driven shoots that capture your unique chemistry before the big day.",
    },
    {
      cn: "Wed",
      en: "TRADITIONAL",
      description: "Classic posed photography covering all rituals and ceremonies. Timeless compositions with attention to cultural details and family traditions that matter most.",
    },
    {
      cn: "Candid",
      en: "WEDDING",
      description: "Natural, unposed moments captured discreetly. Genuine emotions, spontaneous laughter, and authentic interactions throughout your celebration.",
    },
    {
      cn: "Film",
      en: "CINEMATIC",
      description: "Wedding films crafted with cinematic techniques. Color grading, slow motion, and narrative editing that transforms your day into a mesmerizing visual story.",
    },
    {
      cn: "Post",
      en: "WEDDING",
      description: "Romantic post-wedding shoots in picturesque settings. Extend the magic with dedicated creative sessions after your big day, at locations of your dreams.",
    },
    {
      cn: "Album",
      en: "PRINTS",
      description: "Premium handcrafted albums and fine art prints. Archival-quality materials designed to preserve your cherished memories for a lifetime and beyond.",
    },
    {
      cn: "Event",
      en: "BIRTHDAY",
      description: "Vibrant birthday and celebration photography. From first birthdays to milestone events, capturing joy, festive moments, and the spirit of celebration.",
    },
  ],
}

export const footerConfig: FooterConfig = {
  visionText: "Every wedding is a unique love story waiting to be told. We are committed to delivering exceptional quality, creativity, and technological excellence — ensuring your special day is captured with timeless elegance and unforgettable beauty.",
  brandName: "REALIMAGE",
  columns: [
    {
      heading: "NAVIGATE",
      entries: [
        { text: "Home", href: "#hero-section" },
        { text: "Gallery", href: "#gallery" },
        { text: "Services", href: "#mediums" },
        { text: "Contact", href: "#footer" },
      ],
    },
    {
      heading: "SERVICES",
      entries: [
        { text: "Pre-Wedding" },
        { text: "Wedding Day" },
        { text: "Candid" },
        { text: "Cinematic Films" },
        { text: "Albums & Prints" },
        { text: "Live Streaming" },
      ],
    },
    {
      heading: "CONTACT",
      entries: [
        { text: "+91 99423 68786", href: "tel:+917639938702" },
        { text: "abu22333@gmail.com", href: "mailto:abu22333@gmail.com" },
        { text: "Office Address : 307, 2nd Floor, ", },
        { text: "Dhanamani Complex, " },
        { text: "20-22 Sunnambukkara St, Periyar," },
        { text: "Madurai, Tamil Nadu 625001", href: "https://www.google.com/maps/place/Real+Image+Photography/@9.9151465,78.1134906,19z/data=!3m1!4b1!4m6!3m5!1s0x3b00c581ae443673:0xaff44b4db12d45aa!8m2!3d9.9151452!4d78.1141343!16s%2Fg%2F11c6z073zh?entry=ttu&g_ep=EgoyMDI2MDYyMi4wIKXMDSoASAFQAw%3D%3D" },
      ],
    },
  ],
  copyright: "© 2010 RealImage Photography. All rights reserved.",
  videoPath: "",
}

export const projectDetailConfig: ProjectDetailConfig = {
  backLabel: "← Back",
}

export const servicesPageConfig: ServicesPageConfig = {
  eyebrow: "WHAT WE OFFER",
  title: "Our Services",
  subtitle: "From intimate elopements to grand celebrations, we craft bespoke visual experiences that are as unique as your love story.",
  services: [
    {
      icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 4.875 9 11.25 9 11.25s9-6.375 9-11.25z",
      title: "Pre-Wedding Shoot",
      tag: "Photography",
      description: "Artistic pre-wedding sessions in scenic locations around India and abroad. We create story-driven imagery that captures your unique chemistry before the big day — combining candid spontaneity with deliberate, editorial composition.",
      features: ["1–2 Day Session", "Multiple Looks", "Location Scouting", "Edited Gallery"],
      startingPrice: "₹25,000",
    },
    {
      icon: "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.585 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.989-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316zM16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z",
      title: "Wedding Day Coverage",
      tag: "Photography + Film",
      description: "Full-day documentary coverage of your wedding rituals, ceremonies, and candid moments. Two skilled photographers ensure no moment is missed — from the morning preparations to the final farewell.",
      features: ["Full Day Coverage", "2 Photographers", "All Rituals", "Same-Day Preview"],
      startingPrice: "₹75,000",
    },
    {
      icon: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z",
      title: "Cinematic Wedding Film",
      tag: "Videography",
      description: "Feature-length cinematic films that go beyond the highlight reel. Using cinema-grade cameras, colour grading, and narrative editing, we transform your wedding day into a timeless visual story.",
      features: ["Cinematic Grade", "Drone Footage", "Feature Length", "Trailer Cut"],
      startingPrice: "₹60,000",
    },
    {
      icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
      title: "Post-Wedding Session",
      tag: "Photography",
      description: "Romantic post-wedding shoots at dream destinations — Maldives, Bali, Europe, or anywhere your heart desires. These extended sessions allow complete creative freedom, producing fine-art imagery.",
      features: ["Destination Travel", "Fine Art Style", "Extended Duration", "Prints Included"],
      startingPrice: "₹40,000",
    },
    {
      icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
      title: "Premium Albums & Prints",
      tag: "Products",
      description: "Handcrafted, archival-quality wedding albums and fine art prints. Each album is a bespoke design, printed on museum-grade paper, and bound to last a lifetime and be cherished for generations.",
      features: ["Italian Binding", "Archival Prints", "Bespoke Design", "Lifetime Guarantee"],
      startingPrice: "₹15,000",
    },
    {
      icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z",
      title: "Celebrations & Events",
      tag: "Photography",
      description: "Vibrant photography for birthdays, anniversaries, engagements, and corporate events. We bring the same artistic energy to every celebration, ensuring every milestone is beautifully preserved.",
      features: ["Half/Full Day", "Candid Style", "Quick Delivery", "Online Gallery"],
      startingPrice: "₹12,000",
    },
  ],
  cta: {
    heading: "Ready to Book Your Date?",
    subheading: "Limited dates available for 2010 & 2026 wedding season.",
    buttonText: "Get In Touch",
  },
}

export const philosophyConfig: PhilosophyConfig = {
  eyebrow: "OUR PHILOSOPHY",
  title: "Creating emotional visual stories",
  body: "A handcrafted approach to every wedding story, crafted with care, emotion and cinematic detail.",
  rollingWords: [
    "Love",
    "Light",
    "Motion",
    "Emotion",
    "Story",
    "Memory",
    "Legacy",
    "Connection",
  ],
};

export const contactPageConfig: ContactPageConfig = {
  eyebrow: "GET IN TOUCH",
  title: "Let's Create Something Beautiful",
  subtitle: "We'd love to hear about your love story. Share the details of your special day and we'll get back to you within 24 hours.",
  formLabel: "Enquiry Form",
  availabilityText: "Accepting bookings for 2010 & 2026",
  submitLabel: "Send Enquiry",
  details: [
    { label: "Phone", value: "+91 99423 68786", href: "tel:+917639938702" },
    { label: "Email", value: "abu22333@gmail.com", href: "mailto:abu22333@gmail.com" },
    { label: "Studio", value: "20-22, Dhanamani Complex, 2nd Floor, Office No: 307, Sunnambukkara St, Periyar, Madurai, Tamil Nadu 625001", href: "https://www.google.com/maps/place/Real+Image+Photography/@9.9151465,78.1134906,19z/data=!3m1!4b1!4m6!3m5!1s0x3b00c581ae443673:0xaff44b4db12d45aa!8m2!3d9.9151452!4d78.1141343!16s%2Fg%2F11c6z073zh?entry=ttu&g_ep=EgoyMDI2MDYyMi4wIKXMDSoASAFQAw%3D%3D" },
    { label: "Hours", value: "Mon–Sat, 10 AM – 7 PM IST" },
  ],
  serviceOptions: [
    { label: "Pre-Wedding Shoot", value: "pre-wedding" },
    { label: "Wedding Day Coverage", value: "wedding-day" },
    { label: "Cinematic Wedding Film", value: "film" },
    { label: "Post-Wedding Session", value: "post-wedding" },
    { label: "Premium Albums & Prints", value: "albums" },
    { label: "Celebrations & Events", value: "events" },
    { label: "Full Package (Photo + Film)", value: "full-package" },
  ],
  budgetOptions: [
    { label: "Under ₹50,000", value: "under-50k" },
    { label: "₹50,000 – ₹1,00,000", value: "50k-1l" },
    { label: "₹1,00,000 – ₹2,00,000", value: "1l-2l" },
    { label: "₹2,00,000 – ₹5,00,000", value: "2l-5l" },
    { label: "Above ₹5,00,000", value: "above-5l" },
  ],
  successMessage: {
    title: "Message Received!",
    body: "Thank you for reaching out. We'll review your enquiry and get back to you within 24 hours to discuss your vision.",
  },
  // Optional: set to a webhook or serverless endpoint so submissions are forwarded
  // e.g. Vite env: VITE_ENQUIRY_WEBHOOK and referenced via import.meta.env.VITE_ENQUIRY_WEBHOOK
  webhookUrl: "",
}

export function getProjectById(id: string): ProjectData | undefined {
  return galleryConfig.projects.find((p) => p.id === id)
}
