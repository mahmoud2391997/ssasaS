import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { RoomsIcon, ReservationsIcon, LogoutIcon, MenuIcon, CloseIcon, Logo } from './ui';

const navigation = [
  { name: 'Rooms', href: '/rooms', icon: RoomsIcon },
  { name: 'Reservations', href: '/reservations', icon: ReservationsIcon },
];

const Sidebar: React.FC = () => {
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setToken(null);
        navigate('/login');
    };

    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
                <Logo className="h-12 w-auto" />
            </div>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <NavLink
                                        to={item.href}
                                        className={({ isActive }) =>
                                            `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                                isActive
                                                    ? 'bg-slate-700 text-white'
                                                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                            }`
                                        }
                                    >
                                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                        {item.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className="mt-auto">
                        <button
                            onClick={handleLogout}
                            className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                            <LogoutIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};


export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div>
            {/* Mobile sidebar */}
            <div className={`relative z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-900/80"></div>
                <div className="fixed inset-0 flex">
                    <div className="relative mr-16 flex w-full max-w-xs flex-1">
                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                            <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                <span className="sr-only">Close sidebar</span>
                                <CloseIcon className="h-6 w-6 text-white" aria-hidden="true" />
                            </button>
                        </div>
                        <Sidebar />
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <Sidebar />
            </div>

            <div className="lg:pl-72">
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <span className="sr-only">Open sidebar</span>
                        <MenuIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true"></div>
                </div>

                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </div>
    );
};