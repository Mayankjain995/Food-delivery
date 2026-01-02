import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 py-12 mt-auto transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-3xl font-bold tracking-tighter text-gray-900 dark:text-white mb-4 block">
                            Food<span className="text-red-500">Run</span>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                            Craving something delicious? We deliver the best food from top restaurants directly to your doorstep.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Placeholders - In a real app use Icons */}
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white transition-all text-sm">FB</a>
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white transition-all text-sm">IG</a>
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white transition-all text-sm">TW</a>
                        </div>
                    </div>

                    {/* Links Section 1 */}
                    <div>
                        <h4 className="text-gray-900 dark:text-white font-semibold mb-4 text-base uppercase tracking-wider">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/about" className="hover:text-red-500 transition-colors">About Us</Link></li>
                            <li><Link to="/careers" className="hover:text-red-500 transition-colors">Careers</Link></li>
                            <li><Link to="/team" className="hover:text-red-500 transition-colors">Team</Link></li>
                            <li><Link to="/blog" className="hover:text-red-500 transition-colors">FoodRun Blog</Link></li>
                        </ul>
                    </div>

                    {/* Links Section 2 */}
                    <div>
                        <h4 className="text-gray-900 dark:text-white font-semibold mb-4 text-base uppercase tracking-wider">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/help" className="hover:text-red-500 transition-colors">Help & Support</Link></li>
                            <li><Link to="/partner" className="hover:text-red-500 transition-colors">Partner with us</Link></li>
                            <li><Link to="/ride" className="hover:text-red-500 transition-colors">Ride with us</Link></li>
                        </ul>
                    </div>

                    {/* Links Section 3 */}
                    <div>
                        <h4 className="text-gray-900 dark:text-white font-semibold mb-4 text-base uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/terms" className="hover:text-red-500 transition-colors">Terms & Conditions</Link></li>
                            <li><Link to="/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/cookie" className="hover:text-red-500 transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} FoodRun Technologies Pvt. Ltd. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <span>made by Mayank Jain</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
