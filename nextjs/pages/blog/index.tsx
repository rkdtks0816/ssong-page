import React, { useEffect, useState } from "react";
import Spiral from "@/components/common/Spiral";
import Modal from "@/components/common/Modal";
import Card from "@/components/common/Card";
import { Post, Tag } from "@/shared/interfaces";
import useCrud from "@/hooks/useCrud";
import { COLLECTIONS, DATABASES, PATHS } from "@/shared/constants";
import Board from "@/components/common/Board";
import PlusButton from "@/components/common/PlusButton";

const Blog: React.FC = () => {
  const { fetchData: tagsFetchData } = useCrud({
    dbName: DATABASES.CONTENT,
    collectionName: COLLECTIONS.BLOG.TAGS,
  });

  const {
    data: tags,
    isLoading: tagsLoading,
    isError: tagsError,
  } = tagsFetchData as {
    data: Tag[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  const [query, setQuery] = useState<Record<string, unknown>>({});
  const { fetchData: postsFetchData } = useCrud({
    dbName: DATABASES.CONTENT,
    collectionName: COLLECTIONS.BLOG.POSTS,
    query,
  });
  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
  } = postsFetchData as {
    data: Post[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [nowIndex, setNowIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log(tags);
    if (tags && tags.length > 0) {
      const allPostsTag: Tag = { name: "전체 게시글", _id: "all-posts" };
      setAllTags([allPostsTag, ...tags]);
    }
  }, [tags]);

  // 태그 클릭 시 게시글 쿼리 변경
  const handleSquareClick = (index: number) => {
    setNowIndex(index);
    setIsOpen(true);

    const selectedTag = allTags[index]?.name;
    const newQuery =
      index === 0
        ? {} // "전체 게시글" 쿼리 없음
        : { tags: { $in: [selectedTag] } }; // 특정 태그 필터링

    setQuery(newQuery); // query를 변경하면 React Query가 자동으로 데이터를 가져옴
  };

  return (
    <Board
      RenderComponent={
        <>
          {/* 로딩 상태 표시 */}
          {tagsLoading && <div>Loading tags...</div>}
          {tagsError && <div>Error loading tags.</div>}

          {/* 태그와 게시글 */}
          {allTags.length > 0 && (
            <>
              <Spiral titles={allTags} onSquareClick={handleSquareClick} />
              <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={allTags[nowIndex]?.name}
              >
                {postsLoading && <div>Loading posts...</div>}
                {postsError && <div>Error loading posts.</div>}
                {posts &&
                  posts
                    .slice(0)
                    .reverse()
                    .map((post: Post, index: number) => (
                      <Card
                        key={post._id || index}
                        post={post}
                        path={PATHS.BLOG.ROOT}
                      />
                    ))}
              </Modal>
              <PlusButton />
            </>
          )}
        </>
      }
    />
  );
};

export default Blog;
