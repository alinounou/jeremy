'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Shield, Zap, Users, Award, ChevronRight, Check, 
  Play, Star, Clock, DollarSign, Target, BarChart3, Globe,
  Menu, X, ArrowRight, ChevronDown, Quote, Sparkles
} from 'lucide-react';

// ==================== MAIN COMPONENT ====================
export default function FXIFYFutures() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/95 backdrop-blur-lg border-b border-white/10' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                FXIFY Futures
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {['Home', 'Programs', 'About', 'FAQ', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                  {item}
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Login
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Get Funded
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#12121a] border-t border-white/10">
            <div className="px-4 py-4 space-y-3">
              {['Home', 'Programs', 'About', 'FAQ', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="block py-2 text-gray-300 hover:text-white">
                  {item}
                </a>
              ))}
              <div className="pt-4 space-y-3">
                <button className="w-full py-2.5 text-gray-300 border border-white/20 rounded-lg">Login</button>
                <button className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg font-semibold">Get Funded</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-50" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-300">Trusted by 50,000+ traders worldwide</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="block">Trade Futures with</span>
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Professional Capital
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Join the most trusted futures prop firm. Get funded up to $200,000, 
            keep up to 90% of profits, and trade without risking your own capital.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 flex items-center justify-center gap-2">
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm">Regulated Broker</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm">50K+ Traders</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">Award Winning</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span className="text-sm">150+ Countries</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/10 bg-[#12121a]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '$50M+', label: 'Capital Funded', icon: DollarSign },
              { value: '50,000+', label: 'Active Traders', icon: Users },
              { value: '90%', label: 'Profit Split', icon: TrendingUp },
              { value: '4.9/5', label: 'Trustpilot Rating', icon: Star },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-4">
                  <stat.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">Funding Programs</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Choose Your Path to
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Success</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Select the funding program that matches your trading style. Start small and scale up as you prove your skills.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                name: 'Starter',
                price: '$99',
                capital: '$10,000',
                profitSplit: '80%',
                features: ['1-Step Evaluation', 'Unlimited Trading Days', 'News Trading Allowed', 'Weekend Holding', 'Max Drawdown: 10%', 'Profit Target: 8%'],
                popular: false,
              },
              {
                name: 'Professional',
                price: '$299',
                capital: '$50,000',
                profitSplit: '85%',
                features: ['1-Step Evaluation', 'Unlimited Trading Days', 'News Trading Allowed', 'Weekend Holding', 'Max Drawdown: 10%', 'Profit Target: 8%'],
                popular: true,
              },
              {
                name: 'Elite',
                price: '$599',
                capital: '$200,000',
                profitSplit: '90%',
                features: ['Direct Funding Option', 'Unlimited Trading Days', 'News Trading Allowed', 'Weekend Holding', 'Max Drawdown: 10%', 'Profit Target: 8%'],
                popular: false,
              },
            ].map((plan) => (
              <div 
                key={plan.name} 
                className={`relative rounded-2xl p-6 lg:p-8 transition-all hover:scale-105 ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-blue-500/20 to-cyan-500/10 border-2 border-blue-500/50' 
                    : 'bg-[#12121a] border border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-1">{plan.price}</div>
                  <div className="text-gray-500 text-sm">one-time fee</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 mb-6 text-center">
                  <div className="text-gray-400 text-sm mb-1">Trading Capital</div>
                  <div className="text-2xl font-bold text-cyan-400">{plan.capital}</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 mb-6 text-center">
                  <div className="text-gray-400 text-sm mb-1">Profit Split</div>
                  <div className="text-2xl font-bold text-green-400">{plan.profitSplit}</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-[#12121a]/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400">Simple Process</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              How It <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Get funded in three simple steps. No hidden fees, no complicated rules.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Choose Your Plan', description: 'Select the funding amount that matches your trading goals. Start from $10,000 up to $200,000.', icon: Target },
              { step: '02', title: 'Pass the Evaluation', description: 'Trade during the evaluation period following simple rules. Show consistent profitability.', icon: BarChart3 },
              { step: '03', title: 'Get Funded', description: 'Once you pass, receive your funded account and start earning real profits with our capital.', icon: DollarSign },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent" />
                )}
                <div className="bg-[#12121a] rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-colors">
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-500/30 to-cyan-500/30 bg-clip-text text-transparent mb-4">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Why Choose Us</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Built for <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Traders</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Everything you need to succeed as a funded futures trader.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: 'Unlimited Time', description: 'No time limits on evaluations. Trade at your own pace without pressure.' },
              { icon: TrendingUp, title: 'Scale Your Account', description: 'Grow your account up to $2M with consistent performance. More profit for you.' },
              { icon: Shield, title: 'Risk Management', description: 'Built-in risk controls to protect your account. Trade with confidence.' },
              { icon: Zap, title: 'Instant Payouts', description: 'Request payouts anytime. Receive your profits within 24 hours.' },
              { icon: BarChart3, title: 'Real-Time Stats', description: 'Track your performance with our advanced analytics dashboard.' },
              { icon: Globe, title: 'Trade Anywhere', description: 'Access your account from any device. Trade on the go.' },
            ].map((feature) => (
              <div key={feature.title} className="bg-[#12121a] rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-[#12121a]/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              What Our <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Traders</span> Say
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Michael Chen', role: 'Funded Trader - $100K', content: 'Best prop firm I\'ve worked with. The evaluation process is fair, and payouts are always on time. Highly recommend!', rating: 5 },
              { name: 'Sarah Williams', role: 'Funded Trader - $50K', content: 'Transparent rules, great support team, and the scaling plan is amazing. I\'ve grown my account significantly.', rating: 5 },
              { name: 'James Rodriguez', role: 'Funded Trader - $200K', content: 'Finally a prop firm that understands traders. No hidden rules, no tricks. Just pure trading.', rating: 5 },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-[#12121a] rounded-2xl p-6 border border-white/10">
                <Quote className="w-8 h-8 text-blue-500/30 mb-4" />
                <p className="text-gray-300 mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <ChevronRight className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400">FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Frequently Asked <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {[
              { q: 'What is a prop firm?', a: 'A prop firm (proprietary trading firm) provides traders with capital to trade. You keep a percentage of the profits you make while trading with our funds.' },
              { q: 'How long do I have to pass the evaluation?', a: 'There is no time limit! You can take as long as you need to pass the evaluation phase. Trade at your own pace without pressure.' },
              { q: 'What happens if I fail the evaluation?', a: 'You can restart the evaluation with a new account. We offer discounted restart fees for traders who want to try again.' },
              { q: 'How do payouts work?', a: 'Once funded, you can request payouts anytime. Profits are sent within 24 hours to your preferred payment method.' },
              { q: 'What markets can I trade?', a: 'You can trade all major futures markets including indices, commodities, currencies, and interest rates on regulated exchanges.' },
              { q: 'Is there a maximum profit target?', a: 'No! There is no cap on how much you can earn. The more you profit, the more you keep (up to 90% profit split).' },
            ].map((faq, index) => (
              <div 
                key={index}
                className="bg-[#12121a] rounded-xl border border-white/10 overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span className="font-semibold pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6 text-gray-400">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-50" />
            
            <div className="relative z-10 text-center py-16 px-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Start Trading?
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8">
                Join thousands of funded traders and start your journey today. No hidden fees, no tricks.
              </p>
              <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-all hover:scale-105">
                Get Funded Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">FXIFY Futures</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">
                The most trusted futures prop firm for traders worldwide.
              </p>
              <div className="flex gap-4">
                {['twitter', 'linkedin', 'youtube', 'instagram'].map((social) => (
                  <div key={social} className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors">
                    <Globe className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Programs</h4>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Starter Program</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Professional Program</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Elite Program</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Scaling Plan</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Risk Disclosure</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
            <p>© 2025 FXIFY Futures. All rights reserved.</p>
            <p>Trading futures involves substantial risk of loss.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
