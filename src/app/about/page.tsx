import Link from 'next/link';
import Reveal from '@/components/reveal';
import {
  Leaf,
  Shield,
  Truck,
  Award,
  Users,
  Heart,
  CheckCircle,
  Star,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'About Us | BRAMA Cosmetics',
  description:
    'BRAMA Cosmetics: clean, luxurious and eco-friendly beauty products for every skin type.',
};

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Quality First',
      description:
        'Every BRAMA product is crafted with the finest ingredients and tested for safety, purity and effectiveness.',
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description:
        'We use eco-conscious packaging and partner with ethical suppliers to protect our planet while enhancing your beauty.',
    },
    {
      icon: Heart,
      title: 'Empowering Beauty',
      description:
        'We believe in self-love and confidence — inspiring everyone to feel beautiful in their natural skin.',
    },
    {
      icon: Award,
      title: 'Excellence in Every Drop',
      description:
        'From formulation to packaging, BRAMA stands for elegance, luxury and authenticity you can trust.',
    },
  ];

  const stats = [
    { number: '15+', label: 'Satisfied Customers' },
    { number: '50+', label: 'Verified Products' },
    { number: '3+', label: 'Trusted Retail Partners' },
  ];

  const timeline = [
    {
      year: '2021',
      title: 'The Vision',
      description:
        'BRAMA Cosmetics was founded with a vision to create inclusive, natural and luxurious beauty products for all skin types.',
    },
    {
      year: '2022',
      title: 'Growth & Innovation',
      description:
        'We expanded our line with skincare and haircare collections formulated using nature’s finest botanicals.',
    },
    {
      year: '2023',
      title: 'Community & Care',
      description:
        'Launched our “Glow with Purpose” campaign, empowering women and promoting sustainable beauty education.',
    },
    {
      year: '2025',
      title: 'Global Reach',
      description:
        'BRAMA Cosmetics became a household name in Ghana and beyond, known for redefining clean beauty.',
    },
  ];

  const team = [
    {
      name: 'Brama Osei',
      role: 'Founder & CEO',
      bio: 'Driven by a passion for natural skincare and luxury beauty innovation.',
    },
    {
      name: 'Kofi Mensah',
      role: 'Head of Product Development',
      bio: 'Expert in botanical formulation and product testing for diverse skin tones.',
    },
    {
      name: 'Ama Boateng',
      role: 'Marketing & Brand Director',
      bio: 'Focused on building meaningful connections and customer satisfaction.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-pink-700 to-pink-900 text-white pt-36 pb-40">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-16 left-1/4 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Reveal duration={0.8} className="text-center">
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-8">
              <Sparkles size={15} className="text-pink-200" />
              Beauty made visible · Made in Ghana
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
              Shine in your own{' '}
              <span className="text-pink-200 lowercase italic">glow</span>
            </h1>

            <p className="text-xl md:text-2xl text-pink-50 max-w-3xl mx-auto leading-relaxed">
              BRAMA Cosmetics crafts safe, luxurious and eco-friendly beauty that celebrates every
              shade, style and story.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-full font-bold hover:bg-pink-50 transition-all hover:scale-105 shadow-xl"
              >
                Shop Now
                <ArrowRight size={18} />
              </Link>
              <a
                href="tel:+233552119400"
                className="inline-flex items-center justify-center border-2 border-white/70 bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-pink-600 transition-all"
              >
                Contact Us
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== STATS (frosted panel) ===== */}
      <section className="relative -mt-20 max-w-6xl mx-auto px-6 z-20">
        <div className="grid grid-cols-3 gap-4 sm:gap-6 bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl p-5 sm:p-8">
          {stats.map((stat, index) => (
            <Reveal key={index} from={{ scale: 0.8 }} delay={index * 0.1} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== OUR STORY ===== */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <Reveal from={{ x: -50 }} duration={0.6}>
            <span className="inline-flex items-center bg-pink-50 text-pink-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              Our Story
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Redefining beauty, naturally
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                BRAMA Cosmetics began with a simple idea: to redefine beauty through nature. Founded
                in 2021, our brand emerged from a passion for clean ingredients, ethical practices
                and radiant self-expression.
              </p>
              <p>
                What started as a small skincare line in Ghana has grown into a trusted name in the
                beauty industry, offering everything from facial care and body creams to fragrances
                and makeup.
              </p>
              <p>
                Our formulas are cruelty-free, dermatologically tested and sustainably packaged —
                because beauty should never cost your health or the planet.
              </p>
            </div>
            <p className="mt-6 inline-flex items-center gap-2 font-semibold text-pink-600">
              We’re not just enhancing beauty... we’re empowering confidence, naturally.
              <Sparkles size={16} />
            </p>
          </Reveal>

          <Reveal from={{ x: 50 }} duration={0.6} className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-pink-200 to-pink-100 rounded-[2rem] rotate-2 opacity-60" />
            <div className="relative h-[300px] sm:h-[420px] bg-gradient-to-br from-pink-100 via-pink-50 to-white rounded-3xl overflow-hidden shadow-2xl border border-white/60 flex items-center justify-center">
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-pink-200 rounded-full opacity-40 blur-2xl" />
              <div className="absolute -bottom-8 -left-6 w-44 h-44 bg-pink-100 rounded-full opacity-50 blur-2xl" />
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 bg-white/70 backdrop-blur-xl rounded-full border border-white/80 shadow-xl flex flex-col items-center justify-center">
                <span className="text-6xl sm:text-7xl font-extrabold text-pink-600 leading-none">
                  B
                </span>
                <span className="text-xs font-bold tracking-[0.3em] text-gray-500 mt-1">
                  BRAMA
                </span>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg px-5 py-3 border border-white/60">
              <p className="text-2xl font-extrabold text-pink-600">2021</p>
              <p className="text-xs font-medium text-gray-500">Crafting glow since</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal from={{ y: 30 }} className="text-center mb-16">
            <span className="inline-flex items-center bg-pink-50 text-pink-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              What we stand for
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              These values are the foundation of BRAMA Cosmetics and guide everything we do.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Reveal
                  key={index}
                  from={{ y: 30 }}
                  delay={index * 0.1}
                  className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-14 h-14 bg-pink-50 rounded-full flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{value.description}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== JOURNEY ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal from={{ y: 30 }} className="text-center mb-16">
            <span className="inline-flex items-center bg-pink-50 text-pink-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              Milestones
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600 text-lg">The moments that shaped BRAMA Cosmetics</p>
          </Reveal>

          <div className="relative pl-8 md:pl-12">
            <div className="absolute left-2 md:left-3 top-2 bottom-2 w-1 bg-pink-100 rounded-full" />
            {timeline.map((item, index) => (
              <Reveal
                key={index}
                from={{ x: -30 }}
                delay={index * 0.1}
                className="relative mb-10 last:mb-0"
              >
                <div className="absolute -left-8 md:-left-12 top-1.5 w-5 h-5 bg-pink-600 rounded-full border-4 border-white shadow-lg" />
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-pink-200 hover:shadow-md transition-all">
                  <div className="text-2xl font-extrabold text-pink-600 mb-1">{item.year}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal from={{ y: 30 }} className="text-center mb-16">
            <span className="inline-flex items-center bg-pink-50 text-pink-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              The people
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The creative minds behind BRAMA’s innovation, beauty and success.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Reveal
                key={index}
                from={{ y: 30 }}
                delay={index * 0.1}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-72 bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/30 rounded-full blur-2xl" />
                  <div className="absolute -bottom-10 -left-8 w-44 h-44 bg-pink-300/30 rounded-full blur-2xl" />
                  <div className="relative w-24 h-24 bg-white/70 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl border border-white/80">
                    <span className="text-3xl font-extrabold text-pink-600">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-pink-600 font-semibold text-sm mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal from={{ y: 30 }} className="text-center mb-16">
            <span className="inline-flex items-center bg-pink-50 text-pink-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              The BRAMA difference
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Why Choose BRAMA?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We’re redefining beauty with trust, care and excellence.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: CheckCircle, text: 'Dermatologist-tested for all skin types' },
              { icon: Truck, text: 'Fast & reliable nationwide delivery' },
              { icon: Shield, text: 'Safe payments & secure shopping' },
              { icon: Users, text: 'Friendly and responsive customer care' },
              { icon: Award, text: 'Award-winning beauty formulations' },
              { icon: Star, text: 'Thousands of glowing reviews' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal
                  key={index}
                  from={{ scale: 0.9 }}
                  delay={index * 0.05}
                  className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 hover:border-pink-200 hover:bg-pink-50/50 transition-all shadow-sm"
                >
                  <span className="flex items-center justify-center w-10 h-10 bg-pink-50 rounded-full shrink-0">
                    <Icon className="w-5 h-5 text-pink-600" />
                  </span>
                  <span className="text-gray-700 font-medium text-sm">{item.text}</span>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto relative overflow-hidden bg-gradient-to-br from-pink-600 via-pink-700 to-pink-900 text-white rounded-3xl shadow-2xl px-6 py-20 text-center">
          <div className="absolute inset-0 opacity-15">
            <div className="absolute -top-10 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-10 right-1/4 w-72 h-72 bg-pink-300 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <Reveal from={{ y: 30 }}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5">Discover the BRAMA Glow</h2>
              <p className="text-pink-50 text-lg mb-9 max-w-2xl mx-auto">
                Join thousands of beauty lovers and experience skincare made with love, care and
                nature.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-full font-bold hover:bg-pink-50 transition-all hover:scale-105 shadow-xl"
                >
                  Shop Now
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="tel:+233552119400"
                  className="inline-flex items-center justify-center border-2 border-white/70 bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-pink-600 transition-all"
                >
                  Contact Us
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}