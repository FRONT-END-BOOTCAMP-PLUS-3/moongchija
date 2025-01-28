import { detailTypes } from "../types/detailTypes";

const dummyData: detailTypes[] = [
  {
    id: 1,
    information: {
      title: "저녁에 닭발",
      place: "홍대 입구역",
      date: "2025.01.28 (화) 19:00",
      participants: ["고뭉치", "봉미선", "신짱구", "김코난"],
    },
    notice: [
      {
        id: 1,
        content: "늦지마세요. 다들 늦으면 1분당 3만원 입니다. 서로의 시간을 소중히 해요.",
      },
      {
        id: 2,
        content: "옷 잘 챙겨입고 오기!",
      },
    ],
    settlement: {
      items: [
        { id: 1, place: "고깃집", price: 20000 },
        { id: 2, place: "떡볶이", price: 20000 },
        { id: 3, place: "카페", price: 30000 },
        { id: 4, place: "방탈출", price: 30000 },
      ],
      numberOfPeople: 4,
      accountNumber: "123456789123456",
      bank: "KB 국민",
      depositor: "김코난",
    },
    gallery: [
      { id: 1, photo: "image1.jpg", uploader: "고뭉치" },
      { id: 2, photo: "image2.jpg", uploader: "봉미선" },
      { id: 3, photo: "image3.jpg", uploader: "신짱구" },
    ],
  },



  {
    id: 2,
    information: {
      title: "주말 브런치",
      place: "이태원 카페거리",
      date: "2025.02.02 (일) 11:30",
      participants: ["이순신", "안중근", "윤봉길"],
    },
    notice: [
      {
        id: 1,
        content: "브런치 타임입니다. 늦지 말고 꼭 오세요!",
      },
      {
        id: 2,
        content: "늦을 사람들은 미리 말해주기!",
      },
    ],
    settlement: {
      items: [
        { id: 1, place: "브런치 카페", price: 35000 },
        { id: 2, place: "디저트 카페", price: 20000 },
      ],
      numberOfPeople: 3,
      accountNumber: "987654321987654",
      bank: "신한은행",
      depositor: "안중근",
    },
    gallery: [
      { id: 1, photo: "image4.jpg", uploader: "이순신" },
      { id: 2, photo: "image5.jpg", uploader: "안중근" },
    ],
  },



  {
    id: 3,
    information: {
      title: "한강 피크닉",
      place: "뚝섬유원지",
      date: "2025.03.15 (토) 14:00",
      participants: ["김철수", "박영희", "최민수", "이정훈"],
    },
    notice: [
      {
        id: 1,
        content: "피크닉 매트는 제가 가져옵니다! 간단한 음료나 간식을 챙겨 오세요.",
      },
      {
        id: 2,
        content: "선글라스 필요한 사람들은 가져오세요.",
      },
    ],
    settlement: {
      items: [
        { id: 1, place: "편의점 간식", price: 10000 },
        { id: 2, place: "음료수", price: 15000 },
        { id: 3, place: "배달 피자", price: 25000 },
      ],
      numberOfPeople: 4,
      accountNumber: "112233445566778",
      bank: "우리은행",
      depositor: "박영희",
    },
    gallery: [
      { id: 1, photo: "image6.jpg", uploader: "김철수" },
      { id: 2, photo: "image7.jpg", uploader: "박영희" },
      { id: 3, photo: "image8.jpg", uploader: "최민수" },
    ],
  },
];

export default dummyData;
