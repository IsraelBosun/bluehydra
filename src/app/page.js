import HeroSection from '@/components/HeroSection';
import ExpertiseStrip from '@/components/ExpertiseStrip';
import ServicesOverview from '@/components/ServicesOverview';
import ProjectsShowcase from '@/components/ProjectsShowcase';
import ValueProposition from '@/components/ValueProposition';
import Testimonials from '@/components/Testimonials';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ExpertiseStrip />
      <ServicesOverview />
      <ProjectsShowcase />
      <ValueProposition />
      <Testimonials />
    </>
  );
}