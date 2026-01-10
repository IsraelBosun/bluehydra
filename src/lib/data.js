// Centralized data for the entire website
export const companyData = {
  name: "Vertex Solutions",
  tagline: "Engineering Excellence, Delivered",
  description: "We build high-performance web and mobile applications that scale with your business.",
  
  contact: {
    email: "hello@vertexsolutions.dev",
    phone: "+1 (555) 847-9200",
    businessHours: "Monday - Friday, 9:00 AM - 6:00 PM EST",
    social: {
      instagram: "https://instagram.com/vertexsolutions"
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
      title: "FinTrack Pro",
      type: "Web Application",
      description: "Enterprise financial management platform with real-time analytics and multi-currency support.",
      image: "/images/project-web.jpg",
      link: "#"
    },
    {
      id: 2,
      title: "SwiftCart",
      type: "Mobile Application",
      description: "Cross-platform e-commerce app with seamless checkout and inventory management.",
      image: "/images/project-mobile.jpg",
      link: "#"
    }
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
      name: "Sarah Mitchell",
      role: "CTO, TechFlow Inc.",
      company: "TechFlow Inc.",
      content: "Vertex Solutions transformed our legacy system into a modern, scalable platform. Their engineering discipline and clear communication made the entire process seamless. Best development partner we've worked with.",
      avatar: null
    },
    {
      id: 2,
      name: "James Rodriguez",
      role: "Founder & CEO",
      company: "StartupHub",
      content: "They don't just build software—they solve problems. The team understood our business needs and delivered a product that exceeded expectations. Their attention to code quality is unmatched.",
      avatar: null
    }
  ],

  navigation: [
    { label: "Home", href: "/" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
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