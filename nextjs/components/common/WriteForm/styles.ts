import { COLORS } from "@/shared/constants";
import styled from "styled-components";

export const WriteContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 0px;
`;

export const WriteContent = styled.div`
  max-width: 600px;
  width: calc(100% - 40px);
  margin-top: 90px;
  padding: 0 20px;
  height: fit-content;
`;

export const PreViewContent = styled.div`
  max-width: 560px;
  width: calc(100% - 40px);
  margin: 90px 20px 0 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const ContentHeader = styled.div`
  width: 100%;
  padding-bottom: 20px;
  border-bottom: 1px dashed ${COLORS.text};
`;

export const WriteTitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  input {
    padding: 10px;
    margin-right: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
    flex-grow: 1;
  }
`;

export const WriteTag = styled.div`
  div.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }

  div.add-tag {
    display: flex;
    align-items: center;

    input {
      padding: 5px;
      margin-right: 8px;
      border-radius: 5px;
      border: 1px solid #ccc;
      flex-grow: 1;
    }

    button {
      padding: 5px 10px;
      border-radius: 5px;
      border: none;
      background-color: ${COLORS.text};
      color: #fff;
      cursor: pointer;
    }
  }
`;

export const TagButton = styled.button<{ selected: boolean }>`
  padding: 5px 10px;
  border-radius: 15px;
  border: 1px solid ${COLORS.secondary};
  background-color: ${(props) => (props.selected ? `${COLORS.text}` : "#fff")};
  color: ${(props) => (props.selected ? "#fff" : `${COLORS.text}`)};
  cursor: pointer;
`;

export const ContentInput = styled.textarea`
  width: 100%;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
  overflow: hidden;
  font-size: 16px;
  line-height: 1.5;
  box-sizing: border-box;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;

  button {
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }

  button.submit {
    background-color: ${COLORS.text};
    color: #fff;
    border: none;
  }

  button.cancel {
    background-color: #fff;
    color: ${COLORS.text};
    border: 1px solid ${COLORS.secondary};
  }
`;
