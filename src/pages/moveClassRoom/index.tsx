import Button from "@/components/button/button";
import Layout from "@/components/layout/layout";
import Tab from "@/components/tab/tab";
import { getToday } from "@/utils/date";
import { styled } from "styled-components";
import { useEffect, useState } from "react";
import ClassMove from "@/components/classMove/classMove";
import { AcceptClassroom, RequestClassRoom } from "@/apis/class-room";
import { RequestClassRoomType } from "@/apis/class-room/type";
import { getStudentString } from "@/utils/util";
import useAcceptListSelection from "@/hooks/userSelect";
import { useNavigate } from "react-router-dom";

const MoveClassroom = () => {
  const TabContent = ["2층", "3층", "4층"];
  const [selectedTab, setSelectedTab] = useState(0);

  const router = useNavigate();

  const { selectedStudents, handleAcceptListClick } = useAcceptListSelection();

  const { data: ReqClassRoom, refetch: RequestClassRoomData } =
    RequestClassRoom(selectedTab + 2, "QUIET");
  const { mutate: Accept } = AcceptClassroom();

  const handleOK = (accept: boolean) => () => {
    const statusProp = accept ? "OK" : "NO";
    Accept(
      { status: statusProp, ids: selectedStudents },
      {
        onSuccess: () => {
          alert("성공");
          window.location.reload();
        },
        onError: () => {
          console.log("실패");
        },
      }
    );
  };

  const handleTabClick = (index: number) => {
    setSelectedTab(index);
  };

  useEffect(() => {
    RequestClassRoomData();
  }, [selectedTab]);

  return (
    <Layout
      title="교실 이동 수락"
      subtitle={getToday()}
      right={
        <ButtonWrap>
          <Button onClick={handleOK(false)} width="65px">
            거절
          </Button>
          <Button onClick={handleOK(true)} width="65px">
            수락
          </Button>
        </ButtonWrap>
      }
    >
      <Tab
        content={TabContent}
        onClick={handleTabClick}
        selectedIndex={selectedTab}
      />
      {ReqClassRoom?.map((item) => (
        <ClassMove
          key={item.id}
          selected={selectedStudents.includes(item.id)}
          userInfo={getStudentString(item)}
          pre={item.move}
          next={item.classroom_name}
          time={`${item.start_period}교시 ~ ${item.end_period}교시`}
          onClick={() => handleAcceptListClick(item.id, getStudentString(item))}
        />
      ))}
      <Button
        onClick={() => {
          router("ok");
        }}
        width="100%"
      >
        교실 이동 학생 보기
      </Button>
    </Layout>
  );
};

export default MoveClassroom;

const ButtonWrap = styled.div`
  height: 34px;
  display: flex;
  gap: 10px;
`;
