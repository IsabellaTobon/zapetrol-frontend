import { useState } from "react"

interface SearchFormProps {
    onBuscar: (codigoPostal: string) => void
}

export default function SearchForm({ onBuscar }: SearchFormProps) {
    const [codigoPostal, setCodigoPostal] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (codigoPostal.trim() !== '') {
            onBuscar(codigoPostal.trim())
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
            <input
                type="text"
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                placeholder="Introduce un código postal"
                className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-900"
            />
            <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
                Buscar
            </button>
        </form>
    )
}