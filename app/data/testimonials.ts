export type Testimonial = {
  name: string;
  role: string;
  timeAgo: string;
  text: string;
  color: string;
  source: "google" | "website";
};

export const testimonials: Testimonial[] = [
  {
    name: "Priya Kulkarni",
    role: "Bride",
    timeAgo: "a week ago",
    text: "Rupali tai made me feel like a queen on my wedding day. My skin looked flawless from morning puja to the midnight reception — I got so many compliments. Truly the best in Ahilyanagar!",
    color: "#E91E63",
    source: "google",
  },
  {
    name: "Sneha Deshmukh",
    role: "Sangeet Look",
    timeAgo: "3 weeks ago",
    text: "I was so nervous about my sangeet look but Rupali understood exactly what I wanted just from a few reference photos. She also did my mother and sister — everyone looked stunning.",
    color: "#2196F3",
    source: "website",
  },
  {
    name: "Ananya Pawar",
    role: "Reception Bride",
    timeAgo: "1 month ago",
    text: "Came to Rupali for my reception look and she exceeded every expectation. The airbrush base was incredible — photographs beautifully and didn't budge even after 6 hours.",
    color: "#4CAF50",
    source: "google",
  },
  {
    name: "Pooja Jadhav",
    role: "Bridal Client",
    timeAgo: "2 months ago",
    text: "Rupali genuinely cares about how you feel — not just how you look. She spent extra time on my eye makeup because she could tell I wasn't 100% happy with the first try. That dedication shows in every photo.",
    color: "#FF9800",
    source: "website",
  },
  {
    name: "Rupali Patil",
    role: "Festive Glam",
    timeAgo: "3 months ago",
    text: "Extremely professional service. Rupali takes extreme care of skin preparation before doing makeup. Highly recommend her for bridal makeup in Ahilyanagar!",
    color: "#9C27B0",
    source: "google",
  },
  {
    name: "Meera Joshi",
    role: "Party Makeup",
    timeAgo: "2 weeks ago",
    text: "Loved the subtle yet glamorous look Rupali created for my corporate event. She is quick, professional, and uses premium quality products that suit sensitive skin perfectly.",
    color: "#009688",
    source: "website",
  }
];
