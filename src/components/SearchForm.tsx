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
        <form onSubmit={handleSubmit} className="flex w-1/2 gap-2 mb-6">
            <input
                type="text"
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                placeholder="🔎 Introduce un código postal, ciudad o dirección"
                className="flex-1 p-2 rounded border"
                style={{
                    borderColor: "var(--color-gray-primary)",
                    color: "var(--foreground)",
                }}
            />
            <button
                type="submit"
                className="px-4 py-2 rounded text-white hover:transition"
                style={{
                    boxShadow: "var(--shadow-light)",
                    backgroundColor: "var(--color-primary)",
                }}
            >
                Buscar
            </button>
        </form>
    )
}