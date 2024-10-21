"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';
import dynamic from 'next/dynamic';

// Lazy load Navbar and Footer for performance optimization
const Navbar = dynamic(() => import('./navbar'), { ssr: false });
const Footer = dynamic(() => import('./footer'), { ssr: false });

const HomePageContent = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setLoggedIn(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col" data-theme={loggedIn ? "dark" : "light"}>
      <Navbar loggedIn={loggedIn} handleLogout={handleLogout} />

      {/* Hero Section */}
      <div className="hero bg-gradient-to-br from-primary to-secondary text-center py-24">
        <div className="hero-content max-w-4xl">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-neutral-content mb-6">
              Track Leads, Close Deals, Hustle Smarter.
            </h1>
            <p className="text-xl md:text-2xl text-neutral-content mb-8">
              Say goodbye to paper and pen and hello to a real app that keeps you on top of your leads.
            </p>

            {/* Phone and Browser Mockups */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="col-span-2">
                <div className="mockup-phone border-primary mx-auto max-w-xs md:max-w-md">
                  <div className="camera"></div>
                  <div className="display">
                    <div className="artboard artboard-demo phone-1 flex justify-center items-center bg-gray-900">
                      <p className="text-neutral-content">App Screenshot Here</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-1">
                <div className="mockup-window border border-primary">
                  <div className="window-content bg-gray-800 flex justify-center items-center">
                    <p className="text-neutral-content">Browser Mockup Here</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Get Started Button */}
            <div className="mt-8 flex justify-center">
  <Link href="/signup">
    <button className="btn btn-primary text-white px-8 py-4 font-semibold shadow-lg">
      Get Started
    </button> {/* Closing tag for button */}
  </Link>
            </div>          
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 px-8 bg-gray-800 text-neutral-content">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-8">How It Works</h2>
          <div className="relative border-l border-gray-700">
            <TimelineStep
              step={1}
              title="Create Your Account"
              description="Get started with an individual or sales manager account in minutes. You can also add other solo users to share leads with them easily."
            />
            <TimelineStep
              step={2}
              title="Add Your Team"
              description="Easily manage your team of canvassers or work solo to track leads effectively. You can collaborate with team members by adding other Hustle users to share leads and close deals faster."
            />
            <TimelineStep
              step={3}
              title="Track & Close Deals"
              description="Manage leads, track progress, and close deals efficiently."
            />
          </div>
        </div>
      </div>

      {/* Why Hustle CRM Section */}
      <div className="py-20 px-8 bg-gray-900 text-neutral-content">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-6">Built for Hustlers: Why Hustle CRM?</h2>
          <p className="text-lg mb-6">
            Hustle CRM is designed for those who want to close more deals, streamline their sales process, and stay ahead of the competition.
          </p>

          {/* Accordion Items */}
          <div className="space-y-4">
            <AccordionItem
              title="Real-Time Lead Tracking"
              content={
                <>
                  <p>Our dynamic lead tracking ensures that you and your team stay on top of every opportunity, with real-time updates and notifications.</p>
                  <ul className="list-disc list-inside mt-4 text-gray-400">
                    <li>Customizable lead stages to fit your sales process.</li>
                    <li>Automated reminders and follow-ups to keep you on track.</li>
                    <li>Smart filters for prioritizing leads by urgency or status.</li>
                  </ul>
                </>
              }
            />
            <AccordionItem
              title="Effortless Team Collaboration"
              content={
                <>
                  <p>Collaboration is made simple with Hustle CRM. Easily share leads with team members, reassign leads, and track everyone's progress in real-time.</p>
                  <ul className="list-disc list-inside mt-4 text-gray-400">
                    <li>Assign and reassign leads with ease.</li>
                    <li>Leave comments and track progress in real-time.</li>
                    <li>Clear team collaboration to keep everyone aligned.</li>
                  </ul>
                </>
              }
            />
            <AccordionItem
              title="Advanced Sales Insights"
              content={
                <>
                  <p>Gain valuable insights into your sales performance with detailed reporting. Track key metrics and identify trends to make informed decisions and close more deals.</p>
                  <ul className="list-disc list-inside mt-4 text-gray-400">
                    <li>Visualize your pipeline and performance with easy-to-use dashboards.</li>
                    <li>Identify trends and optimize your approach for success.</li>
                    <li>Get actionable insights to boost your team's productivity.</li>
                  </ul>
                </>
              }
            />
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-6 px-8 bg-gray-900 text-neutral-content">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-8">Simple, Transparent Pricing</h2>
          <p className="text-lg mb-12">
            There is a 14-day free trial. Get full access, and after the trial, you can upgrade to continue using Hustle CRM!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <PricingCard
              title="Individual Sales Account"
              price="$10/month or $99/year"
              description="Perfect for solo salespeople."
            />
            <PricingCard
              title="Sales Manager Account"
              price="$20/month - Includes 2 canvasser accounts"
              description="Ideal for sales teams with canvassers."
            />
          </div>
          <Link href="/signup">
            <button className="btn btn-primary">
              Start Free Trial
            </button>
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            Need pricing for bigger teams?{' '}
            <Link href="mailto:hustlecrmapp@gmail.com">
              <span className="text-yellow-500 hover:text-yellow-400 font-bold cursor-pointer">Contact us</span>
            </Link>.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Sub-components
const PricingCard = ({ title, price, description }) => (
  <div className="card p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
    <h3 className="text-3xl font-bold mb-4">{title}</h3>
    <p className="text-lg mb-4">{price}</p>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

const TimelineStep = ({ step, title, description }) => (
  <div className="mb-10 ml-8 timeline-step transform transition-transform duration-300 hover:scale-105">
    <div className="absolute -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
      <span className="text-neutral-content text-xl">{step}</span>
    </div>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-lg">{description}</p>
  </div>
);

const AccordionItem = ({ title, content }) => (
  <div tabIndex={0} className="collapse collapse-arrow border border-gray-700 bg-gray-800 rounded-box">
    <div className="collapse-title text-xl font-medium">{title}</div>
    <div className="collapse-content">{content}</div>
  </div>
);

export default HomePageContent;
