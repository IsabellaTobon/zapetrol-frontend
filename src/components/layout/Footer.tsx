'use client'

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white p-4 text-center">

            {/* COPYRIGHT */}
            <div className="text-center mt-2">
                <p className="text-xs pb-3">© 2023 Zapetrol. Todos los derechos reservados.</p>


                {/* DATA SOURCE */}
                <p className="text-xs pb-3">
                    Datos proporcionados por el{' '}
                    <a
                        href="https://sedeaplicaciones.minetur.gob.es"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--color-accent)]"
                    >
                        Ministerio de Energía de España
                    </a>.
                </p>
            </div>
        </footer>
    )
}