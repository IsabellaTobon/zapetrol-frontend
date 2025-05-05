'use client'

import { Menu, Moon, Star, Sun, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        const useDark = storedTheme === "dark" || (!storedTheme && prefersDark);
        document.documentElement.classList.toggle("dark", useDark);
        setIsDarkMode(useDark);
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.documentElement.classList.toggle("dark", newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header
            className={`bg-[var(--color-background)] text-[var(--color-foreground)] sticky top-0 z-50`}
            style={{
                boxShadow: isDarkMode
                    ? "var(--shadow-dark)" // Sombra para modo oscuro
                    : "var(--shadow-light)", // Sombra para modo claro
            }}
        >
            <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between">
                {/* ICON */}
                <Link href="/" className="flex font-bold space-x-2">
                    <Image
                        src="/icons/icon-512x512.png"
                        height={38}
                        width={38}
                        alt="Zapetrol Logo"
                    />
                    <span className="self-center text-2xl font-semibold">Zapetrol</span>
                </Link>
                {/* DESKTOP MENU */}
                <nav className="hidden md:flex lg:flex space-x-4 items-center">
                    <button className="hover:underline flex items-center lg:flex">
                        <Star
                            className="mr-1"
                            strokeWidth={2}
                            size={20}
                            color={isDarkMode ? "var(--yellow)" : "var(--dark-blue)"}
                        />
                        Favoritos
                    </button>
                    <button className="hover:underline flex items-center me-8 lg:flex">
                        <User
                            className="mr-1"
                            size={20}
                            color={isDarkMode ? "var(--yellow)" : "var(--dark-blue)"}
                        />
                        Iniciar sesión
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="text-xl hover:scale-110 transition"
                        aria-label="Cambiar tema"
                    >
                        {isDarkMode ? (
                            <Sun size={20} color="var(--yellow)" />
                        ) : (
                            <Moon size={20} color="var(--dark-blue)" />
                        )}
                    </button>
                </nav>

                {/* SMALL SCREENS MENU BUTTON */}
                <button
                    className="md:hidden"
                    onClick={toggleMenu}
                    aria-label="Abrir menú"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* MOBILE MENU */}
            {menuOpen && (
                <div className="md:hidden px-4 pb-4 space-y-2 bg-[var(--color-background)] text-[var(--color-foreground)]">
                    <button className="hover:underline flex items-center">
                        <Star
                            className="mr-1"
                            strokeWidth={2}
                            size={20}
                            color={isDarkMode ? "var(--yellow)" : "var(--dark-blue)"}
                        />
                        Favoritos
                    </button>
                    <button className="hover:underline flex items-center">
                        <User
                            className="mr-1"
                            size={20}
                            color={isDarkMode ? "var(--yellow)" : "var(--dark-blue)"}
                        />
                        Iniciar sesión
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="text-xl"
                        aria-label="Cambiar tema"
                    >
                        {isDarkMode ? (
                            <Sun size={20} color="var(--yellow)" />
                        ) : (
                            <Moon size={20} color="var(--dark-blue)" />
                        )}
                    </button>
                </div>
            )}
        </header>
    );
}