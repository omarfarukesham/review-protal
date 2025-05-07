import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-16 px-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and Newsletter Section */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <p className="font-semibold mr-4 playwrite-ro text-3xl">Opinia</p>
            </Link>

            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Subscribe to our newsletter for the latest features and updates.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email here"
                className="border border-gray-300 dark:border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <button className="border border-gray-300 dark:border-gray-700 px-6 py-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-800 dark:text-white">
                Join
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              By subscribing, you consent to our Privacy Policy and receive
              updates.
            </p>
          </div>

          {/* Explore More Section */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Explore More
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Blog Posts
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Stay Connected Section */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Stay Connected
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/newsletter"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Newsletter
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/webinars"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Webinars
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Follow Us
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://facebook.com"
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <Facebook size={20} className="mr-2" />
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  href="https://instagram.com"
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <Instagram size={20} className="mr-2" />
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="https://twitter.com"
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <Twitter size={20} className="mr-2" />
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="https://linkedin.com"
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <Linkedin size={20} className="mr-2" />
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  href="https://youtube.com"
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <Youtube size={20} className="mr-2" />
                  YouTube
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 Your Company. All rights reserved.
          </p>

          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Terms of Use
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
