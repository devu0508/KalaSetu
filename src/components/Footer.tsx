export function Footer() {
    return (
        <footer className="bg-earth-950 text-earth-400 py-16 border-t border-earth-800">
            <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-12">

                <div className="space-y-4">
                    <h3 className="font-serif text-2xl text-earth-100">KalaSetu</h3>
                    <p className="text-sm leading-relaxed">
                        Bridging tradition and modernity through exquisite handcrafted artifacts.
                    </p>
                </div>

                <div>
                    <h4 className="text-earth-100 font-medium mb-4 uppercase tracking-wider text-sm">Shop</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-gold-500 transition-colors">All Products</a></li>
                        <li><a href="#" className="hover:text-gold-500 transition-colors">New Arrivals</a></li>
                        <li><a href="#" className="hover:text-gold-500 transition-colors">Best Sellers</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-earth-100 font-medium mb-4 uppercase tracking-wider text-sm">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-gold-500 transition-colors">Our Story</a></li>
                        <li><a href="#" className="hover:text-gold-500 transition-colors">Artisans</a></li>
                        <li><a href="#" className="hover:text-gold-500 transition-colors">Sustainability</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-earth-100 font-medium mb-4 uppercase tracking-wider text-sm">Connect</h4>
                    <p className="text-sm mb-4">Subscribe for updates on new collections.</p>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="bg-earth-900 border border-earth-800 px-4 py-2 text-sm w-full focus:outline-none focus:border-gold-500 text-earth-100"
                        />
                        <button className="bg-gold-500 text-earth-900 px-4 py-2 text-sm font-medium hover:bg-gold-600 transition-colors">
                            Join
                        </button>
                    </div>
                </div>

            </div>
            <div className="container-custom mt-16 pt-8 border-t border-earth-900 text-xs text-center md:text-left flex flex-col md:flex-row justify-between items-center">
                <p>&copy; 2024 KalaSetu. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-gold-500">Privacy Policy</a>
                    <a href="#" className="hover:text-gold-500">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
