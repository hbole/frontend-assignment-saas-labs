import { use, useState } from "react";
import { useEffect } from "react";

const usePagination = (url, pageSize, pageBoundary = 5) => {
  const [data, setData] = useState([]);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pages, setPages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const caluclateTotalPages = (totalItems, pageSize) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    setTotalPages(totalPages);
  }

  const fetchData = async () => {
    try {
      setIsLoading(true);
      let response = await fetch(url);
      response = await response.json();
      setData(response);
      caluclateTotalPages(response?.length, pageSize);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  const getPagesToRender = () => {
    const half = Math.floor(pageBoundary / 2);
    const pages = [];
    const startPage = Math.max(2, currentPage - half);
    const endPage = Math.min(totalPages - 1, currentPage + half);

    pages.push({ page: 1, type: 'page' });

    //Left Ellipsis
    if (startPage > 2) {
      pages.push({ page: -1, type: "ellipsis" })
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push({ page: i, type: 'page' });
    }

    //Right Ellipsis
    if (totalPages - endPage > 1) {
      pages.push({ page: -1, type: "ellipsis" })
    }

    pages.push({ page: totalPages, type: 'page' });
    setPages(pages);
  }

  useEffect(() => {
    fetchData();
  }, [url]);

  useEffect(() => {
    if (data.length > 0) {
      const pageStart = (currentPage - 1) * pageSize;
      const pageEnd = pageStart + pageSize;
      const pageData = data.slice(pageStart, pageEnd);

      setCurrentPageData(pageData);
      getPagesToRender();
    }
  }, [data, currentPage, pageSize]);

  return {
    currentPageData,
    currentPage,
    totalPages,
    pages,
    error,
    isLoading,
    setCurrentPage
  };
}

export default usePagination;