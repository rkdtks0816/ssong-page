import React from "react";
import { useRouter } from "next/router";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import { Post } from "@/shared/interfaces/post";
import {
  BackButton,
  BackButtonContainer,
  Content,
  ContentHeader,
  DetailContainer,
  DetailTag,
  DetailTitle,
  EditButtons,
} from "./styles";
import useCrud from "@/hooks/useCrud";
import { COLLECTIONS, DATABASES, PATHS } from "@/shared/constants";
import { useAuth } from "@/hooks/useAuth";
import { useToken } from "@/hooks/useToken";

const Detail: React.FC<{
  isBlog: boolean;
  id: string;
}> = ({ isBlog, id }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { getToken } = useToken(); // 토큰 가져오기
  const token = getToken(); // 현재 토큰 가져오기

  const { fetchData: postFetchData, deleteData } = useCrud({
    dbName: DATABASES.CONTENT,
    collectionName: isBlog ? COLLECTIONS.BLOG.POSTS : COLLECTIONS.PROJECT.POSTS,
    token,
    id,
  });
  const {
    data: post,
    isLoading: postLoading,
    isError: postError,
  } = postFetchData as {
    data: Post | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  const handleDelete = () => {
    deleteData.mutate(id, {
      onSuccess: () => {
        router.push(isBlog ? PATHS.BLOG.ROOT : PATHS.PROJECT.ROOT);
      },
    });
  };
  const changeTime = (time: string) =>
    `20${time.slice(0, 2)}년 ${time.slice(2, 4)}월 ${time.slice(
      4,
      6
    )}일 ${time.slice(6, 8)}:${time.slice(8, 10)}`;
  return (
    <>
      <DetailContainer>
        <BackButtonContainer>
          <BackButton
            onClick={() =>
              router.push(isBlog ? PATHS.BLOG.ROOT : PATHS.PROJECT.ROOT)
            }
          >
            ⫷
          </BackButton>
          {isAuthenticated && (
            <EditButtons>
              <BackButton
                onClick={() =>
                  router.push(
                    isBlog ? PATHS.BLOG.UPDATE(id) : PATHS.PROJECT.UPDATE(id)
                  )
                }
              >
                ✏️
              </BackButton>
              <BackButton onClick={handleDelete}>✂️</BackButton>
            </EditButtons>
          )}
        </BackButtonContainer>

        {postLoading && <div>Loading post...</div>}
        {postError && <div>Error loading post.</div>}
        {post && (
          <Content>
            <ContentHeader>
              <DetailTitle>{post.title}</DetailTitle>
              <DetailTag>{`${changeTime(post.time)}`}</DetailTag>
              <DetailTag>{"#" + post.tags.join(" #")}</DetailTag>
            </ContentHeader>
            <MarkdownRenderer content={post.content} />
          </Content>
        )}
      </DetailContainer>
    </>
  );
};

export default Detail;
