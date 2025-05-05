import { useState } from "react"
import "@/styles/Buttons.css"

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
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full max-w-xl gap-4 p-4 items-stretch">
            <input
                type="text"
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                placeholder="🔎 Introduce un código postal, ciudad o dirección"
                className="flex-1 p-2 rounded border text-[--foreground] bg-[--background] border-[--color-gray-primary] text-sm md:text-base"
            />
            <button
                type="submit"
                className="btn-basic"
            >
                <span>Buscar</span>
            </button>
        </form>
    )
}