import type {Filters} from "../api/api.ts";

export type FiltersPanelProps = {
    filters: Filters,
    onChange: (next: Filters) => void,
}
const FILTER_DEFS: {key: keyof Filters, label: string}[] = [
    {key: 'hasFbo', label: 'FBO stocks'},
    {key: 'hasFbs', label: 'FBS stocks'},
    {key: 'archived', label: 'Archived'},
    {key: 'isDiscounted', label: 'Is discounted'},
]
export function FiltersPanel({filters, onChange}: FiltersPanelProps) {
    return <div className="filters">
        {FILTER_DEFS.map(def => (
            <label key={def.key}>
                <input
                    type="checkbox"
                    checked={filters[def.key]}
                    onChange={() => {
                        onChange({...filters, [def.key]: !filters[def.key]})
                    }}
                />
                {def.label}
            </label>
        ))}
    </div>
}