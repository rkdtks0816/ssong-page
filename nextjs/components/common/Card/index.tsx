import React from "react";
import { Post } from "@/shared/interfaces/post";
import { CardContainer, CardTag, CardTitle } from "./styles";
import { useRouter } from "next/router";

const Card: React.FC<{ post: Post; path: string }> = ({ post, path }) => {
  const router = useRouter();

  const changeTime = (time: string) =>
    `20${time.slice(0, 2)}년 ${time.slice(2, 4)}월 ${time.slice(4, 6)}일`;

  return (
    <>
      <CardContainer onClick={() => router.push(path + `/${post._id}`)}>
        <CardTitle>{post.title}</CardTitle>
        <CardTag>{changeTime(post.time)}</CardTag>
      </CardContainer>
    </>
  );
};

export default Card;
