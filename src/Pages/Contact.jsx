export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with Background */}
      <section className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 py-20 px-6">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-6xl mx-auto text-center mt-16">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
            Contact Our <span className="text-gold-400 font-serif">Watch Experts</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Personalized service for your horological journey
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Sidebar - Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              {/* Contact Card */}
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <h3 className="text-2xl font-light text-gray-900 mb-6">
                  Get in Touch
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600">📞</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Call Us</h4>
                      <p className="text-gray-600 mt-1">+1 (555) 123-8463</p>
                      <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600">✉️</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email Us</h4>
                      <p className="text-gray-600 mt-1">service@timesync.com</p>
                      <p className="text-sm text-gray-500">24/7 Support</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-purple-600">📍</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Visit Us</h4>
                      <p className="text-gray-600 mt-1">
                        123 Luxury Avenue<br />
                        New York, NY 10001
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Business Hours</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Weekdays</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="text-gold-600">By Appointment</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Services */}
              <div className="bg-gold-50 rounded-xl p-6 border border-gold-200">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Services</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center space-x-2">
                    <span className="text-gold-500">•</span>
                    <span>Watch Authentication</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-gold-500">•</span>
                    <span>Service & Repair</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-gold-500">•</span>
                    <span>Custom Orders</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-gold-500">•</span>
                    <span>Corporate Gifting</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-light text-gray-900 mb-3">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and our watch specialist will contact you within 24 hours.
                  </p>
                </div>

                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-200"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-200"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-200"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-200"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inquiry Type *
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-200">
                      <option value="">Select inquiry type</option>
                      <option value="general">General Information</option>
                      <option value="purchase">Purchase Consultation</option>
                      <option value="service">Watch Service</option>
                      <option value="warranty">Warranty Claim</option>
                      <option value="corporate">Corporate Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Contact Method
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="contactMethod" value="email" className="text-gold-500" defaultChecked />
                        <span className="text-gray-700">Email</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="contactMethod" value="phone" className="text-gold-500" />
                        <span className="text-gray-700">Phone</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="contactMethod" value="both" className="text-gold-500" />
                        <span className="text-gray-700">Both</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-200 resize-none"
                      placeholder="Please describe your inquiry in detail..."
                    ></textarea>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="newsletter" className="text-gold-500 rounded" />
                    <label htmlFor="newsletter" className="text-sm text-gray-600">
                      Subscribe to our newsletter for exclusive offers and watch insights
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gold-500 text-white py-4 rounded-lg font-semibold hover:bg-gold-600 transition-colors duration-200 transform hover:scale-[1.02] shadow-lg"
                  >
                    Send Message to Watch Expert
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-16 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Response</h3>
              <p className="text-gray-600 text-sm">
                Get a response from our experts within 24 hours
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👑</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Advice</h3>
              <p className="text-gray-600 text-sm">
                Consultation from certified watch specialists
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Service</h3>
              <p className="text-gray-600 text-sm">
                Your information is protected and confidential
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}