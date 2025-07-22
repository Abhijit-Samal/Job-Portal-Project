import React from 'react'

const Footer = () => {
  return (
        <footer className="bg-gray-900 text-white px-6 py-10">
        <div className="max-w-6xl w-8/11 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          <div>
            <h2 className="text-2xl font-bold">JobPortal</h2>
            <p className="text-sm mt-2 text-gray-400">Your gateway to better opportunities.</p>
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <a href="/" className="text-gray-400 hover:text-white text-sm">Home</a>
            <a href="/jobs" className="text-gray-400 hover:text-white text-sm">Jobs</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">About Us</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Contact</a>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-semibold">Connect with us</h3>
            <div className="flex gap-4 text-gray-400">
              <a href="#" className="hover:text-white">
                <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.23 5.924a8.61 8.61 0 0 1-2.475.678A4.301 4.301 0 0 0 21.63 4.1a8.59 8.59 0 0 1-2.724 1.04 4.292 4.292 0 0 0-7.314 3.912A12.185 12.185 0 0 1 3.17 4.87a4.29 4.29 0 0 0 1.328 5.723A4.268 4.268 0 0 1 2.8 9.792v.055a4.29 4.29 0 0 0 3.444 4.205 4.3 4.3 0 0 1-1.925.073 4.292 4.292 0 0 0 4.006 2.975A8.607 8.607 0 0 1 2 19.54a12.13 12.13 0 0 0 6.575 1.928c7.89 0 12.208-6.538 12.208-12.21 0-.186-.004-.372-.013-.556A8.72 8.72 0 0 0 24 4.557a8.59 8.59 0 0 1-2.47.68z" /></svg>
              </a>
              <a href="#" className="hover:text-white">
                <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325V22.68c0 .73.593 1.32 1.325 1.32h11.497V14.706H9.692V11.25h3.13V8.437c0-3.1 1.894-4.787 4.66-4.787 1.325 0 2.463.1 2.796.145v3.24h-1.92c-1.508 0-1.8.718-1.8 1.77v2.324h3.59l-.467 3.456h-3.122V24H22.68c.73 0 1.32-.59 1.32-1.32V1.32C24 .592 23.41 0 22.675 0z" /></svg>
              </a>
              <a href="#" className="hover:text-white">
                <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24"><path d="M12.004 0C5.373 0 0 5.373 0 12.004c0 5.301 3.438 9.8 8.206 11.387.6.111.793-.261.793-.58 0-.287-.01-1.045-.016-2.052-3.338.725-4.042-1.611-4.042-1.611-.546-1.389-1.334-1.76-1.334-1.76-1.09-.746.083-.73.083-.73 1.205.085 1.838 1.238 1.838 1.238 1.07 1.834 2.81 1.304 3.492.997.108-.774.42-1.305.762-1.605-2.666-.303-5.467-1.333-5.467-5.932 0-1.31.468-2.38 1.235-3.222-.125-.303-.535-1.522.116-3.172 0 0 1.008-.322 3.3 1.23a11.495 11.495 0 0 1 3.005-.404c1.02.005 2.05.137 3.005.404 2.29-1.552 3.295-1.23 3.295-1.23.653 1.65.243 2.869.118 3.172.77.842 1.233 1.912 1.233 3.222 0 4.61-2.805 5.625-5.478 5.92.43.37.814 1.101.814 2.222 0 1.604-.015 2.896-.015 3.29 0 .322.192.696.8.578C20.565 21.8 24 17.305 24 12.004 24 5.373 18.627 0 12.004 0z" /></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} JobPortal. All rights reserved.
        </div>
      </footer>
  )
}

export default Footer