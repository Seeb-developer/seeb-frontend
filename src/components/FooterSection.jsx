import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black text-white px-6 py-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* About Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">About SEEB</h3>
                    <p className="text-base text-gray-300">
                        SEEB is your trusted platform for smart and stylish interior solutions.
                        We connect you with top designers and contractors to transform your spaces beautifully and efficiently.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <a href="https://www.facebook.com/people/Seeb-Design-Smarter-Execute-Faster/61576196867264/" target="_blank" rel="noopener noreferrer">
                            <Facebook className="w-5 h-5 hover:text-yellow-400" />
                        </a>
                        <a href="https://www.instagram.com/seebdesigns/" target="_blank" rel="noopener noreferrer">
                            <Instagram className="w-5 h-5 hover:text-yellow-400" />
                        </a>
                        <a href="https://www.youtube.com/@seebdesign" target="_blank" rel="noopener noreferrer">
                            <Youtube className="w-5 h-5 hover:text-yellow-400" />
                        </a>
                    </div>
                </div>

                {/* Legal & Policies */}
                <div className='flex md:justify-center'>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Policies & Guidelines</h3>
                        <ul className="space-y-1 text-sm text-gray-300">
                            <li><Link to="/policies/terms" target='_blank' className="hover:text-yellow-400">Terms & Conditions</Link></li>
                            <li><Link to="/policies/privacy" target='_blank' className="hover:text-yellow-400">Privacy Policy</Link></li>
                            <li><Link to="/policies/refund" target='_blank' className="hover:text-yellow-400">Cancellation & Refund Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className='flex md:justify-center'>
                    <div>
                         <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
                        {/* <p className="text-base text-gray-300 mb-2">Address: 📍 S.No 29/13b, Wadachiwadi Road, Jakat Naka, Undri, Pune, Maharashtra Pin: 411060</p> */}
                        <p className="text-base text-gray-300 mb-2">Tel: 📞 18005703133</p>
                            <p className="text-base text-gray-300 mb-2">Email: 📧 info@seeb.in</p>
                    </div>
                </div>

                {/* Contact Info */}
                <div className='flex md:justify-center'>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Office Address</h3>
                        {/* <p className="text-base text-gray-300 mb-2">Address: 📍 S.No 29/13b, Wadachiwadi Road, Jakat Naka, Undri, Pune, Maharashtra Pin: 411060</p> */}
                        {/* <p className="text-base text-gray-300 mb-2">Tel: 📞 18005703133</p>
                            <p className="text-base text-gray-300 mb-2">Email: 📧 info@seeb.in</p> */}
                        {/* <div className="mb-4">
                            <p className="text-sm font-medium text-white">Factory Address</p>
                            <p className="text-base text-gray-300 whitespace-pre-line">
                                S.No. 29/13B, Wadachiwadi Road,
                                {"\n"}Jakat Naka, Undri,
                                {"\n"}Pune, Maharashtra - 411060
                            </p>
                        </div> */}

                        <div className="mb-4">
                            {/* <p className="text-sm font-medium text-white">Head Office Address</p> */}
                            <p className="text-base text-gray-300 whitespace-pre-line">
                                WTC Tower 2, Floor 2,
                                {"\n"}Office No. 217, Kharadi,
                                {"\n"}Pune, Maharashtra - 411014
                            </p>
                        </div>

                        {/* <div className="mb-4">
                            <p className="text-sm font-medium text-white">Experience Center Address</p>
                            <p className="text-base text-gray-300 whitespace-pre-line">
                                Royale Heritage Mall, Upper Ground Floor,
                                {"\n"}Shop No. 10, NIBM, Undri,
                                {"\n"}Pune, Maharashtra - 411048
                            </p>
                        </div> */}

                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-400 mb-5 md:mb-0">
                © {new Date().getFullYear()} SEEB DESIGN PVT LTD. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
