
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary/30 py-6 sm:py-8 text-sm">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6 lg:gap-8">
          <div className="lg:col-span-2 col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">E</span>
              </div>
              <span className="font-bold text-lg sm:text-xl">Examify</span>
            </Link>
            <p className="text-muted-foreground mb-3 text-xs sm:text-sm">
              Examify provides an interactive platform for students to test their knowledge
              through engaging quizzes across various subjects.
            </p>
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 text-cyan-400">Product</h3>
            <ul className="space-y-1.5">
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Security</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Roadmap</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 text-cyan-400">Company</h3>
            <ul className="space-y-1.5">
              <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors">About</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Careers</a></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 text-cyan-400">Resources</h3>
            <ul className="space-y-1.5">
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Community</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>
          
          {/* Support Section */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 text-cyan-400">Support</h3>
            <ul className="space-y-1.5">
              <li>
                <a href="#" className="flex items-center gap-2 text-rose-500 font-medium hover:underline">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a4.75 4.75 0 00-3.357 1.393l-.643.643-.643-.643A4.75 4.75 0 003.75 8.5c0 2.485 2.014 4.5 4.5 4.5h.75v.75a4.5 4.5 0 004.5 4.5h.75a4.5 4.5 0 004.5-4.5v-.75h.75a4.5 4.5 0 004.5-4.5 4.75 4.75 0 00-4.75-4.75z" />
                  </svg>
                  <span className="text-gray-400 group-hover:text-primary transition-colors">Support Us</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Report Issue</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Suggest Feature</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 text-cyan-400">Legal</h3>
            <ul className="space-y-1.5">
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-6 sm:mt-8 pt-3 sm:pt-4 flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <p className="text-muted-foreground text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} Examify. All rights reserved.
          </p>
          <div className="flex gap-3 text-xs sm:text-sm">
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
