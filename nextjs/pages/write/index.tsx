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
} from "../../styles/WriteStyles";
import { COLLECTIONS, DATABASES, PATHS } from "@/shared/constants";
import useCrud from "@/hooks/useCrud";
import { useAuth } from "@/hooks/useAuth"; // 로그인 상태 확인 훅
import { Tag } from "@/shared/interfaces";
import { useToken } from "@/hooks/useToken";

const Write: React.FC = () => {
  const [isBlog, setIsBlog] = useState(true);
  const { isAuthenticated } = useAuth(); // 로그인 상태 확인
  const { getToken } = useToken(); // 토큰 가져오기
  const token = getToken(); // 현재 토큰 가져오기
  const { createData } = useCrud({
    dbName: DATABASES.CONTENT,
    collectionName: isBlog ? COLLECTIONS.BLOG.POSTS : COLLECTIONS.PROJECT.POSTS,
    token,
  });
  const { fetchData, createData: createTag } = useCrud({
    dbName: DATABASES.CONTENT,
    collectionName: isBlog ? COLLECTIONS.BLOG.TAGS : COLLECTIONS.PROJECT.TITLES,
    token,
  });

  const {
    data: tags,
    isLoading: tagsLoading,
    isError: tagsError,
  } = fetchData as {
    data: Tag[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  const [inputTitle, setInputTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [inputContent, setInputContent] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // 로그인 상태 확인: 인증되지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const toggleTag = (tag: Tag) => {
    if (selectedTags.some((t) => t._id === tag._id)) {
      setSelectedTags((prev) => prev.filter((t) => t._id !== tag._id));
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
        fetchData.refetch();
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = selectedTags.map((tag) => tag.name);
    const postData = {
      title: inputTitle,
      tags: tagsArray,
      content: inputContent,
    };

    createData.mutate(postData, {
      onSuccess: (id) => {
        router.push((isBlog ? PATHS.BLOG.ROOT : PATHS.PROJECT.ROOT) + `/${id}`);
      },
      onError: (error) => {
        console.error("Failed to create post:", error);
      },
    });
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
            <TagButton
              onClick={() => setIsBlog((pre) => !pre)}
              selected={!isBlog}
            >
              {isBlog ? "블로그" : "프로젝트"}
            </TagButton>
          </WriteTitle>
          <WriteTag>
            {tagsLoading && <p>Loading tags...</p>}
            {tagsError && <p>Failed to load tags</p>}
            {!tagsLoading && !tagsError && tags && (
              <div className="tag-list">
                {tags.map((tag) => (
                  <TagButton
                    key={tag._id}
                    onClick={() => toggleTag(tag)}
                    selected={selectedTags.some((t) => t._id === tag._id)}
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
          onInput={handleTextareaInput}
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
  );
};

export default Write;
