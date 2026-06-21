export type Specialty = {
  num: string;
  title: string;
  detail: string;
  iconName: "traditional" | "fusion" | "airbrush" | "eyes";
};

export const specialties: Specialty[] = [
  {
    num: "01",
    title: "Traditional Maharashtrian Bridal",
    detail:
      "Nath, gajra, rich red-orange lehenga complements, bold kajal-lined eyes — honoring tradition with refined technique.",
    iconName: "traditional",
  },
  {
    num: "02",
    title: "Contemporary Fusion Bridal",
    detail:
      "Blending Western and traditional elements — dewy skin, smoky champagne eyes, sculpted contouring for the modern bride.",
    iconName: "fusion",
  },
  {
    num: "03",
    title: "Airbrush & HD Technique",
    detail:
      "Weightless, long-lasting coverage that photographs beautifully under any lighting. Built to last 12+ hours.",
    iconName: "airbrush",
  },
  {
    num: "04",
    title: "Eye Artistry & Lashes",
    detail:
      "From subtle winged liner to dramatic cut-crease and layered lash work — the eyes are always my signature.",
    iconName: "eyes",
  },
];
