import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  FaLeaf,
  FaUsers,
  FaHandshake,
  FaShoppingBasket,
  FaCheck,
  FaEnvelope,
} from "react-icons/fa";

const AboutPage = () => {
  return (
    <div>
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-green-50 to-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 w-full">
          <div className="max-w-4xl mx-auto text-center px-4">
            <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold rounded-full px-3 py-1 mb-6 shadow-sm border border-green-200">
              <span className="uppercase tracking-wider">{useTranslation().t("about_our_story", "Our Story")}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900">
              About KisanBazar
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10">
              Connecting local farmers with consumers to promote sustainable
              agriculture and strengthen community bonds.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="bg-white/70 backdrop-blur-md shadow-xl p-10 rounded-3xl max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 text-center md:text-left">
                  <h2 className="text-4xl font-extrabold text-green-700 mb-6 leading-tight">
                    Our Mission
                  </h2>
                  <p className="text-gray-800 text-lg mb-4">
                    KisanBazar was founded with a simple yet powerful mission:
                    to create a direct link between local farmers and consumers.
                    We believe everyone deserves access to fresh, locally grown
                    produce and farmers deserve fair compensation.
                  </p>
                  <p className="text-gray-800 text-lg">
                    By eliminating middlemen and creating a transparent
                    marketplace, we're building a sustainable food system that
                    benefits both producers and consumers while reducing
                    environmental impact.
                  </p>
                </div>

                <div className="md:w-1/2 flex justify-center">
                  <div className="w-60 h-60 bg-green-100 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
                    <FaLeaf className="text-green-500 text-8xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="glass p-8 rounded-2xl text-center shadow-md animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-green-500 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">
                Farmers create profiles showcasing their farms, growing
                practices, and produce. Consumers browse and discover local
                farms easily.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl text-center shadow-md animate-fade-in animate-delay-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShoppingBasket className="text-green-500 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Order</h3>
              <p className="text-gray-600">
                Consumers browse products, select items, and place orders
                directly with farmers, choosing pickup or delivery options.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl text-center shadow-md animate-fade-in animate-delay-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="text-green-500 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy</h3>
              <p className="text-gray-600">
                Receive fresh, locally grown produce directly from farmers.
                Support your local economy while enjoying healthier food.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Benefits
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="glass p-8 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-green-600">
                For Consumers
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" /> Fresher,
                  more nutritious produce
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" /> Full
                  transparency about farming practices
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" /> Support local
                  farming communities
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" /> Reduced
                  environmental impact
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" /> Direct
                  communication with farmers
                </li>
              </ul>
            </div>

            <div className="glass p-8 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-green-600">
                For Farmers
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" /> Higher
                  profits by removing middlemen
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" /> Guaranteed
                  local customer base
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" /> Less waste
                  through better demand understanding
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" /> Showcase
                  sustainable farming techniques
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" /> Instant
                  customer feedback
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "B G Shaman", email: "shaman@gmail.com" },
              { name: "Bimal K L", email: "bimal@gmail.com" },
              { name: "Abhay Praveen Hegde", email: "abhay@gmail.com" },
              { name: "Akshay Vinayak Hegde", email: "akshay@gmail.com" },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-inner">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {member.name}
                </h3>
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors"
                >
                  <FaEnvelope className="mr-2" />
                  <span className="text-sm">{member.email}</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-24 bg-green-50 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Contact Us
          </h2>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg text-gray-700 mb-8">
              Have any queries or suggestions? We'd love to hear from you. Reach out to us directly or drop an email!
            </p>
            <form className="space-y-4 text-left bg-white p-6 rounded-xl shadow-sm">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="Your Name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="your@email.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea id="message" rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md">
                Send Message
              </button>
            </form>
          </div>
        </section>

        <section className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Join Our Community
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-8">
            Whether you're a farmer or a consumer, KisanBazar helps you connect,
            trade, and grow together.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="btn btn-primary px-8 py-3 text-lg font-bold shadow-md"
            >
              Sign Up Now
            </Link>

            <Link
              to="/products"
              className="btn btn-outline px-8 py-3 text-lg font-bold"
            >
              Browse Products
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
