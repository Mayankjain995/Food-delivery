import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-[#1a1a1a] text-white pt-16 pb-6 mt-16 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between gap-10">

                {/* Brand Section */}
                <div className="flex-1 min-w-[200px]">
                    <h3 className="text-3xl font-bold mb-4">
                        Food<span className="text-[#ff4b2b]">Run</span>
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Delicious food delivered to your doorstep.
                    </p>
                </div>

                {/* Company Links */}
                <div className="flex-1 min-w-[200px]">
                    <h4 className="text-lg font-bold mb-4 text-gray-200">Company</h4>
                    <div className="flex flex-col gap-2">
                        <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">About Us</Link>
                        <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">Team</Link>
                        <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">Careers</Link>
                    </div>
                </div>

                {/* Contact Links */}
                <div className="flex-1 min-w-[200px]">
                    <h4 className="text-lg font-bold mb-4 text-gray-200">Contact</h4>
                    <div className="flex flex-col gap-2 cursor-pointer">
                        <p className="text-gray-400 hover:text-white text-sm transition-colors">Help & Support</p>
                        <p className="text-gray-400 hover:text-white text-sm transition-colors">Partner with us</p>
                        <p className="text-gray-400 hover:text-white text-sm transition-colors">Ride with us</p>
                    </div>
                </div>

                {/* Legal Links */}
                <div className="flex-1 min-w-[200px]">
                    <h4 className="text-lg font-bold mb-4 text-gray-200">Legal</h4>
                    <div className="flex flex-col gap-2 cursor-pointer">
                        <p className="text-gray-400 hover:text-white text-sm transition-colors">Terms & Conditions</p>
                        <p className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</p>
                        <p className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</p>
                    </div>
                </div>
            </div>

            <div className="text-center mt-16 pt-6 border-t border-gray-800 text-gray-500 text-sm">
                <p>&copy; 2024 FoodRun Technologies Pvt. Ltd</p>
            </div>
        </footer>
    );
}
