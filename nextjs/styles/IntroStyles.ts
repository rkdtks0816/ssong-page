import styled from "styled-components";
import { COLORS } from "@/shared/constants/colors";

export const IntroContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: calc(100vh - 150px);
  position: relative;
  display: flex;
  align-items: center;
`;

export const IntroSongKangSan = styled.img`
  height: 100%;
`;

export const IntroInfoContainer = styled.div`
  position: absolute;
  max-width: 450px;
  right: 0;
  top: 20%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const IntroInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #d7fbe8;
  opacity: 0.8;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  padding: 15px;
  border-radius: 10px;
`;

export const IntroTitle = styled.div`
  .name {
    font-size: 24px;
    font-weight: bold;
    font-family: "HakgyoansimByeolbichhaneul";
  }
`;

export const IntroBox = styled.div`
  width: calc(100% - 12px);
  padding-right: 12px;
  background-color: #ffffff;
  border-radius: 10px;
`;

export const IntroStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #d7fbe8;
  opacity: 0.8;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 15px;
  border-radius: 10px;
  .scoreContainer {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 10px;
    background-color: #ffffff;
  }

  .label {
    font-size: 20px;
    font-family: "HakgyoansimByeolbichhaneul";
  }

  .score {
    width: 100px;
    height: 20px;
    display: flex;
    justify-content: space-between;
  }

  .filled,
  .empty {
    width: 25%;
    height: 100%;
    clip-path: polygon(30% 0, 100% 0, 70% 100%, 0 100%);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }

  .filled {
    background-color: ${COLORS.text};
  }

  .empty {
    background-color: ${COLORS.accent};
  }
`;
