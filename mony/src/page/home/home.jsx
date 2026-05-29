import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../../component/menu";
import HomeHeader from "../../component/homeheader";
import Banner from "../../component/banner";
import profile from "../../assets/home/homeprofile.svg";
import Char from "../../assets/home/char.svg";
import Logo from "../../assets/menu/Logo.svg";
import Economy from "../../assets/home/economy.svg";
import Young from "../../assets/home/young.svg";
import HomeIcon from "../../assets/home/home.svg";
import Dog from "../../assets/home/dog.svg";
import Cancer from "../../assets/home/cancer.svg";
import Health from "../../assets/home/health.svg";
import Apartment from "../../assets/home/apartement.svg";
import Database from "../../assets/home/database.svg";
import Policy from "../../assets/home/policy.svg";
import Refresh from "../../assets/home/formkit_refresh.svg";
import coinRun from "../../assets/home/coin_run.png";
import MonyImg from "../../assets/home/mony.svg";

import "./home.css";
import {
  CountUp,
  ProgressFill,
  cardMotion,
  staggerContainerVariants,
  staggerItemVariants,
  revealVariants,
} from "../../component/homeMotion.jsx";

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
const weekDates = ["29", "30", "31", "1", "2", "3", "4"];
const recentItems = [
  {
    color: "lime",
    label: "저축",
    time: "오전 10:00",
    title: "국민은행에 방문해서 생활비 저축하기",
  },
  {
    color: "cyan",
    label: "지출",
    time: "오후 5:00",
    title: "필라테스 4월 정기 이용권 지출",
  },
  {
    color: "pink",
    label: "수입",
    time: "오후 4:30",
    title: "메가커피 기간제 아르바이트 3월 월급 받은 날",
  },
];

const quickEntries = [
  { icon: "$", label: "이번 달 쓴 돈", value: "-428,000원", note: "이번 달 지출을 정리했어요" },
  { icon: "B", label: "이번 달 모은 돈", value: "+124,000원", note: "고정 지출은 안정적이에요" },
  { icon: "⚡", label: "이번 달 목표", value: "김수한무의 카방카드", note: "목표 카드에 가까워지고 있어요" },
  { icon: "◔", label: "카테고리", value: "식비 31%", note: "식비 비중이 조금 높아요" },
];

const benefitRows = [
  {
    amount: "2,100원",
    period: "3-4월의 혜택",
    cardName: "현대 제로 카드",
    pointTitle: "포인트 적립",
    pointValue: "2,100원",
    discountTitle: "누적 결제 할인 혜택",
    discountValue: "100원",
  },
  {
    amount: "17원",
    period: "3-4월의 혜택",
    cardName: "카카오페이머니",
    pointTitle: "포인트 적립",
    pointValue: "17원",
    discountTitle: "누적 결제 할인 혜택",
    discountValue: "0원",
  },
];

const talkGroups = [
  {
    key: "youth",
    title: "청년&생활",
    items: [
      {
        key: "youth-1",
        icon: Economy,
        label: "취업역량강화",
        title: "경기청년 갭이어",
        popupContestTitle:
          "청년 & 생활 | 경기도 청년에게는 돈도 받으면서 취업 역량을 강화할 수 있는 지원이 있어요.",
        popupTitle: "모니 TALK",
        popupDate: "2026.03.31",
        popupBody:
          "진로 고민이 많은 20-30대 청년이라면 내가 정말 하고 싶은 일이 무엇일지 고민해본 적이 있을 거예요. 경기도에서는 청년들의 고민 해결과 취업 역량 강화를 위한 최대 500만원까지 지원 받을 수 있는 경기 청년 갭이어 프로그램을 운영해요. 고용노동부에서도 청년도전지원사업을 운영하고 있으니 신청 대상과 방법을 확인해보세요.\n경기 청년 갭이어 프로그램은 청년이 직접 흥미와 적성에 맞는 프로젝트를 경험하며 취업 역량을 강화하도록 돕는 프로그램이에요. 참여자로 선정된다면 최대 500만원 수행비와 전문 멘토링을 받게 되며 우수 프로젝트로 선정이 된다면 추가 지원금도 최대 300만원을 받을 수 있어요. 경기 청년 갭이어 프로그램은 서류, 면접 심사를 거친 뒤 600명 청년을 선발해요. 경기도에 거주하는 만 19세-39세(1986-2007년)이라면 누구나 지원할 수 있어요. 4월 3일 자정까지 잡아바 어플라이 홈페이지에서 개인 또는 팀으로 지원할 수 있어요.",
        popupFooter:
          "신청방법: 잡아바 어플라이 홈페이지에서 온라인 접수  |  지원조건: 경기도 거주 만 19세-39세(1986-2007년생)  |  기간: 3. 18 - 4. 3 (자정)\n프로젝트 실행: 최대 500만원 지원 및 역량 강화 교육 프로그램 연계\n이 뉴스레터는 카카오페이의 페이어텐션에서 일부 발췌했어요.",
      },
      {
        key: "youth-2",
        icon: Young,
        label: "법정공휴일",
        title: "5월 1일은 공휴일",
        popupTitle: "모니 TALK",
        popupDate: "2026.03.31",
        popupContestTitle:"청년 & 생활 | 올해 5월 1일 부터는 공휴일이에요. 공휴일이 되면서 달라진 점을 알려드려요.",
        popupBody:
          "지난 3월 1일, 5월 1일 노동절이 공휴일로 지정되는 공휴일법 개정안이 국회 본회의를 통과했어요. 작년까지 5월 1일은 근로기준법에 따른 법정유급휴일로서 근로자의 날은 민간기업 근로자만 쉴 수 있었어요. 올해부터는 공무원도 5월 1일에 쉴 수 있게 되었어요. 관공서, 학교, 국공립유치원 등도 모두 닫아요. 불가피하게 근로해야 할 때는 휴일 수당이나 대체휴가를 요구할 수 있어요. 앞으로 각종 계약이나 행정 서류 상의 법적 기간을 계산할 때는 5월 1일이 기간에서 제외되어요. 이는 5월 1일이 마감날인 경우 그 다음 평일로 자동 연장 된다는 거에요.  \n\n 2026년 5월 1일은 금요일이라서 금-토-일 황금같은 3일 연휴를 즐길 수 있어요. 5월 4일에 연차를 내면 5월 5일 어린이날까지 5일 휴가도 가능해요. 한편 근로자의 날이라는 명칭도 변경 되는 데요, 지난해 국회 본회의에서 노동절 제정 관련 법률 통과로 올해부터 적용되었고 노동절이라는 명칭이 63년만에 다시 복원되는 것 이에요. 노동절은 1886년 미국 노동자들이 하루 8시간 노동을 쟁취하고자 투쟁을 기념하는 메이데이에서 유래했어요. 다가오는 봄의 기운과 함께 노동절의 의미를 되새기면서 뜻깊은 휴일 보내세요.",
        popupFooter:"이 뉴스레터는 카카오페이의 페이어텐션에서 일부 발췌했어요.",
      },
      {
        key: "youth-3",
        icon: HomeIcon,
        label: "봄나들이",
        title: "숙박세일 페스타",
        popupTitle: "모니 TALK",
        popupDate: "2026.03.08",
        popupContestTitle:"청년 & 생활 | 나라에서 올해 첫 숙박 쿠폰을 나눠줘요. 봄 나들이 여행을 떠나보는건 어떨까요?",
        popupBody: "국내 여행에서 사용할 수 있는 쿠폰을 나눠주는 대한민국 숙박세일 페스타, 정부에서 4월 8일부터 올해 첫 숙박 할인권을 나눠주고 있어요. 문화체육 관광부와 한국관광공사는 4월 8일부터 4월 30일까지 발급 및 입실할 수 있는 2026년 봄 숙박세일 페스타의 봄편을 진행하고 있어요. 특히 올해부터는 7만원까지 할인 받을 수 있다고 해요. 봄편 쿠폰은 서울, 경기, 인천, 세종을 제외한 전국에서 사용할 수 있고, 2박 이상 숙박 시 7만원까지 할인 받을 수 있어요. 7만원 이상 숙소 예약 시 3만원, 7만원 미만 숙소 예약시 2만원을 할인 받고 2일 이상 연박인 경우 추가로 할인 받을 수 있어요. 총 숙박비가 14만원 이상인 경우 7만원, 14만원 미만인 경우 5만원을 할인해줘요. \n\n 숙박세일 페스타에 참여하는 온라인 여행사를 통해 매일 오전 10시부터 발급받을 수 있어요. 각 여행사의 홈페이지나 어플리케이션에 들어가면 숙박세일페스타 이벤트 페이지에서 확인 할 수 있을 거예요. 쿠폰은 1인 1매 선착순으로 발급되며 다운 받은 후 사용하지 않은 쿠폰은 다음 날 오전 7시에 사라져요. 이후에 다시 발급 받을 수 있고 선착순인 만큼 쿠폰이 소진되면 마감 될 수 있으니 주의해주세요.",
        popupFooter:"참여 여행사 리스트 : 카카오톡 예약하기, 놀(야놀자), 여기어때, 마이리얼트립, 지마켓, 롯데온\n2026년 봄맞이 숙박 세일 페스타 일정 | 발급 및 입실 기간: 2026년 4.8(수) ~ 2026.4.30(목)\n이 뉴스레터는 카카오페이의 페이어텐션에서 일부 발췌했어요.",
      },
    ],
  },
  {
    title: "보험",
    items: [
      {
        key: "insurance-1",
        icon: Dog,
        label: "세계 강아지의 날",
        title: "강아지 산책은 매일?",
        popupTitle: "모니 TALK",
        popupDate: "2026.03.31",
        popupContestTitle:"보험 | 강아지를 매일 산책 시켜야 할까요?",
        popupBody:
          "3월 23일은 세계 강아지의 날이에요. 세계적으로 반려견을 키우는 인구가 계속 증가하고 있는데요, 2024년 말 기준 국내 반려견은 약 546만 마리로 추산되고 있어요. 그런데 강아지는 매일 산책 시켜야 한다는 이야기, 많이 들어보셨을텐데요, 정말 매일 산책 시켜야 할까요? \n\n 강아지마다 필요한 산책량이 달라요 먼저 산책이 강아지에게 이로운 활동이며 심폐 기능을 강화하고, 장운동을 촉진해 배변 리듬을 일정하 게 유지시켜줘요. 또한 바깥 세상을 탐색하며 얻는 다양한 자극은 강아지에 게 긍정적인 정서적 변화를 가져다준다고 해요. 과도한 짖음, 파괴적인 행동, 분리 불안의 심화 등 강아지의 행동 문제도 에너지가 적절히 해소되지 않을 때 나타나는 신호일 수 있어요. 다만, 산책이 좋다는 것과 매일 산책을 해야 한다는 건 별개예요. 수의학계에서 는 강아지의 견종, 나이, 체력 및 건강 상태에 따라 산책 권장량이 크게 달라질 수 있다고 강조해요. \n\n 날씨에 따라서도 주의해야 할 사항으로, 요즘같이 황사나 미세먼지는 사람보다 지면에 가까이 걷는 강아지들이 오염물질 에 더 많이 노출돼요. 날씨가 좋지 않거나, 강아지의 건강 상태로 외출이 어려운 날은 실내 활동으로 충분히 대체할 수 있어요. 노즈워크(후각 탐색 놀이)는 강아지의 인지 기능을 자극하고 신체 운동 못지않은 에너지 소비를 이끌어내요. 간식을 숨겨두고 찾게 하거나, 킁킁 매트를 활용하는 것도 좋아요.",
        popupFooter:"이 뉴스레터는 카카오페이의 페이어텐션에서 일부 발췌했어요.",
      },
      {
        key: "insurance-2",
        icon: Cancer,
        label: "건강",
        title: "나에게 맞는 암 보험",
        popupTitle: "모니 TALK",
        popupDate: "2026.03.31",
        popupContestTitle:"보험 | 암이 발견되면 어떻게 해야할까? 암 보험은 이렇게 준비하세요.",
        popupBody:
          "3월 21일은 암 예방의 날이에요. 세계보건기구(WHO)에서는 암 중 3분의 1은 예방이 가능하고, 3분의 1은 조 기 진단 및 조기 치료로 완치가 가능하며, 나머지 3분의 1의 암 환자도 적절한 치료를 하면 완화가 가능하다고 바라보고 있어요. 여기서 나온 '3-2-1' 때문에 3월 21일을 암 예방의 날로 정했어요. 올바른 식습관, 생활습관을 통해 암을 예방하는 게 가장 중요하지만, 한국인의 사망 1위 질환이 '암'인 만큼 특히 우리나라 사람들은 암을 발견했을 때를 미리 대비해야 해요. 그래서 많은 분들이 암 진단비 보험에 가입하는데요, 진단비만으로도 충분한 도움을 받을 수 있을까요? \n\n 최근 현대 의학이 발전함에 따라 암 치료 기술도 같이 진화하고 있어요. 암에 걸리더라도 치료만 잘한다면 생존율을 크게 늘릴 수 있죠. 주기적으로 국가건강검진을 받아 암을 조기에 발견하는 경우도 많아졌어요. 많은 분들이 준비하는 암 진단비는 병원에서 암이라고 진단을 받았을 때 일시적으로 보험금을 지급하기 때문에 암을 처음 발견한 초기에는 경제적인 도움 이 되지만, 장기적인 치료가 필요한 암은 오랜 기간 꾸준히 경제적인 지원이 필요해요.  \n\n 암 보험을 이렇게 준비해보세요. 첫째, 암 보험이 없는 분들이라면 진단비 보장을 가장 먼저 고려해보세요. 암이라는 진단을 받기만 해도 보험금을 받을 수 있어요. 둘째, 암 진단비 보장이 있는 분들이라면 치료 비용을 지원받을 수 있는 치료비 보장을 추천해요.",
        popupFooter:"이 뉴스레터는 카카오페이의 페이어텐션에서 일부 발췌했어요.",
        
      },
      {
        key: "insurance-3",
        icon: Health,
        label: "건강",
        title: "시민 안전 보험",
        popupTitle: "모니 TALK",
        popupContestTitle:"보험 | 내가 사는 지역에서 무료로 들어주는 보험에 대해 알고 있나요?",
        popupDate: "2026.03.31",
        popupBody:
          "우리가 아프거나 다치면 보험을 통해 보상을 받죠. 만약 내가 개인적으로 가입 해둔 보험이 없다면, 당연히 보상을 못 받는다고 생각하기 쉬워요. 그런데 우리도 모르게 자동으로 가입되어 있는 보험이 있대요. 시민안전보험이라는 제도를 확인해보세요. 시민안전보험은 해당 지역에 주민등록을 둔 시민이라면 누구나 자동으로 가입 되는 보험이에요. 일상생활에서 발생하는 재난이나 사고 피해를 입은 시민들의 생활 안정을 위해 각 지방자치단체가 가입하고 있어요. 보험료는 100% 무료예요. 지자체에서 보험료를 대신 내 주거든요. 나이, 성별, 직업도 상관없고, 병력이 있어도 가입할 수 있어요. 내가 가입한 보험과 중복 보장도 가능해요. \n\n 많은 분들이 이런 제도가 있는지 몰라서 보상을 못 받는다고 해요. 만약 대중교 통을 이용하다가 다쳤거나, 화재, 자연재해 등의 피해를 입은 적 있다면, 3년 이내 시민안전보험을 통해 보험금을 청구할 수 있어요. 국내 어디든지 사고 발생 지역에 상관없이 보상을 받을 수 있어요. 서울 사람 이 부산에서 다쳐도 서울시의 보험으로 보장돼요. 지역에 따라 강도나 감염병, 농기계 사고를 포함하는 곳도 있어요. 시민안전보험의 보장 범위는 지역마다 달라요. 우리 동네는 어디까지 보장해 주는지 궁금하다면, 지역 홈페이지에서 동네무료보험을 검색해보세요.",
        popupFooter:"이 뉴스레터는 카카오페이의 페이어텐션에서 일부 발췌했어요.",
      },
    ],
  },
  {
    key: "realestate",
    title: "부동산",
    items: [
      {
        key: "realestate-1",
        icon: Apartment,
        label: "청약저축 소득공제",
        title: "주택청약 종합 저축",
        popupTitle: "모니 TALK",
        popupContestTitle:"부동산 | 올해부터 청약저축 소득공제의 대상이 확대되었어요.",
        popupDate: "2026.03.31",
        popupBody:
          "주택청약 종합저축이란, 새 집의 분양 신청을 위해서는 꼭 필요한 통장이에요. 나라에서는 주택청약저축을 권장하기 위해 연말정산 소득공제 혜택을 주고 있어요. 올해부터는 세대주의 배우자까지 대상이 확대되면서 부부가 청약저축 소득공제를 함께 신청한다면 부부 합산 240만원의 소득공제를 받을 수 있어 체감하는 효과가 큽니다.  \n\n  연말정산 소득공제 조건은 한 해 안 납입한 전체 금액이기 때문에 쉽게 생각한다면 12월에 300만원을 한꺼번에 입금해도 공제 혜택을 받을 수 있다는 거에요. 다만 소득공제 뿐만 아니라 나중에 청약까지 노려본다면 한 번에 큰 돈을 내기 보다는 매달 일정한 금액을 나눠서 납입하는 게 더 좋아요. 또한 공제 조건을 확인하여 연말정산에서 청약저축 소득공제를 받으려면 소득과 주택 조건을 충족해야해요. 이는 근로소득의 여부, 총급여액이 7,000만원 이하, 내 명의의 주택 청약 통장 가입, 12월 31일 기준 무주택 세대주 혹은 세대주 배우자여야해요. 이외에도 올해 연말정산부터는 자녀양육지원, 중산층 혜택 확대 등의 공제와 감면 혜택도 있으니 놓치지 말고 꼭 챙겨보세요.",
        popupFooter:"이 뉴스레터는 카카오페이의 페이어텐션에서 일부 발췌했어요.",
      },
      {
        key: "realestate-2",
        icon: Database,
        label: "전세사기",
        title: "전세 계약 확인하기",
        popupTitle: "모니 TALK",
        popupDate: "2026.03.31",
        popupContestTitle:"부동산 | 계약을 앞두고 있을 때, 전세 계약 전 악성 임대인을 조회하세요.",
        popupBody:
          "주택도시보증공사가 전세 보증금을 떼먹은 악성임대인 127명의 명단을 공개했어요. 임대인과 임차인 사이의 정보 불균형으로 반복되는 전세사기가 발생되고 있어요. 정부에서는 임차인들이 계약 전 임대인의 정보를 확인할 수 있는 상습 채무불이행자 명단 공개 제도를 시작했어요. 악성임대인이 떼먹은 보증금 중 가장 큰 액수는 707억 원이었고 최연소 악성 임대인은 26살이라고 해요. 이러한 임대인의 정보는 일반 국민이라면 누구나 국토교통부 홈페이지 또는 주택도시보증공사 홈페이지와 앱에서 명단을 확인할 수 있어요. \n\n 서울시에서는 임차주택 권리관계 및 임대인 신용정보 까지 공개하는 클린임대인 제도를 시행하고 있어요. 클린임대인은 서울 소재의 주택의 권리관계가 깨끗하고 KCB신용점수가 891점 이상인 임대인을 대상으로 해요. 신용정보, 전세보증금 등의 사고를 예방하기 위해 제도적인 장치를 추가적으로 마련하고 있어요. 가짜 집주인과의 계약, 이중계약 등의 상황에서 보장 받을 수 있는 보험을 통해 확인해보세요.",
        popupFooter:"이 뉴스레터는 카카오페이의 페이어텐션에서 일부 발췌했어요.",
      },
      {
        key: "realestate-3",
        icon: Policy,
        label: "정책",
        title: "새로운 부동산 정책",
        popupTitle: "모니 TALK",
        popupDate: "2026.03.31",
        popupContestTitle:"부동산 | 아파트 가격 안정화를 위한 부동산 대책이 발표되었어요.",
        popupBody:
          "2024년 8월 8일, 정부는 집값 안정화를 위한 부동산 대책을 발표했어요. 서울의 그린벨트를 풀고, 재건축과 재개발을 촉진하여 주택 공급을 늘리겠다는 것이 핵심이에요. 가장 화제를 모은 것은 그린벨트 헤제애요. 집값이 오르는데에 대표적인 것이 수요에 비해 공급이 부족하다는 점이에요. 서울과 수도권은 이제 집을 지을 땅이 남지 않아 대규모 공급이 어려운 상태에요. 정부는 8만 호 가량의 주택을 새로 공급하기로 발표했으며 이는 서울 내 그린벨트를 대규모로 12년만에 헤제하게 되었어요. 유력 후보지로는 강남구 수서동과 세곡동, 서초구 내곡동과 양제동, 송파구 방이동 등이 거론 되고 있어요. \n\n 아파트 뿐만 아닌 빌라와 다세대주택 등을 살려 비아파트 시장을 살리는 분산 정책도 내놓았어요. 정부는 그간 11만 호의 신축 빌라를 매입하여 공공임대주택으로 활용하기로 헀어요. 해당 주택을 분양 받을 수 있는 분양전환형 신축매입 제도를 적용해요. 이번정책은 즉각적인 공급 확대로 이어지기는 어려워요. 재건축 활성화가 실제 주택 공급으로 이어지기까지 긴 시간이 소요되고, 최대 5-6년 까지 걸릴 것이라고 밝혔어요. 부동상 시장에 관심이 많다면 이와 같은 대책을 놓치지 말고 알아두면 좋겠네요.",
        popupFooter:"이 뉴스레터는 카카오페이의 페이어텐션에서 일부 발췌했어요.",
      },
    ],
  },
];

const currentMonthLabel = "2026년 3월";
const todayLabel = getTodayLabel(new Date("2026-03-31T00:00:00"));

function parseMoney(value) {
  return Number(String(value).replace(/[^0-9]/g, "")) || 0;
}

function getTodayLabel(date = new Date()) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = weekDays[date.getDay()];

  return `오늘 · ${month}월 ${day}일 (${weekday})`;
}

function getBucketGoal() {
  try {
    const raw = localStorage.getItem("bucketGoal");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Home() {
  const navigate = useNavigate();
  const [activeTalkGroupIndex, setActiveTalkGroupIndex] = useState(0);
  const [activeTalkItem, setActiveTalkItem] = useState(null);
  const activeTalkGroup = talkGroups[activeTalkGroupIndex];
  const benefitCardRef = useRef(null);
  const benefitCardInView = useInView(benefitCardRef, { once: true, amount: 0.4 });
  const savingsProgressRef = useRef(null);
  const savingsProgressInView = useInView(savingsProgressRef, { once: true, amount: 0.6 });

  const [savingsGoal, setSavingsGoal] = useState(() => {
    const n = Number(localStorage.getItem("mony_savings_goal") ?? 0);
    return n > 0 ? n : 100000;
  });
  const [savedAmount, setSavedAmount] = useState(() => {
    const n = Number(localStorage.getItem("mony_saved_amount") ?? -1);
    return n >= 0 ? n : 32000;
  });
  const [savingsToast, setSavingsToast] = useState(false);
  const [bucketGoal, setBucketGoal] = useState(null);

  const savingsProgress = Math.min(1, savedAmount / savingsGoal);
  const savingsPct = Math.min(100, Math.round(savingsProgress * 100));
  const bucketTargetAmount = Number(bucketGoal?.targetAmount ?? 0);
  const bucketCurrentSaved = Number(bucketGoal?.currentSaved ?? 0);
  const bucketProgressPercent = bucketTargetAmount
    ? Math.min((bucketCurrentSaved / bucketTargetAmount) * 100, 100)
    : 0;
  const bucketProgress = bucketProgressPercent / 100;
  const bucketProgressPct = Math.round(bucketProgressPercent);

  const handleQuickSave = () => {
    const next = savedAmount + 5000;
    setSavedAmount(next);
    localStorage.setItem("mony_saved_amount", String(next));
    setSavingsToast(true);
    setTimeout(() => setSavingsToast(false), 2500);
  };

  const handleTalkRefresh = () => {
    setActiveTalkGroupIndex((currentIndex) => (currentIndex + 1) % talkGroups.length);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setActiveTalkItem(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    setBucketGoal(getBucketGoal());
  }, []);

  return (
    <main className="home-page">
      <div className="home-shell">
        <Menu />

        <section className="home-main">
          <HomeHeader />
          <Banner />

          <motion.section
            className="home-metrics"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.22 }}
          >
            <motion.article
              className="home-metricCard home-metricCard--goal"
              variants={staggerItemVariants}
              {...cardMotion}
            >
              <p className="home-metricLabel">4월의 소비 목표</p>
              <div className="home-metricRow">
                <h3>천천히 소비하기</h3>
                <strong>
                  <CountUp value={48} suffix="%" formatter={(n) => `${n}`} />
                </strong>
              </div>
              <div className="home-progress">
                <ProgressFill className="home-progressBar" value={0.48} />
              </div>
            </motion.article>

            <motion.article
              className="home-metricCard home-metricCard--spending"
              variants={staggerItemVariants}
              {...cardMotion}
            >
              <p className="home-metricLabel">이번 달의 소비</p>
              <div className="home-metricRow">
                <h3>김수한무의 카방카드</h3>
                <strong>
                  <CountUp value={326000} suffix="원" />
                </strong>
              </div>
              <p className="home-muted">지난달 대비 소비 지출이 12% 증가했어요.</p>
            </motion.article>

            <motion.article
              className="home-metricCard home-metricCard--accent home-metricCard--today"
              variants={staggerItemVariants}
              {...cardMotion}
            >
              <div className="home-todayContent">
                <p className="home-metricLabel">오늘의 소비</p>
                <div className="home-metricRow">
                  <h3 className="home-metricInline">
                    총 <CountUp value={28000} suffix="원" /> / <CountUp value={100000} suffix="원" />
                  </h3>
                </div>
                <p className="home-muted">하루 소비 목표 금액에 도달하지 않았어요</p>
              </div>
              <img className="home-profileImage" src={profile} alt="" aria-hidden="true" />
            </motion.article>
          </motion.section>

          <motion.section
            className="home-savingsSection"
            variants={revealVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.article className="home-savingsCard" {...cardMotion}>
              <div className="home-savingsHeader">
                <div className="home-savingsHeaderText">
                  <p className="home-metricLabel">이번 달 저축 챌린지</p>
                  <h3>저축 저금통</h3>
                </div>
                <span className="home-savingsPiggy" aria-hidden="true">🪙</span>
              </div>

              <div className="home-savingsStats">
                <div className="home-savingsStat">
                  <span>현재 적립</span>
                  <strong className="is-lime">
                    <CountUp value={savedAmount} suffix="원" />
                  </strong>
                </div>
                <div className="home-savingsDivider" />
                <div className="home-savingsStat">
                  <span>이번 달 목표</span>
                  <strong>{savingsGoal.toLocaleString()}원</strong>
                </div>
                <div className="home-savingsDivider" />
                <div className="home-savingsStat">
                  <span>달성률</span>
                  <strong>{savingsPct}%</strong>
                </div>
              </div>
              <div
                ref={savingsProgressRef}
                className={`home-savingsProgressTrack ${
                  savingsProgressInView ? "is-running" : ""
                }`}
                style={{ "--savings-progress": savingsProgress }}
              >
                <img className="coin-run" src={coinRun} alt="" aria-hidden="true" />
                <div className="home-progress">
                  <ProgressFill className="home-progressBar" value={savingsProgress} />
                </div>
              </div>

              <div className="home-savingsActions">
                <button type="button" className="home-savingsBtn" onClick={handleQuickSave}>
                  + 5,000원 적립하기
                </button>
                {savingsPct >= 50 && (
                  <div className="home-savingsAchieve">
                    <span aria-hidden="true">🏅</span>
                    <span>50% 달성 리워드 배지 획득!</span>
                  </div>
                )}
              </div>

              {savingsToast && (
                <div className="home-savingsToast" role="status" aria-live="polite">
                  🪙 5,000원이 저금통에 적립됐어요!
                </div>
              )}
            </motion.article>
          </motion.section>

          <motion.section
            className="home-sectionTitle"
            variants={revealVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
          >
            <h3>김수한무 님의 활발한 4월의 소비를 확인해보세요! 🍃</h3>
          </motion.section>

          <motion.section
            className="home-bottomGrid"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.18 }}
          >
            <motion.article className="home-panelCard home-bucketCard" variants={staggerItemVariants} {...cardMotion}>
              {bucketGoal ? (
                <>
                  <p className="home-panelMeta">나의 버킷리스트 목표</p>
                  <h3 className="home-panelTitle home-bucketTitle">{bucketGoal.bucketList}</h3>

                  <div className="home-bucketStats">
                    <div>
                      <span>목표 금액</span>
                      <strong>{bucketTargetAmount.toLocaleString()}원</strong>
                    </div>
                    <div>
                      <span>월 저축</span>
                      <strong>{Number(bucketGoal.monthlySaving ?? 0).toLocaleString()}원</strong>
                    </div>
                    <div>
                      <span>예상 기간</span>
                      <strong>{bucketGoal.estimatedPeriod}</strong>
                    </div>
                    <div>
                      <span>현재 저축액</span>
                      <strong>{bucketCurrentSaved.toLocaleString()}원</strong>
                    </div>
                  </div>

                  <div className="home-bucketProgress">
                    <div className="home-bucketProgressHead">
                      <span>목표 달성률</span>
                      <strong>{bucketProgressPct}%</strong>
                    </div>
                    <div className="home-progress">
                      <ProgressFill className="home-progressBar" value={bucketProgress} />
                    </div>
                  </div>

                  <div className="home-bucketSteps">
                    <p>AI 저축 플랜 3단계</p>
                    {bucketGoal.steps?.slice(0, 3).map((step, index) => (
                      <div key={`${step.title}-${index}`} className="home-bucketStep">
                        <span>{step.step ?? index + 1}단계</span>
                        <strong>{step.title}</strong>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="home-bucketEmpty">
                  <p className="home-panelMeta">나의 버킷리스트 목표</p>
                  <h3 className="home-panelTitle">아직 설정된 버킷리스트 목표가 없어요</h3>
                  <button
                    type="button"
                    className="home-bucketSetupBtn"
                    onClick={() => navigate("/onbording2")}
                  >
                    목표 설정하러 가기
                  </button>
                </div>
              )}
            </motion.article>

            <motion.article className="home-panelCard" variants={staggerItemVariants} {...cardMotion}>
              <p className="home-panelMeta">{currentMonthLabel}</p>
              <h3 className="home-panelTitle">최근 사용 내역</h3>

              <div className="home-summaryCard">
                <div className="home-summaryIcon">S</div>
                <div className="home-summaryText">
                  <span>이번 달 쓴 돈</span>
                  <strong>-428,000원</strong>
                </div>
                <div className="home-summaryText">
                  <span>이번 달 모은 돈</span>
                  <strong>+124,000원</strong>
                </div>
                <div className="home-summaryText">
                  <span>이번 달 지출 목표 지정 카드</span>
                  <strong>김수한무의 카방카드</strong>
                </div>
              </div>

              <div className="home-quickGrid">
                {quickEntries.map((entry) => (
                  <div key={entry.label} className="home-quickItem">
                    <div className="home-quickIcon">{entry.icon}</div>
                    <div className="home-quickText">
                      <span>{entry.label}</span>
                      <strong>{entry.value}</strong>
                      <small>{entry.note}</small>
                    </div>
                  </div>
                ))}
              </div>
            </motion.article>
          </motion.section>
          <motion.section
            className="home-bottomFeature"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.18 }}
          >
            <motion.h3 className="home-bottomFeatureTitle" variants={staggerItemVariants}>
              김수한무 님만을 위한 소비 이야기를 발견해보세요 ⭐
            </motion.h3>

            <div className="home-bottomFeatureGrid">
              <motion.article
                ref={benefitCardRef}
                className="home-featureCard home-featureCard--benefit"
                variants={staggerItemVariants}
                {...cardMotion}
              >
                <div className="home-featureHeader">
                  <div>
                    <p className="home-featureLabel">결제 수단 혜택</p>
                    <h4 className="home-featureTitle">현대카드</h4>
                  </div>
                  <img className="home-featureIcon" src={Char} alt="" aria-hidden="true" />
                </div>

                <div className="home-benefitList">
                  {benefitRows.map((row) => (
                    <div key={row.cardName} className="home-benefitRow">
                      <div className="home-benefitMain">
                        <strong>
                          {benefitCardInView ? (
                            <CountUp value={parseMoney(row.amount)} suffix="원" />
                          ) : (
                            "0원"
                          )}
                        </strong>
                        <span>{row.period}</span>
                      </div>

                      <div className="home-benefitCardName">
                        <span>결제 혜택 지정 카드</span>
                        <strong>{row.cardName}</strong>
                      </div>

                      <div className="home-benefitMeta">
                        <div>
                          <span>{row.pointTitle}</span>
                          <strong>
                            {benefitCardInView ? (
                              <CountUp value={parseMoney(row.pointValue)} suffix="원" />
                            ) : (
                              "0원"
                            )}
                          </strong>
                        </div>
                        <div>
                          <span>{row.discountTitle}</span>
                          <strong>
                            {benefitCardInView ? (
                              <CountUp value={parseMoney(row.discountValue)} suffix="원" />
                            ) : (
                              "0원"
                            )}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.article>

              <motion.article className="home-featureCard home-featureCard--talk" variants={staggerItemVariants} {...cardMotion}>
                <div className="home-featureHeader">
                  <div>
                    <p className="home-featureLabel">모니 TALK</p>
                    <h4 className="home-featureTitle is-lime">{activeTalkGroup.title}</h4>
                  </div>
                  <button
                    type="button"
                    className="home-featureRefresh"
                    aria-label="새로고침"
                    onClick={handleTalkRefresh}
                  >
                    <img src={Refresh} alt="" aria-hidden="true" />
                  </button>
                </div>

                <div className="home-talkList">
                  {activeTalkGroup.items.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className="home-talkItem"
                      onClick={() => setActiveTalkItem(item)}
                    >
                      <img className="home-talkIconImage" src={item.icon} alt="" aria-hidden="true" />
                      <span className="home-talkText">
                        <small>{item.label}</small>
                        <strong>{item.title}</strong>
                      </span>
                    </button>
                  ))}
                </div>
              </motion.article>

              <motion.article className="home-featureCard home-featureCard--budget" variants={staggerItemVariants} {...cardMotion}>
                <p className="home-featureLabel">예산목표를 설정해볼까요?</p>
                <img className="home-budgetAvatar" src={MonyImg} alt="" aria-hidden="true" />
              </motion.article>
            </div>
          </motion.section>

          {activeTalkItem && (
            <div
              className="home-talkModalBackdrop"
              role="presentation"
              onClick={() => setActiveTalkItem(null)}
            >
              <div
                className="home-talkModal"
                role="dialog"
                aria-modal="true"
                aria-label={activeTalkItem.title}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className="home-talkModalClose"
                  aria-label="팝업 닫기"
                  onClick={() => setActiveTalkItem(null)}
                >
                  ×
                </button>

                <div className="home-talkModalHeader">
                  <div className="home-talkModalHeaderRow">
                    <p className="home-talkModalKicker">{activeTalkItem.popupTitle}</p>
                  </div>
                  <div className="home-talkModalHeaderRow">
                    <h3 className="home-talkModalTitle">
                      {activeTalkItem.popupContestTitle ?? activeTalkItem.title}
                    </h3>
                    <span className="home-talkModalDate">{activeTalkItem.popupDate}</span>
                  </div>
                </div>
                <hr className="home-talkModalSeparator"/>

                <p className="home-talkModalBody">{activeTalkItem.popupBody}</p>
                {activeTalkItem.popupFooter && (
                  <p className="home-talkModalFooter">{activeTalkItem.popupFooter}</p>
                )}
              </div>
            </div>
          )}

          <div className="footer">
            <p>소비에 더 나은 이유를,</p>
            <img className="footerLogo" src={Logo} alt="Mony" />
          </div>
        </section>
        
      </div>
    </main>
  );
}
