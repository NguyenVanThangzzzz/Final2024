import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-800 text-white h-full fixed top-0 left-0"> {/* Bỏ mt-16 */}
            <div className="p-4">
                <h2 className="text-xl font-bold">Admin Menu</h2>
                <nav className="mt-4">
                    <Link to="/" className="block py-2 hover:bg-gray-700">
                        Home
                    </Link>
                    <Link to="/secret-dashboard" className="block py-2 hover:bg-gray-700">
                        Dashboard
                    </Link>
                    <Link to="/settings" className="block py-2 hover:bg-gray-700">
                        Settings
                    </Link>
                    {/* Thêm các liên kết khác nếu cần */}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
