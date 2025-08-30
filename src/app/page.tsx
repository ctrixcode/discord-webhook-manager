import { cookies } from 'next/headers';
import type { Metadata } from 'next';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Discord Webhook Manager - Supercharge Your Discord Communication',
    description: 'Effortlessly manage, automate, and send rich messages to your Discord channels. Streamline announcements, updates, and interactions with our intuitive Webhook Manager.',
    keywords: ['Discord', 'Webhook', 'Manager', 'Automation', 'Messages', 'Bots', 'Communication', 'Tools'],
  };
};

export default async function HomePage() { 
  const cookieStore = await cookies(); 
  const refreshToken = cookieStore.get('refreshToken');
  const isLoggedIn = !!refreshToken;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 text-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen p-4 md:p-24 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg leading-tight">
          Supercharge Your Discord Communication
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-4xl leading-relaxed opacity-90">
          Effortlessly manage, automate, and send rich messages to your Discord channels.
          Streamline announcements, updates, and interactions with our intuitive Webhook Manager.
        </p>
        <a
          href={isLoggedIn ? "/dashboard" : "/login"}
          className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 ease-in-out shadow-xl transform hover:scale-105"
        >
          {isLoggedIn ? "Go to Dashboard" : "Get Started for Free"}
        </a>
      </section>

      {/* About Us / What We Do Section */}
      <section className="py-20 px-4 md:px-24 bg-slate-800 bg-opacity-50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 drop-shadow-md">
            What We Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-slate-700 bg-opacity-70 p-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
              <h3 className="text-2xl font-semibold mb-4">Centralized Webhook Management</h3>
              <p className="text-lg opacity-80">
                Keep all your Discord webhooks organized in one place. Easily add, edit, and delete webhooks without juggling multiple Discord servers.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-slate-700 bg-opacity-70 p-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
              <h3 className="text-2xl font-semibold mb-4">Rich Message Composition</h3>
              <p className="text-lg opacity-80">
                Craft stunning Discord messages with full support for embeds, custom avatars, and usernames. Make your announcements stand out.
              </p>
            </div>
            {/* Feature 3 - Scheduled Messaging (Temporarily commented out) */}
            {/*
            <div className="bg-slate-700 bg-opacity-70 p-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
              <h3 className="text-2xl font-semibold mb-4">Scheduled Messaging</h3>
              <p className="text-lg opacity-80">
                Plan your messages in advance. Schedule announcements, reminders, or daily updates to be sent automatically at your desired time.
              </p>
            </div>
            */}
            {/* Feature 4 */}
            <div className="bg-slate-700 bg-opacity-70 p-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
              <h3 className="text-2xl font-semibold mb-4">Custom Avatars & Identities</h3>
              <p className="text-lg opacity-80">
                Define and reuse custom avatars and usernames for your webhook messages, giving each message a unique identity.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="bg-slate-700 bg-opacity-70 p-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
              <h3 className="text-2xl font-semibold mb-4">Intuitive User Interface</h3>
              <p className="text-lg opacity-80">
                Our clean and user-friendly dashboard makes managing your Discord webhooks a breeze, even for beginners.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="bg-slate-700 bg-opacity-70 p-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
              <h3 className="text-2xl font-semibold mb-4">Secure & Reliable</h3>
              <p className="text-lg opacity-80">
                Built with security in mind, ensuring your webhook data and Discord interactions are safe and dependable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 px-4 md:px-24 bg-slate-900 bg-opacity-70 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 drop-shadow-md">
            Get in Touch
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Have questions, feedback, or just want to say hello? Feel free to reach out!
          </p>
          <div className="flex flex-col items-center space-y-4">
            <a
              href="mailto:coderck@proton.me"
              className="inline-flex items-center text-lg md:text-xl text-indigo-400 hover:text-indigo-300 transition duration-300 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 4v7a2 2 0 002 2h14a2 2 0 002-2v-7m-18 0h18" />
              </svg>
              coderck@proton.me
            </a>
            <a
              href="https://github.com/ctrixcode"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-lg md:text-xl text-indigo-400 hover:text-indigo-300 transition duration-300 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.799 8.205 11.387.6.11.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.087-.744.082-.729.082-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.49.998.108-.775.419-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.382 1.235-3.22-.12-.3-.535-1.52.117-3.176 0 0 1-.322 3.295 1.23.957-.266 1.983-.4 3.003-.404 1.02.004 2.046.138 3.003.404 2.295-1.552 3.295-1.23 3.295-1.23.652 1.656.237 2.876.117 3.176.77.838 1.235 1.91 1.235 3.22 0 4.61-2.805 5.625-5.475 5.92.43.37.823 1.102.823 2.222 0 1.606-.015 2.89-.015 3.283 0 .32.217.69.825.577C20.562 21.799 24 17.302 24 12c0-6.627-5.373-12-12-12z" clipRule="evenodd" />
              </svg>
              ctrixcode
            </a>
          </div>
        </div>
      </section>

      {/* Copyright Section */}
      <footer className="py-8 px-4 md:px-24 bg-slate-900 bg-opacity-90 text-center text-sm opacity-70">
        <p>&copy; {new Date().getFullYear()} Discord Webhook Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}