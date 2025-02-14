import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts(pgaeNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pgaeNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(["posts", nextPage], () => fetchPosts(nextPage))
    }
  }, [currentPage, queryClient])

  // replace with useQuery
  const { data, isError, error, isLoading, isFetching } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 2000,
      keepPreviousData: true
    }
  );

  // isError : 어떤 데이터를 가저올 때 오류가 있는지 여부
  // isLoading : 데이터가 로딩 중인지 여부 ( 데이터를 가져오는 중이고 표시할 캐시 데이터도 없다. )
  // isFetching : 비동기 쿼리가 해결되지 않았음을 의미

  // if (isFetching) return <h3>Fetching in progress...</h3>;
  if (isLoading) return <h3>loading...</h3>;
  if (isError) return <><h3>에러남</h3><p>{error.toString()}</p></>;

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage <= 1} onClick={() => { setCurrentPage(prev => prev - 1) }}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage >= maxPostPage} onClick={() => { setCurrentPage(prev => prev + 1) }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
