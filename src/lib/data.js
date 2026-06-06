// Centralized data for the entire website
export const companyData = {
  name: "Bluehydra Labs",
  tagline: "Engineering Excellence, Delivered",
  description: "We build high-performance web and mobile applications that scale with your business.",
  
  contact: {
    email: "bluehydra001@gmail.com",
    phone: "+234 8150425188",

    social: {
      instagram: "https://instagram.com/bluehydradev"
    }
  },

  hero: {
    headline: "Precision-Engineered Software",
    subheadline: "For Growing Businesses",
    description: "We architect and deliver custom web and mobile applications built for performance, scalability, and long-term success.",
    cta: {
      primary: "Start a Project",
      secondary: "View Our Work"
    }
  },

  expertise: {
    title: "Built by Engineers, For Business",
    description: "We specialize in creating robust, maintainable software that solves real business problems. Our focus is on clean architecture, reliable delivery, and technical excellence.",
    metrics: [
      { value: "8+", label: "Years of Experience" },
      { value: "120+", label: "Projects Delivered" },
      { value: "50+", label: "Clients Served" }
    ],
    focusAreas: [
      "Web Application Development",
      "Mobile Application Development",
      "Custom Software Solutions"
    ]
  },

  services: [
    {
      id: 1,
      title: "Web Application Development",
      description: "Full-stack web applications built with modern frameworks. Scalable architecture, clean code, and responsive design that works flawlessly across all devices.",
      icon: "web"
    },
    {
      id: 2,
      title: "Mobile Application Development",
      description: "Native and cross-platform mobile apps for iOS and Android. Intuitive interfaces, optimized performance, and seamless integration with backend systems.",
      icon: "mobile"
    },
    {
      id: 3,
      title: "Custom Software Development",
      description: "Tailored software solutions designed around your specific business requirements. From automation tools to enterprise systems, we build what you need.",
      icon: "custom"
    }
  ],

  projects: [
    {
      id: 1,
      title: "Toausib Consulting",
      type: "Web Application",
      description: "Professional consulting website showcasing audit, tax advisory, and training services for Nigeria's leading firm.",
      link: "https://toausibconsulting.com/",
      image: "/images/projects/toausib-consulting.jpg"
    },
    {
      id: 3,
      title: "The Word Impact Network Event Website",
      type: "Web Application",
      description: "Professional event website showcasing the World Impact Network's global initiatives and community engagement.",
      link: "https://thewordimpactnetwork.com/",
      image: "/images/projects/word-impact-network.jpg"
    },
    {
      id: 4,
      title: "Pearloria",
      type: "Web Application",
      description: "Business registration and compliance platform helping Nigerian entrepreneurs legally register, structure, and protect their businesses — covering CAC registration, company incorporation, trademarks, and ongoing compliance filings.",
      link: "https://www.pearloriaenterprises.com/",
      image: "/images/projects/pearloria.jpg"
    },
    {
      id: 5,
      title: "PhotoStudio.ng",
      type: "Web Application",
      description: "Studio management platform built for Nigerian photographers — client galleries, online booking, Paystack payment processing, and invoice management all in one branded system.",
      link: "https://www.photostudio.ng",
      image: "/images/projects/photostudio-ng.jpg"
    },
  ],

  valueProposition: {
    title: "Why Leading Companies Choose Us",
    subtitle: "Engineering discipline meets business pragmatism",
    points: [
      {
        title: "Clean, Maintainable Code",
        description: "We write code that your team can understand, extend, and maintain for years to come. No technical debt, no shortcuts."
      },
      {
        title: "Scalable Architecture",
        description: "Built to grow with your business. Our systems handle increased load gracefully and are designed for long-term reliability."
      },
      {
        title: "Business-Aligned Decisions",
        description: "Every technical choice is made with your business goals in mind. We're not just developers—we're strategic partners."
      },
      {
        title: "Delivery Discipline",
        description: "Clear communication, realistic timelines, and consistent progress updates. We deliver what we promise, when we promise it."
      }
    ]
  },

  testimonials: [
    {
      id: 1,
      name: "Jude Oni",
      role: "Convener",
      company: "The Word Impact Network",
      content: "Bluehydra captured exactly what The Word Impact Network stands for. The website they delivered was clean, professional, and perfectly represented our global mission. They listened carefully, communicated clearly throughout the process, and delivered well ahead of schedule. Exceptional work.",
      avatar: null
    },
    {
      id: 2,
      name: "Victor Fatoyinbo",
      role: "Principal Partner",
      company: "Toausib Consulting",
      content: "Working with Bluehydra was a seamless experience from start to finish. They built a website that truly reflects the standard and credibility of our firm. Every detail — the layout, the content structure, the performance — was handled with real professionalism. I would recommend them without hesitation.",
      avatar: null
    },
  ],

  navigation: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services" },
    { label: "Projects", href: "/#projects" },
    { label: "Contact", href: "/contact" }
  ],

  footerLinks: {
    company: [
      { label: "About", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "Projects", href: "#projects" }
    ],
    contact: [
      { label: "Get in Touch", href: "/contact" },
      { label: "Book Consultation", href: "/contact#consultation" }
    ]
  }
};