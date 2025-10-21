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
                        Welcome to <strong>Seeb</strong> — an easy and transparent platform for all your home and office interior needs,
                        from small tasks to complete setup execution.
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                        <Link to="/about" className="text-yellow-400 hover:underline font-medium">
                            Learn more
                        </Link>
                        <Link to="/blog" className="text-gray-300 hover:text-yellow-400 text-sm">
                            Blog
                        </Link>
                        <Link to="/tips" className="text-gray-300 hover:text-yellow-400 text-sm">
                            Design Tips
                        </Link>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <a href="https://www.facebook.com/people/Seeb-Design-Smarter-Execute-Faster/61576196867264/" target="_blank" rel="noopener noreferrer">
                            <Facebook className="w-5 h-5 hover:text-yellow-400" />
                        </a>
                        <a href="https://www.instagram.com/seeb_app?igsh=MXdnMzlqb2pidTgwZg==" target="_blank" rel="noopener noreferrer">
                            <Instagram className="w-5 h-5 hover:text-yellow-400" />
                        </a>
                        <a href="https://youtube.com/@seebapp?si=HQKJRMVD8plYmGb-" target="_blank" rel="noopener noreferrer">
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
                        <p className="text-base text-gray-300 mb-2">
                            Tel: <a href="tel:18005703133" className="text-yellow-400 hover:underline">📞 18005703133</a>
                        </p>
                        <p className="text-base text-gray-300 mb-2">
                            Email: <a href="mailto:info@seeb.in" className="text-yellow-400 hover:underline">📧 info@seeb.in</a>
                        </p>
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

            {/* App Store & Play Store Links */}
            <div className="mt-8 text-center">
                <h4 className="text-lg font-semibold text-white mb-2">Download Now</h4>
                <p className="text-sm text-gray-400 mb-4">For easy booking, please download the Seeb App.</p>

                <div className="flex gap-4 justify-center">
                    <a
                        href="https://apps.apple.com/in/app/seeb-design/id6747076134"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-yellow-400 bg-white/5 px-3 py-2 rounded-md"
                    >
                        {/* App Store SVG */}
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M17.564 13.063c-.025-2.604 2.127-3.85 2.222-3.908-1.211-1.77-3.093-2.013-3.755-2.04-1.6-.162-3.129.938-3.947.938-.818 0-2.077-.916-3.419-.892-1.759.027-3.384 1.025-4.287 2.606-1.837 3.183-.469 7.89 1.321 10.48.876 1.265 1.917 2.687 3.292 2.634 1.329-.053 1.83-.85 3.438-.85 1.608 0 2.053.85 3.45.825 1.432-.027 2.338-1.287 3.211-2.553.995-1.462 1.406-2.881 1.427-2.953-.031-.014-2.741-1.053-2.767-4.183zm-4.012-7.646c.72-.872 1.207-2.084 1.073-3.317-1.037.042-2.292.691-3.043 1.563-.667.776-1.255 2.021-1.032 3.211 1.174.091 2.282-.597 3.002-1.457z" fill="#fff" />
                        </svg>
                        <span className="text-base">App Store</span>
                    </a>

                    <a
                        href="https://play.google.com/store/apps/details?id=com.seeb.design"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-yellow-400 bg-white/5 px-3 py-2 rounded-md"
                    >
                        {/* Play Store SVG */}
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M3.6 2.2l12.7 7.3-3.8 2.2-8.9-5.1c-.6-.3-.6-1.1 0-1.4zm0 19.6c-.6-.3-.6-1.1 0-1.4l8.9-5.1 3.8 2.2-12.7 7.3zm14.2-8.2l-3.8-2.2 3.8-2.2c.6-.3 1.4.1 1.4.8v4.8c0 .7-.8 1.1-1.4.8z" fill="#fff" />
                        </svg>
                        <span className="text-base">Google Play</span>
                    </a>
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
