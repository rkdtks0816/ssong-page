"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import {
  WriteContainer,
  WriteContent,
  ContentHeader,
  WriteTitle,
  WriteTag,
  TagButton,
  ContentInput,
  ButtonContainer,
  PreViewContent,
} from "./styles";
import { COLLECTIONS, DATABASES, PATHS } from "@/shared/constants";
import useCrud from "@/hooks/useCrud";
import { useAuth } from "@/hooks/useAuth"; // 로그인 상태 확인 훅
import { Post, Tag } from "@/shared/interfaces";
import { useToken } from "@/hooks/useToken";

interface WriteFormProps {
  isBlog: boolean;
  postId?: string;
}

const WriteForm: React.FC<WriteFormProps> = ({ isBlog, postId }) => {
  const { isAuthenticated } = useAuth(); // 로그인 상태 확인
  const { getToken } = useToken(); // 토큰 가져오기
  const token = getToken(); // 현재 토큰 가져오기
  const { fetchData, createData, updateData } = useCrud({
    dbName: DATABASES.CONTENT,
    collectionName: isBlog ? COLLECTIONS.BLOG.POSTS : COLLECTIONS.PROJECT.POSTS,
    id: postId,
    token,
  });
  const {
    data: post,
    isLoading: postLoading,
    isError: postError,
  } = fetchData as {
    data: Post | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  const { fetchData: fetchTag, createData: createTag } = useCrud({
    dbName: DATABASES.CONTENT,
    collectionName: isBlog ? COLLECTIONS.BLOG.TAGS : COLLECTIONS.PROJECT.TITLES,
    token,
  });

  const {
    data: tags,
    isLoading: tagsLoading,
    isError: tagsError,
  } = fetchTag as {
    data: Tag[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  const [inputTitle, setInputTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [inputContent, setInputContent] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // 로그인 상태 확인: 인증되지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated === false) {
      router.push(PATHS.LOGIN);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (postId && post) {
      setInputTitle(post.title);
      setSelectedTags(post.tags);
      setInputContent(post.content);
    }
  }, [postId, post]);

  useEffect(() => {
    handleTextareaInput();
  }, [inputContent]);

  const toggleTag = (tag: string) => {
    if (selectedTags.some((t) => t === tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() === "") return;
    if (!isBlog && newUrl.trim() === "") return;

    const tagData = isBlog
      ? { name: newTag.trim() }
      : { name: newTag.trim(), url: newUrl.trim() };
    createTag.mutate(tagData, {
      onSuccess: () => {
        setNewTag("");
        setNewUrl("");
        fetchTag.refetch();
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = selectedTags.map((tag) => tag);
    const postData = {
      title: inputTitle,
      tags: tagsArray,
      content: inputContent,
    };
    if (!postId) {
      createData.mutate(postData, {
        onSuccess: (id) => {
          router.push(
            (isBlog ? PATHS.BLOG.ROOT : PATHS.PROJECT.ROOT) + `/${id}`
          );
        },
        onError: (error) => {
          console.error("Failed to create post:", error);
        },
      });
    } else {
      updateData.mutate(
        { id: postId, updates: postData },
        {
          onSuccess: () => {
            router.push(
              (isBlog ? PATHS.BLOG.ROOT : PATHS.PROJECT.ROOT) + `/${postId}`
            );
          },
          onError: (error) => {
            console.error("Failed to update post:", error);
          },
        }
      );
    }
  };

  const handleTextareaInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // 초기화
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 컨텐츠에 맞게 높이 설정
    }
  };

  // 인증되지 않은 경우 로딩 중 메시지 표시
  if (!isAuthenticated) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {postId && postLoading && <div>Loading post...</div>}
      {postId && postError && <div>Error loading post.</div>}
      {((postId && post) || !postId) && (
        <WriteContainer>
          <WriteContent>
            <ContentHeader>
              <WriteTitle>
                <input
                  type="text"
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  required
                  placeholder="제목을 입력하세요."
                />
              </WriteTitle>
              <WriteTag>
                {tagsLoading && <p>Loading tags...</p>}
                {tagsError && <p>Failed to load tags</p>}
                {!tagsLoading && !tagsError && tags && (
                  <div className="tag-list">
                    {tags.map((tag) => (
                      <TagButton
                        key={tag._id}
                        onClick={() => toggleTag(tag.name)}
                        selected={selectedTags.some((t) => t === tag.name)}
                      >
                        {tag.name}
                      </TagButton>
                    ))}
                  </div>
                )}
                <div className="add-tag">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="새 태그 추가"
                  />
                  {!isBlog && (
                    <input
                      type="text"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="새 Url 추가"
                    />
                  )}
                  <button onClick={handleAddTag}>Add Tag</button>
                </div>
              </WriteTag>
            </ContentHeader>
            <ContentInput
              ref={textareaRef}
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              required
              placeholder="내용을 입력하세요."
            />
            <ButtonContainer>
              <button className="cancel" onClick={() => router.back()}>
                Cancel
              </button>
              <button className="submit" onClick={handleSubmit}>
                Submit
              </button>
            </ButtonContainer>
          </WriteContent>
          <PreViewContent>
            <MarkdownRenderer content={inputContent} />
          </PreViewContent>
        </WriteContainer>
      )}
    </>
  );
};

export default WriteForm;
