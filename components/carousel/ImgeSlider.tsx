"use client";

import React, { useState, useEffect } from "react";
import Video from "../video/video";
import BookComponent from "../book/bookComponent";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ImageSlider() {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1500);

    return () => {
      clearTimeout(animationTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center mt-8 md:mt-12 lg:mt-16 mb-0 md:mb-4 lg:mb-6 gap-y-8 px-4 sm:px-6 w-full overflow-hidden">
      {/* Upcoming Events Section - Magazine Style Redesign */}
      <div
        className={`w-full max-w-7xl mx-auto transition-all duration-700 ${animationComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        {/* Enhanced Section Header with Magazine-style Typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-24 max-w-4xl mx-auto"
        >
          {/* Small overline text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <span className="inline-block px-6 py-2 text-xs font-medium tracking-[0.2em] uppercase text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
              Past Event
            </span>
          </motion.div>

          {/* Main heading with magazine-style typography */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extralight tracking-[-0.02em] text-black dark:text-white mb-6 leading-[0.9] font-serif max-w-5xl mx-auto">
            <span className="block lg:inline">Hack</span>
            <span className="block lg:inline font-thin italic bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent mt-2 lg:mt-0 lg:ml-4">
              Matrix
            </span>
          </h1>

          {/* Event Taglines */}
          {/* <p className="text-lg md:text-xl text-blue-600 dark:text-blue-400 font-medium mb-4">
            The campus chaos you loved is BACK. Bigger games. Wilder moments. Zero chill. 👀
          </p> */}
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-light">
            Grab your team and step into a high-energy hackathon where
            innovation meets execution.
          </p>
        </motion.div>

        {/* Editorial Layout Event Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Visual Storytelling */}
          <div className="relative h-[700px] md:h-[800px] lg:h-[850px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/hackmatrix.png"
              alt="Hack Matrix Event Poster"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Editorial Caption */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-white">
                <h3 className="text-2xl font-light">Hack Matrix</h3>
                <p className="text-sm text-gray-200 mt-1">
                  The campus chaos is back!
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <span className="inline-block px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
                  Ultimate Hackathon Experience
                </span>

                <h3 className="text-3xl font-extralight text-black dark:text-white mb-4 leading-tight tracking-[-0.02em]">
                  Innovation, Build & Compete
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg leading-relaxed">
                  The campus innovation hub is LIVE. Team up, bring your ideas
                  to life, and compete in a high-intensity hybrid hackathon.
                  From ideation to execution, experience the thrill of building
                  real-world solutions. Zero limits. Pure innovation. 🚀
                </p>

                {/* Event Details Icons */}
                <div className="flex flex-wrap gap-4 sm:gap-6 mb-8 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <span className="font-medium">3rd April 2026</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span className="font-medium">10:00 AM – 2:00 PM</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <span className="font-medium">AR 102 & 103</span>
                  </div>
                </div>
              </div>

              {/* Event Features - Editorial Layout */}
              <div className="grid grid-cols-1 gap-6 mb-8">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
                  <h4 className="text-lg font-medium text-black dark:text-white mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Online Idea Screening 💻
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-5">
                    Submit your PPT with problem statement, solution,
                    architecture, and tech stack. Get shortlisted based on
                    innovation and feasibility.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
                  <h4 className="text-lg font-medium text-black dark:text-white mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Offline Final Hackathon 🛠️
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-5">
                    Build your solution live on campus, develop prototypes, and
                    present to judges in a full-day competitive environment.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
                  <h4 className="text-lg font-medium text-black dark:text-white mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    💰 Registration Options
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-5">
                    ₹69 Solo | ₹89 Duo | ₹119 Squad (3–4 Members)
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
                  <h4 className="text-lg font-medium text-black dark:text-white mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    📜 Participation Certificates
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-5">
                    All participants will receive E-certificates to recognize
                    their effort, innovation, and contribution.
                  </p>
                </div>
              </div>
            </div>

            {/* Editorial CTA */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
              <div className="inline-flex items-center group">
                <button
                  type="button"
                  disabled
                  className="px-8 py-4 rounded-full bg-gray-400 dark:bg-gray-700 font-serif font-bold text-base sm:text-lg md:text-xl text-white shadow-lg cursor-not-allowed"
                >
                  Event Completed
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                This event has successfully concluded. Thank you for your
                participation!
              </p>
            </div>
          </div>
        </div>

        {/* Event Coordinators - Added to Event Information Section */}
      </div>

      {/* Editorial Tags */}
      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 w-full">
        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
          {[
            "#VITBGotLatent",
            "#Season2",
            "#CampusGames",
            "#LatentShow",
            "#TeamChallenge",
            "#CampusChaos",
          ].map((tag) => (
            <span
              key={tag}
              className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      {/* Our Events Section Header - Enhanced Typography */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-4 lg:mb-8 max-w-4xl mx-auto"
      >
        {/* Enhanced overline text with better typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <span className="inline-block px-6 py-2 text-xs font-medium tracking-[0.3em] uppercase text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-full">
            Our Collection
          </span>
        </motion.div>

        {/* Enhanced main heading with magazine-style typography */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extralight tracking-[-0.03em] text-black dark:text-white mb-6 leading-[0.9] font-serif max-w-5xl mx-auto">
          <span className="block lg:inline">Our</span>
          <span className="block lg:inline font-thin italic bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent mt-2 lg:mt-0 lg:ml-4">
            Events
          </span>
        </h1>

        {/* Added subtitle for better content hierarchy */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light mt-6 max-w-2xl mx-auto leading-relaxed">
          Discover our exciting range of activities and gatherings designed to
          bring together enthusiasts from all backgrounds.
        </p>
      </motion.div>

      {/* Video and Book Section - Magazine Style Enhancement */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 w-full max-w-6xl mx-auto mt-16 mb-8">
        {/* Video Section with Enhanced Styling */}
        <div className="relative w-full lg:w-1/2 h-[45vh] sm:h-[50vh] lg:h-[60vh] group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-700/20 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-all duration-500"></div>
          <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-gray-700 transform -rotate-1 group-hover:rotate-0 transition-all duration-500">
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              {/* Corner Decorations */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-red-500 rounded-tl-lg"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-red-500 rounded-tr-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-red-500 rounded-bl-lg"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-red-500 rounded-br-lg"></div>

              {/* Video Content */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <Video />
              </div>

              {/* Overlay Title */}
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                <h3 className="text-white font-serif font-medium text-lg">
                  Event Highlights
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Book Section - Magazine Style Enhancement */}
        <div className="relative w-full lg:w-1/2 h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[65vh]">
          {/* Decorative Elements */}
          <div className="absolute -top-6 -left-6 w-24 h-24 border-l-2 border-t-2 border-red-200 dark:border-red-900 rounded-tl-3xl"></div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 border-r-2 border-b-2 border-red-200 dark:border-red-900 rounded-br-3xl"></div>

          {/* Main Container */}
          <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 overflow-hidden">
            {/* Header with Magazine Style */}
            <div className="absolute top-0 left-0 right-0 z-10">
              <div className="flex justify-between items-center px-6 py-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    Club Publication
                  </span>
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  2025
                </div>
              </div>
            </div>

            {/* Book Content */}
            <div className="h-full pt-12 pb-2 px-1">
              <div className="h-full relative rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
                <BookComponent />
              </div>
            </div>

            {/* Footer with Magazine Style */}
            <div className="absolute bottom-0 left-0 right-0 z-10">
              <div className="flex justify-between items-center px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-100 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Interactive Experience
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Flip to Explore
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Our Club Section */}
      <div className="relative flex justify-center items-center w-[92vw] sm:w-[85vw] md:w-[80vw] h-auto min-h-[40vh] my-8 px-4">
        {/* Background Image */}
        <div className="absolute inset-0 rounded-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300">
          <Image
            src="/images/event2.jpg"
            alt="Join Our Club Background"
            fill
            sizes="100vw"
            className="object-cover rounded-lg"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/30 rounded-lg"></div>
        </div>
        {/* Content Box */}
        <div className="absolute flex flex-col justify-center items-center inset-0 bg-white/70 dark:bg-gray-800/70 border border-transparent rounded-md z-10 gap-y-8 px-8 md:px-16 py-8 backdrop-blur-sm">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extralight tracking-[-0.02em] text-center text-gray-800 dark:text-white leading-tight">
            Join Our Club Today!
          </h1>
          <p className="font-sans text-sm sm:text-base md:text-lg text-center text-gray-700 dark:text-gray-200 leading-relaxed max-w-2xl">
            Become a member to access exclusive resources and join our community
            of{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              MATLAB
            </span>{" "}
            and{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              Overleaf
            </span>{" "}
            enthusiasts.
          </p>
          {/* Join Us Button */}
          <a
            href="https://forms.gle/KxZrPb5P1ySvwFQs7"
            aria-label="Join MATLAB & Overleaf Club"
            className="mt-6 transform hover:scale-105 transition-all duration-300"
          >
            <button
              type="button"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 font-serif font-bold text-base sm:text-lg md:text-xl text-white shadow-lg hover:shadow-xl transition duration-300 tracking-wide border-2 border-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800"
            >
              Join Us
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
