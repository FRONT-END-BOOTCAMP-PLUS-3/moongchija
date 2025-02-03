"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import Button from "@/components/button/Button";
import styles from "./../SettlementDetail/SettlementDetail.module.scss";
import { banks } from "../../const/banks";
import { FaMinus } from "react-icons/fa";

type SettlementItem = {
  place: string;
  price: number;
};

type ModalProps = {
  handleRegister: (data: {
    items: SettlementItem[];
    numberOfPeople: number;
    accountNumber: string;
    bank: string;
    depositor: string;
  }) => void;
};

const SettlementModalNew = ({ handleRegister }: ModalProps) => {
  const [totalPrice, setTotalPrice] = useState(0); // 총액
  const [numberOfPeople, setNumberOfPeople] = useState(1); // 인원 수 (기본값 1)
  const [dividedPrice, setDividedPrice] = useState(0); // 인당 금액
  const [accountNumber, setAccountNumber] = useState(""); // 계좌번호
  const [selectedBank, setSelectedBank] = useState(banks[0]); // 기본 은행 선택
  const [depositor, setDepositor] = useState(""); // 예금주

  // 장소 & 금액 입력 필드
  const [inputSets, setInputSets] = useState<SettlementItem[]>([{ place: "", price: 0 }]);

  useEffect(() => {
    if (numberOfPeople > 0) {
      setDividedPrice(Math.floor(totalPrice / numberOfPeople));
    }
  }, [totalPrice, numberOfPeople]);

  useEffect(() => {
    const updatedTotalPrice = inputSets.reduce((acc, set) => acc + set.price, 0);
    setTotalPrice(updatedTotalPrice);
  }, [inputSets]);

  const addNewSet = () => {
    setInputSets((prev) => [...prev, { place: "", price: 0 }]);
  };

  const handlePriceChange = (index: number, newPrice: number) => {
    setInputSets((prev) =>
      prev.map((set, idx) => (idx === index ? { ...set, price: newPrice } : set))
    );
  };

  const handleSubmit = () => {
    handleRegister({
      items: inputSets,
      numberOfPeople,
      accountNumber,
      bank: selectedBank,
      depositor,
    });
  };

    // 마지막 장소&금액 세트 삭제
    const removeLastSet = () => {
      setInputSets((prevInputSets) => prevInputSets.slice(0, -1)); // 마지막 세트 삭제
    };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalWrapper}>
        <span className={styles.modalTitle}>새 정산 추가</span>
        <div className={styles.modalBox}>
          <div className={styles.modalListContainer}>
            <div className={styles.modalListWrapper}>
              {inputSets.map((set, index) => (
                <div className={styles.modalListBox} key={index}>
                  <input
                    className={styles.place}
                    type="text"
                    placeholder="장소"
                    value={set.place}
                    onChange={(e) => {
                      const newPlace = e.target.value;
                      setInputSets((prev) =>
                        prev.map((s, idx) => (idx === index ? { ...s, place: newPlace } : s))
                      );
                    }}
                  />
                  <input
                    className={styles.price}
                    type="text"
                    placeholder="금액"
                    value={set.price.toString().replace(/^0+/, "")}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/[^0-9]/.test(value)) return;
                      handlePriceChange(index, Number(value));
                    }}
                  />
                  원
                </div>
              ))}
               <div className={styles.buttonContainer}>
                {/* + 버튼과 - 버튼을 나란히 배치 */}
                <button className={styles.inputPlusButton} onClick={addNewSet}>
                  <FaPlus className={styles.icon} />
                </button>
                <button className={styles.inputMinusButton} onClick={removeLastSet}>
                  <FaMinus className={styles.icon} />
                </button>
              </div>
            </div>

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
                      if (value.includes("-")) return;
                      setNumberOfPeople(Number(value) || 1);
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
                placeholder="-를 제외하고 입력"
                value={accountNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/[^0-9]/.test(value)) return;
                  setAccountNumber(value);
                }}
              />
            </div>
            <div className={styles.bank}>
              <span>은행사</span>
              <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
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
                placeholder="홍길동"
                value={depositor}
                onChange={(e) => setDepositor(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.modalEditButton}>
        <Button text="추가하기" size="sm" color="--primary-color" active={true} onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default SettlementModalNew;
