import React, { useState } from "react";
import Modal from "@/components/common/Modal";
import Card from "@/components/common/Card";
import {
  ProjectContainer,
  ProjectImg,
  ProjectImgContainer,
} from "../../styles/ProjectStyles";
import { Post, Title } from "@/shared/interfaces";
import useCrud from "@/hooks/useCrud";
import { COLLECTIONS, DATABASES, PATHS } from "@/shared/constants";
import Board from "@/components/common/Board";
import PlusButton from "@/components/common/PlusButton";

const Project: React.FC = () => {
  const BASE_URL = "projects/";

  const { fetchData: titlesFetchData } = useCrud({
    dbName: DATABASES.CONTENT,
    collectionName: COLLECTIONS.PROJECT.TITLES,
  });

  const {
    data: titles,
    isLoading: titlesLoading,
    isError: titlesError,
  } = titlesFetchData as {
    data: Title[] | [];
    isLoading: boolean;
    isError: boolean;
  };

  const [query, setQuery] = useState<Record<string, unknown>>({});
  const { fetchData: postsFetchData } = useCrud({
    dbName: DATABASES.CONTENT,
    collectionName: COLLECTIONS.PROJECT.POSTS,
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

  const [nowIndex, setNowIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleSquareClick = (index: number) => {
    setNowIndex(index);
    setIsOpen(true);

    const selectedTitle = titles[index]?.name;
    const newQuery = { tags: { $in: [selectedTitle] } }; // 특정 태그 필터링

    setQuery(newQuery); // query를 변경하면 React Query가 자동으로 데이터를 가져옴
  };

  return (
    <Board
      RenderComponent={
        <>
          {/* 로딩 상태 표시 */}
          {titlesLoading && <div>Loading...</div>}
          {titlesError && <div>Error loading titles.</div>}

          {/* 데이터가 있을 때만 렌더링 */}
          {titles && (
            <>
              <ProjectContainer>
                <ProjectImgContainer>
                  {titles
                    .slice(0)
                    .reverse()
                    .map((title: Title, index: number) => (
                      <ProjectImg
                        onClick={() => {
                          handleSquareClick(titles.length - index - 1);
                        }}
                        key={index}
                        $imgUrl={BASE_URL + title.url + ".png"}
                      />
                    ))}
                </ProjectImgContainer>
              </ProjectContainer>
              <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={titles[nowIndex]?.name}
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
                        path={PATHS.PROJECT.ROOT}
                      />
                    ))}
              </Modal>
              <PlusButton paths={PATHS.PROJECT.CREATE} />
            </>
          )}
        </>
      }
    />
  );
};

export default Project;
