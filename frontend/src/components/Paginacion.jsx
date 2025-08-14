import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

function Paginacion({ totalItems, itemsPerPage, currentPage, setCurrentPage }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null; // No mostrar si no hace falta

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); // opcional: sube al inicio
    }
  };

  return (
    <Pagination className="mt-6">
      <PaginationContent>

        {/* Botón anterior */}
        <PaginationItem>
          <PaginationPrevious onClick={() => goToPage(currentPage - 1)} />
        </PaginationItem>

        {/* Páginas */}
        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i + 1}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {totalPages > 6 && <PaginationEllipsis />}

        {/* Botón siguiente */}
        <PaginationItem>
          <PaginationNext onClick={() => goToPage(currentPage + 1)} />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  );
}

export default Paginacion;
