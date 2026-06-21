"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage, isConfigured } from "../lib/firebase";

// Seeder data templates
import { mainServices } from "../data/services";
import { items as localPortfolioItems } from "../data/portfolio";
import { testimonials as localTestimonials } from "../data/testimonials";
import { specialties as localSpecialties } from "../data/specialties";

// SVGs and Icons matching app design
import { 
  CheckIcon, 
  CloseIcon, 
  Stars, 
  InstagramIcon, 
  WhatsappIcon, 
  PhoneIcon, 
  MailIcon, 
  MapPinIcon 
} from "../components/Icons";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Active Management Tab: 'services' | 'portfolio' | 'content' | 'testimonials'
  const [activeTab, setActiveTab] = useState<"services" | "portfolio" | "content" | "testimonials">("services");
  const [loadingData, setLoadingData] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });
  
  // Mobile navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Seeder Trigger
  const [needsSeeding, setNeedsSeeding] = useState(false);
  
  // Firestore State Collections
  const [services, setServices] = useState<any[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [content, setContent] = useState<any>(null);
  
  // Modals / Item Editors
  const [editingService, setEditingService] = useState<any>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<any>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  
  // Upload States
  const [uploadingImage, setUploadingImage] = useState(false);

  // Check Auth State on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        loadAllData();
      }
    });
    return () => unsubscribe();
  }, []);

  // Load all Firestore collections in parallel to optimize load speed
  const loadAllData = async () => {
    if (!isConfigured) return;
    setLoadingData(true);
    try {
      const [servicesSnap, portfolioSnap, testimonialsSnap, contentDoc] = await Promise.all([
        getDocs(collection(db, "services")),
        getDocs(collection(db, "portfolio")),
        getDocs(collection(db, "testimonials")),
        getDoc(doc(db, "content", "global"))
      ]);

      const servicesList: any[] = [];
      servicesSnap.forEach((doc) => {
        servicesList.push({ id: doc.id, ...doc.data() });
      });
      setServices(servicesList);

      const portfolioList: any[] = [];
      portfolioSnap.forEach((doc) => {
        portfolioList.push({ id: doc.id, ...doc.data() });
      });
      setPortfolioItems(portfolioList);

      const testimonialsList: any[] = [];
      testimonialsSnap.forEach((doc) => {
        testimonialsList.push({ id: doc.id, ...doc.data() });
      });
      setTestimonials(testimonialsList);

      if (contentDoc.exists()) {
        setContent(contentDoc.data());
      } else {
        setContent(null);
      }

      // Check if DB is empty to prompt seeding
      if (servicesList.length === 0 && portfolioList.length === 0) {
        setNeedsSeeding(true);
      } else {
        setNeedsSeeding(false);
      }
    } catch (err: any) {
      console.error("Error loading data: ", err);
      showStatus("error", "Failed to load database. Check Firebase config/rules.");
    } finally {
      setLoadingData(false);
    }
  };

  const showStatus = (type: "success" | "error", message: string) => {
    setSaveStatus({ type, message });
    setTimeout(() => setSaveStatus({ type: "", message: "" }), 5000);
  };

  // Sign In Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-credential") {
        setLoginError("Invalid email or password. Please verify the credentials in your Firebase Console.");
      } else {
        setLoginError(err.message || "An unexpected error occurred during login.");
      }
    }
  };

  // Sign Out Handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Database Seeder
  const seedDatabase = async () => {
    setLoadingData(true);
    try {
      // 1. Seed global copy content
      const defaultContent = {
        hero: {
          badge: "Professional Makeup Artist · Ahilyanagar",
          title: "Your beauty,",
          titleAccent: "my artistry.",
          subtitle: "I'm Rupali — transforming faces and creating unforgettable looks for brides, events, and editorial shoots across Ahilyanagar and Maharashtra. Every face tells a story, and I am here to help you tell yours beautifully.",
          primaryImage: "/hero.png",
          secondaryImage: "/portfolio_maharashtrian_bride.png",
          stats: [
            { value: "500+", label: "Happy Brides" },
            { value: "1200+", label: "Looks Created" },
            { value: "8+", label: "Years Exp" }
          ]
        },
        about: {
          image: "/about.png",
          quote: "Every face is unique — I never do a one-size-fits-all look.",
          subtitle: "A little about me",
          title: "Eight years of making\nwomen feel beautiful",
          paragraphs: [
            "I'm Rupali Shinde, a professional makeup artist based in Ahilyanagar, Maharashtra with over 8 years of experience in bridal, party, and editorial makeup. I trained under some of the finest artists in Pune and Mumbai before bringing my craft home to Ahilyanagar.",
            "I believe every face is unique — which is why I never do a one-size-fits-all look. I take time to understand your skin, your personality, and your vision before I open a single palette."
          ],
          tags: [
            "Certified in HD & Airbrush",
            "Premium international products",
            "Home & venue visits"
          ]
        },
        contact: {
          phone: "+91 98765 43210",
          email: "rupalishinde.mua@gmail.com",
          address: "Ahilyanagar, Maharashtra, India",
          workingHours: "Mon - Sun: 8:00 AM - 8:00 PM",
          whatsappNumber: "919876543210",
          instagram: "https://instagram.com/rupalishinde.mua",
          facebook: "https://facebook.com/"
        },
        specialties: localSpecialties
      };
      
      await setDoc(doc(db, "content", "global"), defaultContent);

      // 2. Seed Services
      for (const service of mainServices) {
        const docRef = doc(collection(db, "services"));
        await setDoc(docRef, service);
      }

      // 3. Seed Portfolio
      for (const item of localPortfolioItems) {
        const docRef = doc(collection(db, "portfolio"));
        await setDoc(docRef, item);
      }

      // 4. Seed Testimonials
      for (const test of localTestimonials) {
        const docRef = doc(collection(db, "testimonials"));
        await setDoc(docRef, test);
      }

      showStatus("success", "Database successfully initialized and seeded!");
      setNeedsSeeding(false);
      loadAllData();
    } catch (err: any) {
      console.error(err);
      showStatus("error", "Error seeding database: " + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  // Image Upload helper
  const handleImageUpload = async (file: File, path: string): Promise<string> => {
    setUploadingImage(true);
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const imageRef = ref(storage, `${path}/${Date.now()}_${cleanName}`);
      const snap = await uploadBytes(imageRef, file);
      const url = await getDownloadURL(snap.ref);
      return url;
    } catch (err: any) {
      console.error("Upload error:", err);
      showStatus("error", "Failed to upload image: " + err.message);
      throw err;
    } finally {
      setUploadingImage(false);
    }
  };

  // ---------------- SERVICES CRUD OPERATIONS ----------------
  const saveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingData(true);
    try {
      const { id, ...data } = editingService;
      if (id) {
        await updateDoc(doc(db, "services", id), data);
        showStatus("success", "Service package updated successfully!");
      } else {
        await addDoc(collection(db, "services"), data);
        showStatus("success", "New service package created successfully!");
      }
      setEditingService(null);
      loadAllData();
    } catch (err: any) {
      showStatus("error", "Failed to save service: " + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setLoadingData(true);
    try {
      await deleteDoc(doc(db, "services", id));
      showStatus("success", "Service package deleted successfully!");
      loadAllData();
    } catch (err: any) {
      showStatus("error", "Failed to delete service: " + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  // ---------------- PORTFOLIO CRUD OPERATIONS ----------------
  const savePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingData(true);
    try {
      const { id, ...data } = editingPortfolio;
      if (id) {
        await updateDoc(doc(db, "portfolio", id), data);
        showStatus("success", "Portfolio look updated successfully!");
      } else {
        await addDoc(collection(db, "portfolio"), data);
        showStatus("success", "New portfolio look created successfully!");
      }
      setEditingPortfolio(null);
      loadAllData();
    } catch (err: any) {
      showStatus("error", "Failed to save portfolio item: " + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  const deletePortfolio = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return;
    setLoadingData(true);
    try {
      await deleteDoc(doc(db, "portfolio", id));
      showStatus("success", "Portfolio look deleted successfully!");
      loadAllData();
    } catch (err: any) {
      showStatus("error", "Failed to delete portfolio item: " + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  // ---------------- TESTIMONIALS CRUD OPERATIONS ----------------
  const saveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingData(true);
    try {
      const { id, ...data } = editingTestimonial;
      if (id) {
        await updateDoc(doc(db, "testimonials", id), data);
        showStatus("success", "Testimonial updated successfully!");
      } else {
        await addDoc(collection(db, "testimonials"), data);
        showStatus("success", "New testimonial created successfully!");
      }
      setEditingTestimonial(null);
      loadAllData();
    } catch (err: any) {
      showStatus("error", "Failed to save testimonial: " + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setLoadingData(true);
    try {
      await deleteDoc(doc(db, "testimonials", id));
      showStatus("success", "Testimonial deleted successfully!");
      loadAllData();
    } catch (err: any) {
      showStatus("error", "Failed to delete testimonial: " + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  // ---------------- GENERAL COPY CRUD OPERATIONS ----------------
  const saveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingData(true);
    try {
      await setDoc(doc(db, "content", "global"), content);
      showStatus("success", "Website copy settings updated successfully!");
      loadAllData();
    } catch (err: any) {
      showStatus("error", "Failed to save content: " + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  // Reusable styled form wrapper - ENHANCED VISIBILITY AND LARGER TEXT
  const FormField = ({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) => (
    <div className="space-y-3">
      <label className="block text-sm md:text-base font-bold uppercase tracking-wider text-stone-700">{label}</label>
      {description && <p className="text-xs md:text-sm text-stone-500 leading-relaxed font-normal">{description}</p>}
      {children}
    </div>
  );

  // Spacious, premium upload dropzone with thumbnail support - ENHANCED & LARGER
  const MediaUploadZone = ({ 
    imageUrl, 
    onUrlChange, 
    folder 
  }: { 
    imageUrl: string; 
    onUrlChange: (url: string) => void; 
    folder: string 
  }) => (
    <div className="space-y-4">
      {imageUrl ? (
        <div className="relative w-full h-64 sm:h-80 rounded-[32px] overflow-hidden border-2 border-amber-600/20 shadow-lg group bg-stone-100/30">
          <Image 
            src={imageUrl} 
            alt="Preview" 
            fill 
            className="object-cover" 
            unoptimized
          />
          <div className="absolute inset-0 bg-stone-950/75 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 p-4">
            <label className="px-6 py-3.5 sm:px-8 sm:py-4.5 bg-white hover:bg-stone-50 text-stone-900 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-widest cursor-pointer shadow-lg transition-all duration-300 hover:scale-105">
              Swap Asset
              <input 
                type="file" 
                accept="image/*"
                className="hidden" 
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await handleImageUpload(file, folder);
                    onUrlChange(url);
                  }
                }}
              />
            </label>
            <button 
              type="button"
              onClick={() => onUrlChange("")}
              className="px-6 py-3.5 sm:px-8 sm:py-4.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-widest shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Delete Image
            </button>
          </div>
        </div>
      ) : (
        <div className="border-[3px] border-dashed border-stone-300 hover:border-amber-600/70 rounded-[32px] p-6 sm:p-12 md:p-16 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer bg-stone-50/70 hover:bg-amber-500/[0.02] group relative shadow-inner">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-amber-700 transition-colors duration-300 mb-4 sm:mb-5 shadow-sm">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xs sm:text-base font-extrabold text-stone-850 uppercase tracking-widest mb-1.5 group-hover:text-amber-800">
            {uploadingImage ? "Uploading Asset..." : "Select or Drop Image Here"}
          </span>
          <span className="text-[10px] sm:text-xs text-stone-400">JPG, PNG, WEBP, or SVG (Max 10MB)</span>
          
          <input 
            type="file" 
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = await handleImageUpload(file, folder);
                onUrlChange(url);
              }
            }}
            disabled={uploadingImage}
          />
        </div>
      )}
    </div>
  );

  // Loading Screen - BIGGER AND MORE LUXURIOUS
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] bg-noise">
        <div className="flex flex-col items-center gap-6">
          <div className="animate-spin-slow w-16 h-16 rounded-full border-[4px] border-t-amber-600 border-amber-600/10" style={{ borderTopColor: "var(--color-gold)", borderStyle: "solid" }} />
          <span className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-amber-900/70" style={{ fontFamily: "var(--font-body)" }}>Authorizing Security Credentials...</span>
        </div>
      </div>
    );
  }

  // Auth/Login View - ELEVATED LUXURY REDESIGN WITH LARGER SIZES
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-6 relative bg-gradient-to-br from-[#FCFAF7] via-[#FAF7F2] to-[#F5ECE2] bg-noise">
        {/* Soft background glow meshes */}
        <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full bg-amber-500/5 filter blur-3xl" />
        <div className="absolute bottom-10 right-10 w-[600px] h-[600px] rounded-full bg-rose-500/5 filter blur-3xl" />
        
        <div className="w-full max-w-[520px] z-10 space-y-10">
          <div className="text-center">
            <span className="font-accent italic text-[24px] text-accent text-gold block mb-2">Rupali Shinde MUA</span>
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-charcoal tracking-tight">Admin Console</h1>
            <div className="section-ornament mx-auto mt-5 w-24 h-0.5 bg-amber-600/30" />
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-[32px] md:rounded-[40px] p-6 md:p-12 border border-stone-300/40 shadow-2xl">
            {!isConfigured && (
              <div className="mb-8 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-800 leading-relaxed shadow-sm">
                <strong>Configuration Required:</strong> Firebase Environment Variables are not configured. Setup `.env.local` first and reload.
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-8">
              <div>
                <label className="block text-xs md:text-sm font-extrabold uppercase tracking-widest text-stone-600 mb-3">Email Address</label>
                <input 
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-6 py-5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all duration-300 font-medium shadow-sm hover:border-stone-400"
                  placeholder="admin@stachandscale.in"
                  required
                  disabled={!isConfigured}
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-extrabold uppercase tracking-widest text-stone-600 mb-3">Password</label>
                <input 
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-6 py-5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all duration-300 font-medium shadow-sm hover:border-stone-400"
                  placeholder="••••••••"
                  required
                  disabled={!isConfigured}
                />
              </div>

              {loginError && (
                <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl text-xs md:text-sm text-rose-700 leading-relaxed">
                  {loginError}
                </div>
              )}

              <button 
                type="submit"
                disabled={!isConfigured}
                className="w-full py-5 rounded-full text-white font-bold text-xs md:text-sm uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, var(--color-charcoal), #2A2520)",
                  cursor: isConfigured ? "pointer" : "not-allowed",
                  opacity: isConfigured ? 1 : 0.5
                }}
              >
                Sign In to Dashboard
              </button>
            </form>
          </div>
          
          <div className="text-center text-sm text-stone-400">
            <a href="/" className="hover:text-amber-600 transition-colors font-medium">← Back to website</a>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- AUTHENTICATED PANEL ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFAF7] via-[#FAF7F2] to-[#F7EFE5] text-stone-900 bg-noise flex flex-col lg:flex-row">
      
      {/* Toast Save Feedback Notifications - RESPONSIVE & PREMIUM */}
      {saveStatus.message && (
        <div 
          className={`fixed top-4 right-4 left-4 sm:left-auto sm:top-8 sm:right-8 z-50 px-6 py-4.5 sm:px-10 sm:py-6 rounded-[20px] sm:rounded-[24px] shadow-2xl border text-xs sm:text-sm font-extrabold uppercase tracking-widest max-w-md transition-all duration-300 animate-slide-in ${
            saveStatus.type === "success" 
              ? "bg-emerald-50 border-emerald-300 text-emerald-800" 
              : "bg-rose-50 border-rose-300 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{saveStatus.type === "success" ? "✓" : "⚠"}</span>
            <span>{saveStatus.message}</span>
          </div>
        </div>
      )}

      {/* Mobile Top Navigation Header */}
      <header className="lg:hidden bg-white border-b border-stone-250/50 px-5 py-4 flex items-center justify-between sticky top-0 z-35 shadow-md">
        <div className="flex flex-col">
          <span className="font-accent italic text-2xl text-amber-700 leading-none" style={{ color: "var(--color-gold)" }}>Rupali Shinde</span>
          <span className="text-[9px] uppercase font-extrabold tracking-widest text-stone-400 mt-1.5">MUA Admin Console</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-stone-100 text-stone-600 px-3 py-1.5 rounded-full border border-stone-200 shadow-sm">
            {activeTab}
          </span>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 hover:bg-stone-105 active:bg-stone-100 rounded-xl transition-all border border-stone-250/70 text-stone-850 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-40 lg:hidden transition-all duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 1. SIDEBAR NAVIGATION SECTION (DRAWER ON MOBILE, FIXED SIDEBAR ON DESKTOP) */}
      <aside className={`fixed inset-y-0 left-0 z-45 w-80 max-w-[85vw] h-full bg-white flex flex-col justify-between border-r border-stone-250/50 shadow-2xl transition-transform duration-300 lg:static lg:w-96 lg:translate-x-0 lg:h-screen lg:z-20 lg:shadow-xl ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div>
          {/* Logo Brand area */}
          <div className="p-8 border-b border-stone-200/30 flex items-center justify-between bg-gradient-to-r from-white to-[#FCFAF7]">
            <div className="flex flex-col">
              <span className="font-accent italic text-3xl leading-none text-amber-700" style={{ color: "var(--color-gold)" }}>Rupali Shinde</span>
              <span className="text-[11px] uppercase font-extrabold tracking-widest text-stone-400 mt-2">Executive Content Manager</span>
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-400" title="Connected to Firestore" />
          </div>

          {/* User Profile info */}
          <div className="px-8 py-5 bg-stone-50/70 border-b border-stone-200/30 flex items-center gap-5">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 border-2 border-amber-600/30 flex items-center justify-center font-extrabold text-base text-amber-800 shadow-sm">
              {user.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-bold text-stone-705 truncate leading-tight">{user.email || "Administrator"}</span>
              <span className="text-[11px] uppercase tracking-widest text-amber-700 font-extrabold mt-1">Admin Panel Account</span>
            </div>
          </div>

          {/* Tab Selection - BIGGER BUTTONS AND DESCRIPTIONS */}
          <nav className="p-6 space-y-3">
            {[
              { id: "services", label: "Services & Packages", count: services.length, desc: "Edit client makeup packages" },
              { id: "portfolio", label: "Portfolio Look Gallery", count: portfolioItems.length, desc: "Manage bridal & event photo collections" },
              { id: "content", label: "Global Page Copy", desc: "Hero segment texts, contact Info & bios" },
              { id: "testimonials", label: "Testimonials & Reviews", count: testimonials.length, desc: "Verify & showcase customer feedback" }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setEditingService(null);
                    setEditingPortfolio(null);
                    setEditingTestimonial(null);
                    setMobileMenuOpen(false); // Close mobile menu drawer on selection
                  }}
                  className={`w-full text-left px-6 py-4.5 rounded-[20px] flex items-center justify-between transition-all duration-300 group cursor-pointer border ${
                    isActive 
                      ? "bg-stone-900 border-stone-950 text-white shadow-xl shadow-stone-900/10" 
                      : "bg-white hover:bg-stone-50 border-stone-200/70 hover:border-stone-300 text-stone-600 hover:text-stone-900 shadow-sm"
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">{tab.label}</span>
                    <span className={`text-[11px] truncate mt-1 ${isActive ? "text-stone-400" : "text-stone-400 group-hover:text-stone-500"}`}>{tab.desc}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full shrink-0 shadow-sm ${
                      isActive ? "bg-amber-600 text-white" : "bg-stone-100 text-stone-500 group-hover:bg-stone-200"
                    }`} style={{ backgroundColor: isActive ? "var(--color-gold-dark)" : undefined }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Logout - LARGER */}
        <div className="p-6 border-t border-stone-200/30 bg-stone-50/50">
          <button 
            onClick={handleLogout}
            className="w-full py-4 border-2 border-stone-300 hover:border-red-200 hover:bg-red-50 hover:text-red-700 text-stone-600 rounded-2xl text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out Dashboard
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT VIEWPORT */}
      <main className="flex-grow lg:h-screen lg:overflow-y-auto p-5 md:p-8 lg:p-14 flex flex-col justify-start">
        
        {/* DATABASE SEEDER CARD */}
        {needsSeeding && (
          <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/[0.05] to-white rounded-[40px] p-10 border border-amber-500/20 shadow-lg mb-10 animate-fade-in flex flex-col md:flex-row md:items-center justify-between gap-8 max-w-5xl">
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 text-amber-900">
                <svg className="w-7 h-7 animate-bounce-gentle text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="font-display font-semibold text-2xl">Cloud Database Setup Wizard</h3>
              </div>
              <p className="text-base text-stone-600 leading-relaxed max-w-3xl">
                Your database is empty. Click the button to automatically initialize your dynamic collections (services, portfolio, testimonials, and copy content) using your initial code assets. This enables dynamic adjustments instantly.
              </p>
            </div>
            <button 
              onClick={seedDatabase}
              disabled={loadingData}
              className="px-10 py-5 bg-amber-650 hover:bg-amber-700 text-white rounded-full text-sm font-extrabold uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-xl shrink-0 cursor-pointer hover:scale-[1.02]"
              style={{ backgroundColor: "var(--color-gold-dark)" }}
            >
              {loadingData ? "Initializing..." : "Seed Database Now"}
            </button>
          </div>
        )}
        {/* ---------------- SERVICES TAB SECTION ---------------- */}
        {!loadingData && activeTab === "services" && !editingService && (
          <div className="space-y-12 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-stone-200/50 pb-8">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-display font-semibold text-charcoal tracking-tight">Services &amp; Packages</h2>
                <p className="text-base text-stone-500 leading-relaxed">Add, edit, or delete the service packages rendered on the main website slider.</p>
              </div>
              <button 
                onClick={() => setEditingService({
                  title: "", subtitle: "", tag: "", desc: "", image: "",
                  inclusions: [""], fullDescription: "", startingAt: "", duration: "",
                  idealFor: [""], products: [""], gallery: []
                })}
                className="px-6 py-4 md:px-10 md:py-5 bg-stone-900 hover:bg-stone-850 text-white rounded-full text-xs md:text-sm font-extrabold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl flex items-center gap-3 cursor-pointer hover:scale-[1.02]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create New Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {services.map((item) => (
                <div key={item.id} className="bg-white rounded-[32px] md:rounded-[40px] overflow-hidden border border-stone-250/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group justify-between">
                  <div>
                    <div className="relative h-72 w-full bg-stone-150 overflow-hidden">
                      {item.image && (
                        <Image 
                           src={item.image} 
                           alt={item.title} 
                           fill
                           className="object-cover transition-transform duration-700 group-hover:scale-105" 
                           unoptimized
                        />
                      )}
                      {item.tag && (
                        <span className="absolute top-6 left-6 bg-white text-xs font-extrabold text-amber-700 tracking-widest uppercase px-5 py-2.5 rounded-full border border-stone-200/50 shadow-md">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <div className="p-6 md:p-10 space-y-4">
                      <span className="text-xs uppercase font-extrabold tracking-widest text-amber-600 block">{item.subtitle || "Service package"}</span>
                      <h3 className="text-2xl font-bold font-display text-charcoal leading-tight">{item.title}</h3>
                      <p className="text-base text-stone-500 leading-relaxed line-clamp-3">{item.desc}</p>
                      
                      {/* Inclusions summary preview */}
                      <ul className="space-y-3 border-t border-stone-100 pt-6 mt-6">
                        {item.inclusions?.slice(0, 3).map((inc: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-3 text-sm text-stone-600">
                            <span className="text-amber-600 text-base font-bold">✓</span>
                            <span className="truncate">{inc}</span>
                          </li>
                        ))}
                        {item.inclusions?.length > 3 && (
                          <li className="text-xs text-stone-400 font-semibold italic pl-6 mt-2">+{item.inclusions.length - 3} more inclusions</li>
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="p-6 md:p-10 border-t border-stone-100 flex items-center justify-between bg-stone-50/40">
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase font-bold tracking-widest text-stone-400">Starting Price</span>
                      <span className="text-lg font-bold text-stone-900 mt-1">{item.startingAt || "Custom Quotation"}</span>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setEditingService(item)}
                        className="px-5 py-3 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-sm font-bold text-stone-850 hover:border-amber-600 hover:text-amber-700 transition-all cursor-pointer shadow-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteService(item.id)}
                        className="px-5 py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-sm font-bold text-red-650 transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {services.length === 0 && (
                <div className="col-span-full py-24 text-center text-stone-400 bg-white border border-dashed border-stone-300 rounded-[40px] max-w-lg mx-auto w-full shadow-inner">
                  No services found. Click "Create New Service" above to build one.
                </div>
              )}
            </div>
          </div>
        )}

        {/* SERVICES FORM EDITOR */}
        {editingService && (
          <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-14 border border-stone-250/40 shadow-2xl max-w-5xl animate-fade-in">
            <div className="flex justify-between items-center mb-10 border-b border-stone-150 pb-6">
              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-600">Services Editor Config</span>
                <h2 className="text-3xl font-display font-semibold text-stone-900">
                  {editingService.id ? `Modify Package: ${editingService.title}` : "Create New Makeup Package"}
                </h2>
              </div>
              <button onClick={() => setEditingService(null)} className="p-2 sm:p-3 hover:bg-stone-100 rounded-full transition-colors cursor-pointer border border-stone-200">
                <CloseIcon size={24} />
              </button>
            </div>

            <form onSubmit={saveService} className="space-y-10">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <FormField label="Service Package Title">
                  <input 
                    type="text" 
                    value={editingService.title}
                    onChange={(e) => setEditingService({...editingService, title: e.target.value})}
                    className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                    placeholder="e.g. Traditional Maharashtrian Bridal"
                    required
                  />
                </FormField>
                <FormField label="Subtitle / Description tag">
                  <input 
                    type="text" 
                    value={editingService.subtitle}
                    onChange={(e) => setEditingService({...editingService, subtitle: e.target.value})}
                    className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                    placeholder="e.g. Signature Experience"
                  />
                </FormField>
                <FormField label="Badge tag overlay (Optional)">
                  <input 
                    type="text" 
                    value={editingService.tag}
                    onChange={(e) => setEditingService({...editingService, tag: e.target.value})}
                    className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                    placeholder="e.g. Most Popular / Flawless HD"
                  />
                </FormField>
                <FormField label="Package Starting Price">
                  <input 
                    type="text" 
                    value={editingService.startingAt}
                    onChange={(e) => setEditingService({...editingService, startingAt: e.target.value})}
                    className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                    placeholder="e.g. ₹15,000"
                  />
                </FormField>
                <FormField label="Service Session Duration">
                  <input 
                    type="text" 
                    value={editingService.duration}
                    onChange={(e) => setEditingService({...editingService, duration: e.target.value})}
                    className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                    placeholder="e.g. 3–4 hours"
                  />
                </FormField>

                <FormField label="Cover Image Preview & upload">
                  <MediaUploadZone 
                    imageUrl={editingService.image}
                    onUrlChange={(url) => setEditingService({ ...editingService, image: url })}
                    folder="services"
                  />
                </FormField>
              </div>

              <FormField label="Short Card Description summary">
                <textarea 
                  value={editingService.desc}
                  onChange={(e) => setEditingService({...editingService, desc: e.target.value})}
                  className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg h-32 transition-all bg-white font-medium shadow-sm hover:border-stone-400"
                  placeholder="Summarize package briefly..."
                  required
                />
              </FormField>

              <FormField label="Full Description text (Modal Detail View)">
                <textarea 
                  value={editingService.fullDescription}
                  onChange={(e) => setEditingService({...editingService, fullDescription: e.target.value})}
                  className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg h-44 transition-all bg-white font-medium shadow-sm hover:border-stone-400"
                  placeholder="Describe details, features, trials, and consultation flow..."
                />
              </FormField>

              <FormField label="Inclusions list (One inclusion item per line)">
                <textarea 
                  value={editingService.inclusions ? editingService.inclusions.join("\n") : ""}
                  onChange={(e) => setEditingService({
                    ...editingService, 
                    inclusions: e.target.value.split("\n").filter(l => l.trim() !== "")
                  })}
                  className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg h-44 transition-all bg-white font-medium shadow-sm hover:border-stone-400"
                  placeholder="Traditional or contemporary bridal makeup&#10;Premium false lashes &amp; custom extensions&#10; dupatta/saree draping"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField label="Key Brands / Products (One per line)">
                  <textarea 
                    value={editingService.products ? editingService.products.join("\n") : ""}
                    onChange={(e) => setEditingService({
                      ...editingService, 
                      products: e.target.value.split("\n").filter(p => p.trim() !== "")
                    })}
                    className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg h-40 transition-all bg-white font-medium shadow-sm hover:border-stone-400"
                    placeholder="MAC Studio Fix&#10;Charlotte Tilbury"
                  />
                </FormField>
                <FormField label="Ideal Candidates / Skin types (One per line)">
                  <textarea 
                    value={editingService.idealFor ? editingService.idealFor.join("\n") : ""}
                    onChange={(e) => setEditingService({
                      ...editingService, 
                      idealFor: e.target.value.split("\n").filter(l => l.trim() !== "")
                    })}
                    className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg h-40 transition-all bg-white font-medium shadow-sm hover:border-stone-400"
                    placeholder="Hindu &amp; Maharashtrian weddings&#10;Outdoor &amp; destination weddings"
                  />
                </FormField>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 justify-end border-t border-stone-100 pt-10">
                <button 
                  type="button" 
                  onClick={() => setEditingService(null)}
                  className="px-8 py-4.5 border border-stone-300 rounded-full text-xs md:text-sm font-extrabold uppercase tracking-widest hover:bg-stone-50 transition-all cursor-pointer shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-10 py-4.5 bg-amber-600 text-white rounded-full text-xs md:text-sm font-extrabold uppercase tracking-widest hover:bg-amber-700 transition-all shadow-lg hover:shadow-xl cursor-pointer hover:scale-[1.02]"
                  style={{ backgroundColor: "var(--color-gold-dark)" }}
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        )}
        {!loadingData && activeTab === "portfolio" && !editingPortfolio && (
          <div className="space-y-12 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-stone-200/50 pb-8">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-display font-semibold text-charcoal tracking-tight">Portfolio Gallery</h2>
                <p className="text-base text-stone-500 leading-relaxed">Add, edit, or delete looks shown in the dynamic portfolio filter gallery.</p>
              </div>
              <button 
                onClick={() => setEditingPortfolio({
                  title: "", cat: "bridal", image: "", desc: "", tags: [],
                  images: [], details: { client: "", date: "", location: "", role: "", products: [] }
                })}
                className="px-6 py-4 md:px-10 md:py-5 bg-stone-900 hover:bg-stone-850 text-white rounded-full text-xs md:text-sm font-extrabold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl flex items-center gap-3 cursor-pointer hover:scale-[1.02]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Portfolio Look
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {portfolioItems.map((item) => (
                <div key={item.id} className="bg-white rounded-[32px] md:rounded-[40px] overflow-hidden border border-stone-250/50 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group justify-between">
                  <div>
                    <div className="relative h-72 w-full bg-stone-150 overflow-hidden">
                      {item.image && (
                        <Image 
                          src={item.image} 
                          alt={item.title} 
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105" 
                          unoptimized
                        />
                      )}
                      <span className="absolute top-6 left-6 bg-white text-xs font-extrabold text-amber-700 tracking-widest uppercase px-5 py-2.5 rounded-full border border-stone-200/50 shadow-md">
                        {item.cat}
                      </span>
                    </div>
                    <div className="p-6 md:p-10 space-y-4">
                      <h3 className="text-2xl font-bold font-display text-charcoal leading-tight">{item.title}</h3>
                      <p className="text-base text-stone-500 leading-relaxed line-clamp-3">{item.desc}</p>
                      
                      {/* Tags List */}
                      <div className="flex flex-wrap gap-2 pt-4">
                        {item.tags?.map((tag: string) => (
                          <span key={tag} className="text-xs bg-stone-50 border border-stone-200/60 text-stone-500 px-4 py-1.5 rounded-full font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 md:p-10 border-t border-stone-100 flex items-center justify-between bg-stone-50/40">
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-[11px] uppercase font-bold tracking-widest text-stone-400">Client Name</span>
                      <span className="text-base font-bold text-stone-850 truncate max-w-[140px] mt-1">{item.details?.client || "Styling Model"}</span>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setEditingPortfolio(item)}
                        className="px-5 py-3 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-sm font-bold text-stone-850 hover:border-amber-600 hover:text-amber-700 transition-all cursor-pointer shadow-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deletePortfolio(item.id)}
                        className="px-5 py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-sm font-bold text-red-650 transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {portfolioItems.length === 0 && (
                <div className="col-span-full py-24 text-center text-stone-400 bg-white border border-dashed border-stone-300 rounded-[40px] max-w-lg mx-auto w-full shadow-inner">
                  No portfolio items found. Click "Add Portfolio Look" above to start building the gallery.
                </div>
              )}
            </div>
          </div>
        )}

        {/* PORTFOLIO FORM EDITOR */}
        {editingPortfolio && (
          <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-14 border border-stone-250/40 shadow-2xl max-w-5xl animate-fade-in">
            <div className="flex justify-between items-center mb-10 border-b border-stone-150 pb-6">
              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-600">Portfolio Editor</span>
                <h2 className="text-3xl font-display font-semibold text-stone-900">
                  {editingPortfolio.id ? `Modify Look: ${editingPortfolio.title}` : "Add New Gallery Work"}
                </h2>
              </div>
              <button onClick={() => setEditingPortfolio(null)} className="p-2 sm:p-3 hover:bg-stone-100 rounded-full transition-colors cursor-pointer border border-stone-200">
                <CloseIcon size={24} />
              </button>
            </div>

            <form onSubmit={savePortfolio} className="space-y-10">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <FormField label="Look Display Title">
                  <input 
                    type="text" 
                    value={editingPortfolio.title}
                    onChange={(e) => setEditingPortfolio({...editingPortfolio, title: e.target.value})}
                    className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                    placeholder="e.g. Traditional Maharashtrian Bride"
                    required
                  />
                </FormField>
                <FormField label="Filter Category">
                  <select 
                    value={editingPortfolio.cat}
                    onChange={(e) => setEditingPortfolio({...editingPortfolio, cat: e.target.value})}
                    className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium cursor-pointer shadow-sm hover:border-stone-400"
                  >
                    <option value="bridal">Bridal</option>
                    <option value="party">Party &amp; Glam</option>
                    <option value="editorial">Editorial / Fashion</option>
                  </select>
                </FormField>
                
                <FormField label="Primary Image Preview & upload">
                  <MediaUploadZone 
                    imageUrl={editingPortfolio.image}
                    onUrlChange={(url) => setEditingPortfolio({ ...editingPortfolio, image: url })}
                    folder="portfolio"
                  />
                </FormField>

                <FormField label="Engagement Video Link (Optional URL)">
                  <input 
                    type="text" 
                    value={editingPortfolio.video || ""}
                    onChange={(e) => setEditingPortfolio({...editingPortfolio, video: e.target.value})}
                    className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                    placeholder="e.g. https://assets.mixkit.co/..."
                  />
                </FormField>
              </div>

              <FormField label="Short Description Summary">
                <textarea 
                  value={editingPortfolio.desc}
                  onChange={(e) => setEditingPortfolio({...editingPortfolio, desc: e.target.value})}
                  className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg h-32 transition-all bg-white font-medium shadow-sm hover:border-stone-400"
                  placeholder="Describe styling details, duration, base type..."
                  required
                />
              </FormField>

              <FormField label="Tags (Comma-separated)">
                <input 
                  type="text" 
                  value={editingPortfolio.tags ? editingPortfolio.tags.join(", ") : ""}
                  onChange={(e) => setEditingPortfolio({
                    ...editingPortfolio, 
                    tags: e.target.value.split(",").map(t => t.trim()).filter(t => t !== "")
                  })}
                  className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                  placeholder="e.g. Bridal, Traditional, Airbrush"
                />
              </FormField>

              <div className="border-t border-stone-150 pt-10">
                <h3 className="text-xl font-bold text-stone-855 mb-8 uppercase tracking-wider">Detailed Project Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                  <FormField label="Client Name">
                    <input 
                      type="text" 
                      value={editingPortfolio.details?.client || ""}
                      onChange={(e) => setEditingPortfolio({
                        ...editingPortfolio, 
                        details: { ...editingPortfolio.details, client: e.target.value }
                      })}
                      className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                      placeholder="e.g. Priya Deshmukh"
                    />
                  </FormField>
                  <FormField label="Styling Date">
                    <input 
                      type="text" 
                      value={editingPortfolio.details?.date || ""}
                      onChange={(e) => setEditingPortfolio({
                        ...editingPortfolio, 
                        details: { ...editingPortfolio.details, date: e.target.value }
                      })}
                      className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                      placeholder="e.g. Nov 2025"
                    />
                  </FormField>
                  <FormField label="Event Location">
                    <input 
                      type="text" 
                      value={editingPortfolio.details?.location || ""}
                      onChange={(e) => setEditingPortfolio({
                        ...editingPortfolio, 
                        details: { ...editingPortfolio.details, location: e.target.value }
                      })}
                      className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                      placeholder="e.g. Ahilyanagar, MH"
                    />
                  </FormField>
                  <FormField label="Lead Artist Role">
                    <input 
                      type="text" 
                      value={editingPortfolio.details?.role || ""}
                      onChange={(e) => setEditingPortfolio({
                        ...editingPortfolio, 
                        details: { ...editingPortfolio.details, role: e.target.value }
                      })}
                      className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                      placeholder="e.g. Lead Bridal MUA"
                    />
                  </FormField>
                </div>

                <div className="mt-8">
                  <FormField label="Key Brands &amp; Products Used (One per line)">
                    <textarea 
                      value={editingPortfolio.details?.products ? editingPortfolio.details.products.join("\n") : ""}
                      onChange={(e) => setEditingPortfolio({
                        ...editingPortfolio,
                        details: {
                          ...editingPortfolio.details,
                          products: e.target.value.split("\n").filter(p => p.trim() !== "")
                        }
                      })}
                      className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg h-36 transition-all bg-white font-medium shadow-sm hover:border-stone-400"
                      placeholder="Mac Studio Fix&#10;Anastasia Beverly Hills Pomade"
                    />
                  </FormField>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 justify-end border-t border-stone-150 pt-10">
                <button 
                  type="button" 
                  onClick={() => setEditingPortfolio(null)}
                  className="px-8 py-4.5 border border-stone-300 rounded-full text-xs md:text-sm font-extrabold uppercase tracking-widest hover:bg-stone-50 transition-all cursor-pointer shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-10 py-4.5 bg-amber-600 text-white rounded-full text-xs md:text-sm font-extrabold uppercase tracking-widest hover:bg-amber-700 transition-all shadow-lg hover:shadow-xl cursor-pointer hover:scale-[1.02]"
                  style={{ backgroundColor: "var(--color-gold-dark)" }}
                >
                  Save Portfolio Look
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ---------------- WEBSITE CONTENT COPY TAB SECTION ---------------- */}
        {!loadingData && activeTab === "content" && content && (
          <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-14 border border-stone-250/40 shadow-2xl max-w-5xl animate-fade-in">
            <div className="border-b border-stone-150 pb-6 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-600">Static Content Settings</span>
                <h2 className="text-3xl font-display font-semibold text-charcoal">Global Website Copy</h2>
              </div>
            </div>
            
            <form onSubmit={saveContent} className="space-y-12">
              
              {/* HERO SECTION CONFIG */}
              <div className="space-y-10">
                <h3 className="text-lg font-extrabold uppercase tracking-wider text-amber-800 border-l-4 border-amber-600 pl-5">1. Hero Section Content</h3>
                <div className="grid grid-cols-1 gap-8">
                  <FormField label="Hero Badge Banner Text">
                    <input 
                      type="text" 
                      value={content.hero.badge}
                      onChange={(e) => setContent({
                        ...content,
                        hero: { ...content.hero, badge: e.target.value }
                      })}
                      className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                    />
                  </FormField>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField label="Hero Main Title Text">
                      <input 
                        type="text" 
                        value={content.hero.title}
                        onChange={(e) => setContent({
                          ...content,
                          hero: { ...content.hero, title: e.target.value }
                        })}
                        className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                      />
                    </FormField>
                    <FormField label="Hero Title Italicized Accent Segment">
                      <input 
                        type="text" 
                        value={content.hero.titleAccent || ""}
                        onChange={(e) => setContent({
                          ...content,
                          hero: { ...content.hero, titleAccent: e.target.value }
                        })}
                        className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                      />
                    </FormField>
                  </div>
                  
                  <FormField label="Hero Subtitle Paragraph">
                    <textarea 
                      value={content.hero.subtitle}
                      onChange={(e) => setContent({
                        ...content,
                        hero: { ...content.hero, subtitle: e.target.value }
                      })}
                      className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg h-36 transition-all bg-white font-medium shadow-sm hover:border-stone-400"
                    />
                  </FormField>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <FormField label="Primary Image Preview & upload">
                      <MediaUploadZone 
                        imageUrl={content.hero.primaryImage}
                        onUrlChange={(url) => setContent({
                          ...content,
                          hero: { ...content.hero, primaryImage: url }
                        })}
                        folder="hero"
                      />
                    </FormField>
                    <FormField label="Secondary Overlap Image Preview & upload">
                      <MediaUploadZone 
                        imageUrl={content.hero.secondaryImage}
                        onUrlChange={(url) => setContent({
                          ...content,
                          hero: { ...content.hero, secondaryImage: url }
                        })}
                        folder="hero"
                      />
                    </FormField>
                  </div>

                  {/* Hero stats grid */}
                  <div className="space-y-6">
                    <label className="block text-sm md:text-base font-bold uppercase tracking-wider text-stone-700">Hero Stats Indicators</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {content.hero.stats.map((stat: any, index: number) => (
                        <div key={index} className="p-8 bg-stone-50 border border-stone-200 rounded-[32px] flex flex-col gap-5 shadow-sm">
                          <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Value Badge</label>
                            <input 
                              type="text" 
                              value={stat.value} 
                              onChange={(e) => {
                                const newStats = [...content.hero.stats];
                                newStats[index].value = e.target.value;
                                setContent({ ...content, hero: { ...content.hero, stats: newStats } });
                              }}
                              className="w-full px-5 py-3 rounded-xl border border-stone-300 text-base font-semibold bg-white focus:outline-none focus:border-amber-600"
                              placeholder="500+"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Label</label>
                            <input 
                              type="text" 
                              value={stat.label} 
                              onChange={(e) => {
                                const newStats = [...content.hero.stats];
                                newStats[index].label = e.target.value;
                                setContent({ ...content, hero: { ...content.hero, stats: newStats } });
                              }}
                              className="w-full px-5 py-3 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:border-amber-600"
                              placeholder="Happy Brides"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* ABOUT SECTION CONFIG */}
              <div className="space-y-10 border-t border-stone-150 pt-10">
                <h3 className="text-lg font-extrabold uppercase tracking-wider text-amber-800 border-l-4 border-amber-600 pl-5">2. About Me Section Content</h3>
                <div className="grid grid-cols-1 gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField label="About Header Title">
                      <input 
                        type="text" 
                        value={content.about.title}
                        onChange={(e) => setContent({
                          ...content,
                          about: { ...content.about, title: e.target.value }
                        })}
                        className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                      />
                    </FormField>
                    <FormField label="About Section Subtitle">
                      <input 
                        type="text" 
                        value={content.about.subtitle}
                        onChange={(e) => setContent({
                          ...content,
                          about: { ...content.about, subtitle: e.target.value }
                        })}
                        className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                      />
                    </FormField>
                  </div>
                  
                  <FormField label="Signature Accent Quote">
                    <input 
                      type="text" 
                      value={content.about.quote}
                      onChange={(e) => setContent({
                        ...content,
                        about: { ...content.about, quote: e.target.value }
                      })}
                      className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                    />
                  </FormField>

                  <FormField label="About Paragraphs (One paragraph copy per line)">
                    <textarea 
                      value={content.about.paragraphs ? content.about.paragraphs.join("\n") : ""}
                      onChange={(e) => setContent({
                        ...content,
                        about: { 
                          ...content.about, 
                          paragraphs: e.target.value.split("\n").filter(p => p.trim() !== "") 
                        }
                      })}
                      className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg h-44 transition-all bg-white font-medium shadow-sm hover:border-stone-400"
                    />
                  </FormField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <FormField label="About Picture Preview & upload">
                      <MediaUploadZone 
                        imageUrl={content.about.image}
                        onUrlChange={(url) => setContent({
                          ...content,
                          about: { ...content.about, image: url }
                        })}
                        folder="about"
                      />
                    </FormField>
                    <FormField label="Highlighted Certifications / Features (One per line)">
                      <textarea 
                        value={content.about.tags ? content.about.tags.join("\n") : ""}
                        onChange={(e) => setContent({
                          ...content,
                          about: { 
                            ...content.about, 
                            tags: e.target.value.split("\n").filter(t => t.trim() !== "") 
                          }
                        })}
                        className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg h-36 transition-all bg-white font-medium shadow-sm hover:border-stone-400"
                        placeholder="Certified in HD &amp; Airbrush&#10;Premium international products"
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* CONTACT DETAILS CONFIG */}
              <div className="space-y-10 border-t border-stone-150 pt-10">
                <h3 className="text-lg font-extrabold uppercase tracking-wider text-amber-800 border-l-4 border-amber-600 pl-5">3. Contact Details &amp; Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                  <FormField label="Display Email Address">
                    <input 
                      type="email" 
                      value={content.contact.email}
                      onChange={(e) => setContent({
                        ...content,
                        contact: { ...content.contact, email: e.target.value }
                      })}
                      className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                    />
                  </FormField>
                  <FormField label="Display Phone Number text">
                    <input 
                      type="text" 
                      value={content.contact.phone}
                      onChange={(e) => setContent({
                        ...content,
                        contact: { ...content.contact, phone: e.target.value }
                      })}
                      className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                    />
                  </FormField>
                  <FormField label="WhatsApp Target Number (Digits only, e.g. 919876543210)">
                    <input 
                      type="text" 
                      value={content.contact.whatsappNumber}
                      onChange={(e) => setContent({
                        ...content,
                        contact: { ...content.contact, whatsappNumber: e.target.value }
                      })}
                      className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                    />
                  </FormField>
                  <FormField label="Instagram URL">
                    <input 
                      type="text" 
                      value={content.contact.instagram}
                      onChange={(e) => setContent({
                        ...content,
                        contact: { ...content.contact, instagram: e.target.value }
                      })}
                      className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                    />
                  </FormField>
                  <FormField label="Facebook URL">
                    <input 
                      type="text" 
                      value={content.contact.facebook}
                      onChange={(e) => setContent({
                        ...content,
                        contact: { ...content.contact, facebook: e.target.value }
                      })}
                      className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                    />
                  </FormField>
                  <FormField label="Studio Address text">
                    <input 
                      type="text" 
                      value={content.contact.address}
                      onChange={(e) => setContent({
                        ...content,
                        contact: { ...content.contact, address: e.target.value }
                      })}
                      className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                    />
                  </FormField>
                  <div className="col-span-full">
                    <FormField label="Working Hours Display Text">
                      <input 
                        type="text" 
                        value={content.contact.workingHours}
                        onChange={(e) => setContent({
                          ...content,
                          contact: { ...content.contact, workingHours: e.target.value }
                        })}
                        className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* SAVE ACTION */}
              <div className="flex justify-end border-t border-stone-100 pt-10">
                <button 
                  type="submit" 
                  className="px-10 py-5 bg-amber-600 text-white rounded-full text-xs md:text-sm font-extrabold uppercase tracking-widest hover:bg-amber-700 transition-all shadow-lg hover:shadow-xl cursor-pointer hover:scale-[1.02]"
                  style={{ backgroundColor: "var(--color-gold-dark)" }}
                >
                  Save Copy Settings
                </button>
              </div>
            </form>
          </div>
        )}
        {!loadingData && activeTab === "content" && !content && (
          <div className="text-center py-20 bg-white border border-dashed border-stone-200 rounded-3xl text-stone-400 max-w-lg mx-auto w-full">
            Copy config document not found. Run the seeder wizard to initialize it.
          </div>
        )}

        {/* ---------------- TESTIMONIALS TAB SECTION ---------------- */}
        {!loadingData && activeTab === "testimonials" && !editingTestimonial && (
          <div className="space-y-12 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-stone-200/50 pb-8">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-display font-semibold text-charcoal tracking-tight">Client Reviews</h2>
                <p className="text-base text-stone-500 leading-relaxed">Add, edit, or delete verified feedback from brides and clients.</p>
              </div>
              <button 
                onClick={() => setEditingTestimonial({
                  name: "", role: "Bride", timeAgo: "1 week ago", text: "", color: "#E91E63", source: "google"
                })}
                className="px-6 py-4 md:px-10 md:py-5 bg-stone-900 hover:bg-stone-850 text-white rounded-full text-xs md:text-sm font-extrabold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl flex items-center gap-3 cursor-pointer hover:scale-[1.02]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Testimonial
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {testimonials.map((test, index) => (
                <div key={test.id || index} className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-stone-250/50 shadow-md flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
                  <div>
                    <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-extrabold shadow-sm" style={{ backgroundColor: test.color || "var(--color-gold)" }}>
                          {test.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-stone-900 leading-tight">{test.name}</h4>
                          <span className="text-xs text-stone-450 mt-1 block font-medium">{test.role} · {test.timeAgo}</span>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest px-3.5 py-1.5 rounded-full bg-stone-100 text-stone-505 shadow-sm">
                        {test.source}
                      </span>
                    </div>
                    <Stars size={18} />
                    <p className="text-base text-stone-600 italic leading-relaxed mt-5 mb-8">
                      &ldquo;{test.text}&rdquo;
                    </p>
                  </div>
                  
                  <div className="flex gap-3 justify-end border-t border-stone-100 pt-5">
                    <button 
                      onClick={() => setEditingTestimonial(test)}
                      className="px-5 py-3 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-sm font-bold text-stone-850 hover:border-amber-600 hover:text-amber-700 transition-all cursor-pointer shadow-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteTestimonial(test.id)}
                      className="px-5 py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-sm font-bold text-red-650 transition-all cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && (
                <div className="col-span-full py-24 text-center text-stone-400 bg-white border border-dashed border-stone-300 rounded-[40px] max-w-lg mx-auto w-full shadow-inner">
                  No reviews found. Click "Add Testimonial" above to initialize client feedback.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TESTIMONIALS FORM EDITOR */}
        {editingTestimonial && (
          <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-14 border border-stone-250/40 shadow-2xl max-w-xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-10 border-b border-stone-150 pb-6">
              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-600">Reviews Editor</span>
                <h2 className="text-3xl font-display font-semibold text-stone-900">
                  {editingTestimonial.id ? "Modify Testimonial" : "Create Client Testimonial"}
                </h2>
              </div>
              <button onClick={() => setEditingTestimonial(null)} className="p-2 sm:p-3 hover:bg-stone-100 rounded-full transition-colors cursor-pointer border border-stone-200">
                <CloseIcon size={24} />
              </button>
            </div>

            <form onSubmit={saveTestimonial} className="space-y-8">
              <FormField label="Client Reviewer Name">
                <input 
                  type="text" 
                  value={editingTestimonial.name}
                  onChange={(e) => setEditingTestimonial({...editingTestimonial, name: e.target.value})}
                  className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                  placeholder="e.g. Priya Kulkarni"
                  required
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField label="Client Role / Occasion">
                  <input 
                    type="text" 
                    value={editingTestimonial.role}
                    onChange={(e) => setEditingTestimonial({...editingTestimonial, role: e.target.value})}
                    className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                    placeholder="e.g. Bride / Party Glam"
                    required
                  />
                </FormField>
                <FormField label="Time Ago text">
                  <input 
                    type="text" 
                    value={editingTestimonial.timeAgo}
                    onChange={(e) => setEditingTestimonial({...editingTestimonial, timeAgo: e.target.value})}
                    className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium shadow-sm hover:border-stone-400"
                    placeholder="e.g. 1 week ago"
                    required
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField label="Review Platform Source">
                  <select 
                    value={editingTestimonial.source}
                    onChange={(e) => setEditingTestimonial({...editingTestimonial, source: e.target.value})}
                    className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg bg-white transition-all font-medium cursor-pointer shadow-sm hover:border-stone-400"
                  >
                    <option value="google">Google Review</option>
                    <option value="website">Website Form</option>
                  </select>
                </FormField>
                <FormField label="Avatar Color Block">
                  <div className="flex gap-3">
                    <input 
                      type="color" 
                      value={editingTestimonial.color || "#C5A27D"}
                      onChange={(e) => setEditingTestimonial({...editingTestimonial, color: e.target.value})}
                      className="w-16 h-14 border border-stone-300 rounded-xl cursor-pointer bg-white"
                    />
                    <input 
                      type="text"
                      value={editingTestimonial.color || ""}
                      onChange={(e) => setEditingTestimonial({...editingTestimonial, color: e.target.value})}
                      className="flex-grow px-4 py-3.5 rounded-xl border border-stone-300 text-stone-600 text-sm font-medium focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </FormField>
              </div>

              <FormField label="Testimonial Feedback Text">
                <textarea 
                  value={editingTestimonial.text}
                  onChange={(e) => setEditingTestimonial({...editingTestimonial, text: e.target.value})}
                  className="w-full px-6 py-4.5 rounded-2xl border border-stone-300/80 focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 text-base md:text-lg h-36 transition-all bg-white font-medium shadow-sm hover:border-stone-400"
                  placeholder="Paste review message here..."
                  required
                />
              </FormField>

              <div className="flex gap-4 justify-end border-t border-stone-100 pt-8">
                <button 
                  type="button" 
                  onClick={() => setEditingTestimonial(null)}
                  className="px-8 py-4.5 border border-stone-300 rounded-full text-xs md:text-sm font-extrabold uppercase tracking-widest hover:bg-stone-50 transition-all cursor-pointer shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-10 py-4.5 bg-amber-600 text-white rounded-full text-xs md:text-sm font-extrabold uppercase tracking-widest hover:bg-amber-700 transition-all shadow-lg hover:shadow-xl cursor-pointer hover:scale-[1.02]"
                  style={{ backgroundColor: "var(--color-gold-dark)" }}
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
