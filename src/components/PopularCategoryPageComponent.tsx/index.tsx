import Product from '@components/HomePageComponent/Product';
import { fetchProducts } from '@utils/fetchProducts';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 20px;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
  width: 1750px;
  margin: auto;
`;

const Grid = styled.div`
  display: grid;
  width: 1800px;
  margin: auto;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 10px;

  @media (min-width: 800px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const NoResults = styled.div`
  font-size: 16px;
  color: #666;
`;

interface ProductType {
  auctionId: number;
  auctionImage: string;
  title: string;
  bidCount: number;
  buyNowPrice: number;
  currentBidPrice: number;
  favoriteCnt: number;
  endDate: string;
  status: boolean;
  auctionType: boolean;
}

export default function PopularCategoryPageComponent() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryOption = queryParams.get('categoryOption') || 'ALL';
  const keyword = queryParams.get('keyword') || '';

  const [products, setProducts] = useState<ProductType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(
    parseInt(queryParams.get('page') || '0', 10),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const { products: newProducts, hasMore } = await fetchProducts({
        page,
        categoryOption,
        keyword,
      });

      setLoading(false);
      setHasMore(hasMore);

      return newProducts;
    } catch (error) {
      setLoading(false);
      setError('불러오지 못했습니다.');
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const initialProducts = await loadProducts(page);
      setProducts(initialProducts);
    };
    loadData();
  }, [categoryOption, keyword]);

  const fetchMoreData = async () => {
    const newProducts = await loadProducts(page + 1);
    if (newProducts.length === 0) {
      setHasMore(false);
    } else {
      setProducts(prevProducts => [...prevProducts, ...newProducts]);
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <Wrapper>
      <Title>{categoryOption}</Title>
      {error && <NoResults>{error}</NoResults>}
      {products.length === 0 && !loading && !error ? (
        <NoResults>경매 리스트가 없습니다.</NoResults>
      ) : (
        <InfiniteScroll
          dataLength={products.length}
          next={fetchMoreData}
          hasMore={hasMore}
          style={{ overflow: 'visible' }}
          loader={<div></div>}
        >
          <Grid>
            {products.map((product, index) => (
              <Product key={`${product.auctionId}-${index}`} {...product} />
            ))}
          </Grid>
        </InfiniteScroll>
      )}
      {loading && <div>로딩중...</div>}
    </Wrapper>
  );
}
