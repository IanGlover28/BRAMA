'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Shield, Truck, Award, Users, Heart, CheckCircle, Star } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Quality First',
      description:
        'Every BRAMA product is crafted with the finest ingredients and tested for safety, purity, and effectiveness.',
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
        'From formulation to packaging, BRAMA stands for elegance, luxury, and authenticity you can trust.',
    },
  ];

  const stats = [
    { number: '5,000+', label: 'Satisfied Customers' },
    { number: '200+', label: 'Beauty Products' },
    { number: '30+', label: 'Trusted Retail Partners' },
    { number: '4.9★', label: 'Customer Rating' },
  ];

  const timeline = [
    {
      year: '2021',
      title: 'The Vision',
      description:
        'BRAMA Cosmetics was founded with a vision to create inclusive, natural, and luxurious beauty products for all skin types.',
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
      image: '/team/founder.jpg',
      bio: 'Driven by a passion for natural skincare and luxury beauty innovation.',
    },
    {
      name: 'Kofi Mensah',
      role: 'Head of Product Development',
      image: '/team/kofi.jpg',
      bio: 'Expert in botanical formulation and product testing for diverse skin tones.',
    },
    {
      name: 'Ama Boateng',
      role: 'Marketing & Brand Director',
      image: '/team/ama.jpg',
      bio: 'Focused on building meaningful connections and customer satisfaction.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-600 via-pink-700 to-pink-800 text-white pt-32 pb-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to .<span className="text-pink-200">BRAMA</span> Cosmetics
            </h1>
            <p className="text-xl md:text-2xl text-pink-50 max-w-3xl mx-auto leading-relaxed">
              At BRAMA Cosmetics, we believe beauty is confidence made visible. Our mission is to
              create safe, luxurious and eco-friendly beauty products that celebrate every shade,
              style and story.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-pink-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
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
                  At BRAMA, we believe beauty should never come at the cost of health or the planet.
                  Our formulas are cruelty-free, dermatologically tested and sustainably packaged.
                </p>
                <p className="font-semibold text-pink-600">
                  We’re not just enhancing beauty... we’re empowering confidence, naturally.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative h-[500px] bg-pink-300 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/brama-logo.png"
                  alt="Our Story"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.png';
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-pink-100 rounded-full blur-3xl opacity-50" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              These values are the foundation of BRAMA Cosmetics and guide everything we do.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600 text-lg">Milestones that shaped BRAMA Cosmetics</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-pink-200" />
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                  <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-pink-100">
                    <div className="text-3xl font-bold text-pink-600 mb-2">{item.year}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-pink-600 rounded-full border-4 border-white shadow-lg" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The creative minds behind BRAMA’s innovation, beauty and success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-80 bg-gradient-to-br from-pink-100 to-pink-200">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.png';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-pink-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose BRAMA?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We’re redefining beauty with trust, care, and excellence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 bg-gray-50 p-6 rounded-xl hover:bg-pink-50 transition-colors"
                >
                  <Icon className="w-6 h-6 text-pink-600 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{item.text}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Discover the BRAMA Glow</h2>
            <p className="text-pink-50 text-lg mb-8">
              Join thousands of beauty lovers and experience skincare made with love, care, and nature.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
              >
                Shop Now
              </Link>
              <a
                href="tel:+233552119400"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-pink-600 transition-all"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
