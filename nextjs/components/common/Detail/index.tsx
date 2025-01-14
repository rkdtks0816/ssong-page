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
  DetailContent,
  DetailTag,
  DetailTitle,
} from "./styles";
import useCrud from "@/hooks/useCrud";
import { DATABASES } from "@/shared/constants";

const Detail: React.FC<{
  redirect: string;
  collection: string;
  id: string;
}> = ({ redirect, collection, id }) => {
  const router = useRouter();

  const { fetchData: postFetchData } = useCrud({
    dbName: DATABASES.CONTENT,
    collectionName: collection,
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

  const changeTime = (time: string) =>
    `20${time.slice(0, 2)}년 ${time.slice(2, 4)}월 ${time.slice(
      4,
      6
    )}일 ${time.slice(6, 8)}:${time.slice(8, 10)}`;
  return (
    <>
      <DetailContainer>
        <DetailContent>
          <BackButtonContainer>
            <BackButton onClick={() => router.push(redirect)}>⫷</BackButton>
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
        </DetailContent>
      </DetailContainer>
    </>
  );
};

export default Detail;
