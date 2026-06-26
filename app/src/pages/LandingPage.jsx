import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroSection from '../sections/HeroSection'
import FeaturesSection from '../sections/FeaturesSection'
import HowItWorksSection from '../sections/HowItWorksSection'
import ProductShowcase from '../sections/ProductShowcase'
import CTASection from '../sections/CTASection'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ProductShowcase />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
