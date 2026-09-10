// src/components/Pagination.tsx
// Компонент "простой и счастливый": ни state, ни загрузки, ни раздумий.
// Только показывает то, что получил, и сообщает о кликах.

type PaginationProps = {
    page: number          // текущая страница
    totalPages: number    // сколько всего страниц
    onPrev: () => void    // "App, вернись на страницу назад"
    onNext: () => void    // "App, вперёд на страницу"
}

export function Pagination({page, totalPages, onPrev, onNext}: PaginationProps) {
    console.log("Pagination рендерится, page= ", page)
    return <div className="pagination">
        <button
            onClick={onPrev}
            disabled={page === 1}
        >
            Previous
        </button>

        <span>Page {page} of {totalPages}</span>

        <button
            onClick={onNext}
            disabled={page === totalPages}
        >
            Next
        </button>
    </div>
}