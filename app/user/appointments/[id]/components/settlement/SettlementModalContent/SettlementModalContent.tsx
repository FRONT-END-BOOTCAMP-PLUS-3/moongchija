"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import Button from "@/components/button/Button";
import styles from "./../SettlementDetail/SettlementDetail.module.scss";

type ModalContentProps = {
  handleRegister: () => void;
};

const banks = [
  "NH농협",
  "카카오뱅크",
  "KB국민",
  "토스뱅크",
  "신한",
  "우리",
  "IBK기업",
  "하나",
  "새마을",
  "부산",
  "IM뱅크(대구)",
  "케이뱅크",
  "신협",
  "우체국",
  "SC제일",
  "경남",
  "광주",
  "수협",
  "전북",
  "저축은행",
  "제주",
  "씨티",
  "KDB산업",
  "산림조합",
  "SBI저축은행",
];

const SettlementModalContent = ({ handleRegister }: ModalContentProps) => {
  const [totalPrice, setTotalPrice] = useState(100000); // 총액
  const [numberOfPeople, setNumberOfPeople] = useState(4); // 인원 수
  const [dividedPrice, setDividedPrice] = useState(0); // 인당 금액
  const [accountNumber, setAccountNumber] = useState("123456789123456"); // 계좌번호 상태 추가
  const [selectedBank, setSelectedBank] = useState("국민은행"); // 은행사 상태 추가
  const [depositor, setDepositor] = useState("김코난"); // 예금주 상태 추가

  // 장소:금액 input
  const [inputSets, setInputSets] = useState([
    { place: "고깃집", price: 10000 }, // 첫 번째 세트는 10000원으로 초기화
  ]);

  // 인원 수가 변경될 때마다 인당 금액을 계산
  useEffect(() => {
    if (numberOfPeople > 0) {
      setDividedPrice(totalPrice / numberOfPeople);
    }
  }, [totalPrice, numberOfPeople]);

  // inputSets의 price가 변경될 때마다 totalPrice를 업데이트
  useEffect(() => {
    const updatedTotalPrice = inputSets.reduce((acc, set) => acc + set.price, 0);
    setTotalPrice(updatedTotalPrice);
  }, [inputSets]); // inputSets가 변경될 때마다 실행

  // 새로운 장소:금액 세트 추가
  const addNewSet = () => {
    setInputSets((prevInputSets) => {
      const newSet = { place: "", price: 0 }; // 항상 10000원을 추가
      return [...prevInputSets, newSet]; // 새로운 세트를 추가
    });
  };

  // 가격을 입력할 때마다 totalPrice를 갱신하는 코드
  const handlePriceChange = (index: number, newPrice: number) => {
    const updatedSets = [...inputSets];
    updatedSets[index].price = newPrice;
    setInputSets(updatedSets); // inputSets 상태 업데이트
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalWrapper}>
        <span className={styles.modalTitle}>정산 내역</span>
        <div className={styles.modalBox}>
          {/* 내역 목록 */}
          <div className={styles.modalListContainer}>
            <div className={styles.modalListWrapper}>
              {inputSets.map((set, index) => (
                <div className={styles.modalListBox} key={index}>
                  <input
                    className={styles.place}
                    type="text"
                    value={set.place}
                    readOnly
                  />
                  <input
                    className={styles.price}
                    type="text" // type을 text로 변경하여 숫자 외 입력을 막음
                    value={set.price.toString().replace(/^0+/, "")} // 숫자 앞의 0을 제거
                    onChange={(e) => {
                      const value = e.target.value;
                      // 한글이나 숫자가 아닌 문자가 입력되면 무시
                      if (/[^0-9]/.test(value)) return;
                      handlePriceChange(index, Number(value)); // 가격을 변경하면 총액을 갱신
                    }}
                  />
                  원
                </div>
              ))}

              <button className={styles.inputPlusButton} onClick={addNewSet}>
                <FaPlus className={styles.icon} />
              </button>
            </div>

            {/* 결과 */}
            <div className={styles.modalResultBox}>
              <div className={styles.totalPrice}>
                <span>총 액</span>
                <div className={styles.currency}>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
              </div>

              <div className={styles.numberOfPeople}>
                <span>인원 수</span>
                <div className={styles.numberInput}>
                  <span className={styles.divide}>÷</span>
                  <input
                    type="number"
                    value={numberOfPeople}
                    onChange={(e) => {
                      const value = e.target.value;
                      // 마이너스 기호가 포함되면 무시
                      if (value.includes("-")) return;
                      setNumberOfPeople(Number(value));
                    }}
                  />
                  <span>명</span>
                </div>
              </div>

              <div className={styles.dividedPrice}>
                <span>인 당</span>
                <div className={styles.priceInput}>
                  <span>{dividedPrice.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          </div>

          <span className={styles.modalAccountTitle}>정산 계좌 정보</span>
          <div className={styles.modalAccountBox}>
            <div className={styles.account}>
              <span>계좌 번호</span>
              <input
                type="text"
                value={accountNumber} // 계좌번호 상태 값 사용
                onChange={(e) => {
                  const value = e.target.value;
                  // 숫자만 입력 가능하도록 필터링
                  if (/[^0-9]/.test(value)) return;
                  setAccountNumber(value); // 계좌번호 상태 업데이트
                }}
              />
            </div>
            <div className={styles.bank}>
              <span>은행사</span>
              <select
                value={selectedBank} // 선택된 은행 상태 값 사용
                onChange={(e) => setSelectedBank(e.target.value)} // 선택된 값 업데이트
              >
                {banks.map((bank, index) => (
                  <option key={index} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.depositor}>
              <span>예금주</span>
              <input
                type="text"
                value={depositor} // 예금주 상태 값 사용
                onChange={(e) => setDepositor(e.target.value)} // 예금주 값 업데이트
              />
            </div>
          </div>
        </div>
      </div>

      {/* 모달 내 수정하기 버튼 */}
      <div className={styles.modalEditButton}>
        <Button
          text="수정하기"
          size="sm"
          color="--primary-color"
          active={true}
          onClick={handleRegister}
        />
      </div>
    </div>
  );
};

export default SettlementModalContent;
