export type PortfolioItem = {
  title: string;
  cat: string;
  image: string;
  desc: string;
  tags: string[];
  images?: string[];
  video?: string;
  details?: {
    client?: string;
    date?: string;
    location?: string;
    role?: string;
    products?: string[];
  };
};

export const items: PortfolioItem[] = [
  {
    title: "Traditional Maharashtrian Bride",
    cat: "bridal",
    image: "/portfolio_maharashtrian_bride.png",
    desc: "Full traditional bridal look — featuring nath, gajra, bold kajal-lined eyes, and a flawless airbrush base that lasted through a 12-hour wedding day.",
    tags: ["Bridal", "Traditional", "Airbrush"],
    images: [
      "/portfolio_maharashtrian_bride.png",
      "/portfolio_fusion_bride.png",
      "/portfolio_reception_glam.png"
    ],
    video: "https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-poses-in-front-of-a-scenic-window-39910-large.mp4",
    details: {
      client: "Priya Deshmukh",
      date: "Nov 2025",
      location: "Ahilyanagar, MH",
      role: "Lead Bridal MUA",
      products: ["Mac Studio Fix", "Anastasia Beverly Hills Pomade", "Estee Lauder Double Wear", "Huda Beauty Nude Palette"],
    }
  },
  {
    title: "Sangeet Night Glam",
    cat: "party",
    image: "/portfolio_sangeet_glam.png",
    desc: "Bold festive glam — electric eye shadow in gold, cut-crease liner, layered lashes, and a warm peachy-bronze lip for the dance floor.",
    tags: ["Party", "Sangeet", "Glam"],
    images: [
      "/portfolio_sangeet_glam.png",
      "/portfolio_reception_glam.png",
      "/portfolio_fashion_editorial.png"
    ],
    video: "https://assets.mixkit.co/videos/preview/mixkit-bride-putting-on-an-earring-40540-large.mp4",
    details: {
      client: "Rhea Sen",
      date: "Dec 2025",
      location: "Pune, MH",
      role: "MUA & Hair Stylist",
      products: ["Urban Decay All Nighter", "Fenty Beauty Highlighter", "Charlotte Tilbury Flawless Filter", "Nars Lipstick"],
    }
  },
  {
    title: "Fashion Editorial",
    cat: "editorial",
    image: "/portfolio_fashion_editorial.png",
    desc: "Minimalist editorial for a regional fashion magazine — architectural liner, clean skin, and an unexpected metallic rust lip. Shot in Pune.",
    tags: ["Editorial", "Fashion", "Magazine"],
    images: [
      "/portfolio_fashion_editorial.png",
      "/portfolio_navratri_festive.png"
    ],
    details: {
      client: "Style India Magazine",
      date: "Oct 2025",
      location: "Pune Studio, MH",
      role: "Editorial MUA",
      products: ["Kryolan TV Paint Stick", "Make Up For Ever HD Powder", "Pat McGrath Labs Eyeliner", "Dior Lip Glow"],
    }
  },
  {
    title: "Contemporary Fusion Bride",
    cat: "bridal",
    image: "/portfolio_fusion_bride.png",
    desc: "Modern fusion bridal look — dewy skin, smoky champagne eyes, bold burgundy ombré lip, and sculpted contouring with airbrush base.",
    tags: ["Bridal", "Fusion", "Contemporary"],
    images: [
      "/portfolio_fusion_bride.png",
      "/portfolio_reception_glam.png",
      "/portfolio_maharashtrian_bride.png"
    ],
    details: {
      client: "Anjali Sharma",
      date: "Jan 2026",
      location: "Mumbai, MH",
      role: "Chief Makeup Designer",
      products: ["Chanel Les Beiges", "Laura Mercier Translucent Powder", "Tom Ford Shade & Illuminate", "MAC Ruby Woo"],
    }
  },
  {
    title: "Navratri Festive Look",
    cat: "editorial",
    image: "/portfolio_navratri_festive.png",
    desc: "Vibrant colours for a Navratri festive editorial — graphic peacock liner, layered gems, and intense pigment on the lids.",
    tags: ["Editorial", "Festive", "Colourful"],
    images: [
      "/portfolio_navratri_festive.png",
      "/portfolio_fashion_editorial.png"
    ],
    details: {
      client: "Sanskriti Magazine",
      date: "Sep 2025",
      location: "Nashik, MH",
      role: "Creative Director MUA",
      products: ["Inglot Duraline", "Danessa Myricks ColorFix", "NYX Liquid Eyeliner", "Fenty Beauty Gloss Bomb"],
    }
  },
  {
    title: "Reception Night Glam",
    cat: "party",
    image: "/portfolio_reception_glam.png",
    desc: "Polished reception look — flawless HD base, sculpted cheekbones, warm rose-bronze eye, and classic nude-pink lip for banquet lighting.",
    tags: ["Party", "Reception", "HD Makeup"],
    images: [
      "/portfolio_reception_glam.png",
      "/portfolio_sangeet_glam.png"
    ],
    details: {
      client: "Pooja Mehta",
      date: "Feb 2026",
      location: "Ahilyanagar, MH",
      role: "Lead Stylist & MUA",
      products: ["Estee Lauder Double Wear", "Too Faced Born This Way", "Benefit Hoola Bronzer", "MAC Velvet Teddy"],
    }
  },
];

export const filters = ["all", "bridal", "party", "editorial"];
