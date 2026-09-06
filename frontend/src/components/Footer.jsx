
import { Link } from 'react-router-dom'

import {
  Clock,
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react'

import { FaFacebookF, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black text-white">

      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-white/[0.03] blur-3xl" />

      {/* Main Footer */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">

            {/* Brand */}
            <div className="max-w-sm">

              <Link
                to="/"
                className="group inline-flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:rotate-12">
                  <Clock className="h-5 w-5" />
                </div>

                <span
                  className="text-2xl font-semibold tracking-wide"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  ChronoSphere
                </span>
              </Link>

              <p className="mt-5 text-sm leading-7 text-gray-400">
                Discover exceptional timepieces crafted for those who
                appreciate precision, heritage, and timeless elegance.
              </p>

              {/* Social Links */}
              <div className="mt-7 flex items-center gap-3">

                {/* Website */}
                <a
                  href="#"
                  aria-label="Website"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white hover:text-black"
                >
                  <Globe className="h-4 w-4" />
                </a>

                {/* Instagram */}
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white hover:text-black"
                >
                  <FaInstagram className="h-4 w-4" />
                </a>

                {/* Facebook */}
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white hover:text-black"
                >
                  <FaFacebookF className="h-4 w-4" />
                </a>

              </div>
            </div>

            {/* Explore */}
            <div>

              <h3
                className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Explore
              </h3>

              <div className="flex flex-col gap-3">

                {[
                  ['Home', '/'],
                  ['Shop', '/shop'],
                  ['Wishlist', '/wishlist'],
                  ['My Orders', '/orders'],
                  ['Cart', '/cart'],
                ].map(([label, path]) => (
                  <Link
                    key={path}
                    to={path}
                    className="group flex w-fit items-center gap-1 text-sm text-gray-400 transition-colors duration-300 hover:text-white"
                  >
                    <span>{label}</span>

                    <ArrowUpRight className="h-3.5 w-3.5 -translate-y-0.5 opacity-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                ))}

              </div>
            </div>

            {/* Collections */}
            <div>

              <h3
                className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Collections
              </h3>

              <div className="flex flex-col gap-3">

                {[
                  'Rolex',
                  'Omega',
                  'Tag Heuer',
                  'Audemars Piguet',
                  'Patek Philippe',
                  'IWC',
                  'Hublot',
                ].map((brand) => (
                  <span
                    key={brand}
                    className="w-fit cursor-default text-sm text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    {brand}
                  </span>
                ))}

              </div>
            </div>

            {/* Contact */}
            <div>

              <h3
                className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Contact
              </h3>

              <div className="space-y-4">

                {/* Address */}
                <div className="flex items-start gap-3">

                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />

                  <span className="text-sm leading-6 text-gray-400">
                    Ballavpur, Raniganj, Asansol,
                    <br />
                    West Bengal, India - 713347
                  </span>

                </div>

                {/* Phone */}
                <a
                  href="tel:+916296882904"
                  className="group flex items-center gap-3"
                >
                  <Phone className="h-4 w-4 shrink-0 text-gray-500 transition-colors group-hover:text-white" />

                  <span className="text-sm text-gray-400 transition-colors group-hover:text-white">
                    +91 6296882904
                  </span>
                </a>

                {/* Email */}
                <a
                  href="mailto:paulsoumanka@gmail.com"
                  className="group flex items-center gap-3"
                >
                  <Mail className="h-4 w-4 shrink-0 text-gray-500 transition-colors group-hover:text-white" />

                  <span className="break-all text-sm text-gray-400 transition-colors group-hover:text-white">
                    paulsoumanka@gmail.com
                  </span>
                </a>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Service Features */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-7 lg:px-8">

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">

            {/* Secure Payments */}
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10">
                <ShieldCheck className="h-4 w-4 text-gray-300" />
              </div>

              <div>
                <p className="text-xs font-medium text-white">
                  Secure Payments
                </p>

                <p className="mt-0.5 text-[11px] text-gray-500">
                  Protected checkout
                </p>
              </div>

            </div>

            {/* Fast Delivery */}
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10">
                <Truck className="h-4 w-4 text-gray-300" />
              </div>

              <div>
                <p className="text-xs font-medium text-white">
                  Fast Delivery
                </p>

                <p className="mt-0.5 text-[11px] text-gray-500">
                  Carefully delivered
                </p>
              </div>

            </div>

            {/* Easy Returns */}
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10">
                <RotateCcw className="h-4 w-4 text-gray-300" />
              </div>

              <div>
                <p className="text-xs font-medium text-white">
                  Easy Returns
                </p>

                <p className="mt-0.5 text-[11px] text-gray-500">
                  30-day return policy
                </p>
              </div>

            </div>

            {/* Timeless Quality */}
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10">
                <Clock className="h-4 w-4 text-gray-300" />
              </div>

              <div>
                <p className="text-xs font-medium text-white">
                  Timeless Quality
                </p>

                <p className="mt-0.5 text-[11px] text-gray-500">
                  Curated timepieces
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative bg-[#050505]">

        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">

          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">

            <p className="text-center text-xs text-gray-600 md:text-left">
              © 2026 ChronoSphere. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">

              <button className="text-xs text-gray-600 transition-colors hover:text-white">
                Privacy Policy
              </button>

              <button className="text-xs text-gray-600 transition-colors hover:text-white">
                Terms of Service
              </button>

              <button className="text-xs text-gray-600 transition-colors hover:text-white">
                Refund Policy
              </button>

            </div>

          </div>

        </div>
      </div>

    </footer>
  )
}

