"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import Button from "@/components/button/Button";
import styles from "./../SettlementDetail/SettlementDetail.module.scss";
import { banks } from "../../const/banks";

type SettlementItem = {
  amount: number;
  descript: string;
};

interface SettlementModalNewProps {
  appointmentId: number; 
  onSuccess?: () => void; 
}

const SettlementModalNew = ({ appointmentId, onSuccess }: SettlementModalNewProps) => {
  const [totalPrice, setTotalPrice] = useState(0); // 총액
  const [memberCount, setMemberCount] = useState(1); // 인원 수 (기본값 1)
  const [dividedPrice, setDividedPrice] = useState(0); // 인당 금액
  const [accountNumber, setAccountNumber] = useState(""); // 계좌번호
  const [selectedBank, setSelectedBank] = useState(banks[0]); // 기본 은행 선택
  const [accountHolderName, setAccountHolderName] = useState(""); // 예금주

  // 장소 & 금액 입력 필드
  const [inputSets, setInputSets] = useState<SettlementItem[]>([
    { descript: "", amount: 0 },
  ]);
  

  // 인원 수가 변경될 때마다 인당 금액 계산
  useEffect(() => {
    if (memberCount > 0) {
      setDividedPrice(Math.floor(totalPrice / memberCount));
    }
  }, [totalPrice, memberCount]);

  // 총 금액 업데이트
  useEffect(() => {
    const updatedTotalPrice = inputSets.reduce((acc, set) => acc + set.amount, 0);
    setTotalPrice(updatedTotalPrice);
  }, [inputSets]);

  // 새로운 장소 & 금액 추가
  const addNewSet = () => {
    setInputSets((prev) => [...prev, { descript: "", amount: 0 }]);
  };

  // 금액 변경 시, "amount" 키 업데이트
  const handlePriceChange = (index: number, newPrice: number) => {
    setInputSets((prev) =>
      prev.map((set, idx) =>
        idx === index ? { ...set, amount: newPrice } : set
      )
    );
  };

  // 등록
  const handleRegister = async () => {
    try {
      const response = await fetch(`/api/user/appointments/${appointmentId}/settlement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointmentId,
          accountNumber: accountNumber,
          accountHolderName: accountHolderName,
          bank: selectedBank,
          memberCount: memberCount,
          details: inputSets, // [{ descript, amount }, ...] 형태로 전송됨
        }),
      });

      if (!response.ok) throw new Error("정산 등록 실패");

      alert("등록되었습니다");
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error(error);
      alert("정산 등록에 실패했습니다.");
    }
  };

  // 마지막 장소 & 금액 세트 삭제
  const removeLastSet = () => {
    setInputSets((prevInputSets) => prevInputSets.slice(0, -1));
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
                  {/* 장소 입력: 값은 set.descript, onChange에서 descript 업데이트 */}
                  <input
                    className={styles.place}
                    type="text"
                    placeholder="장소"
                    value={set.descript}
                    onChange={(e) => {
                      const newPlace = e.target.value;
                      setInputSets((prev) =>
                        prev.map((s, idx) =>
                          idx === index ? { ...s, descript: newPlace } : s
                        )
                      );
                    }}
                  />
                  {/* 금액 입력: 값은 set.amount, onChange에서 amount 업데이트 */}
                  <input
                    className={styles.price}
                    type="text"
                    placeholder="금액"
                    value={set.amount.toString().replace(/^0+/, "")}
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
                    value={memberCount.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.includes("-")) return;
                      setMemberCount(Number(value));
                    }}
                    onBlur={() => setMemberCount(Number(memberCount))}
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
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
              />
              
            </div>
          </div>
        </div>
      </div>

      <div className={styles.modalEditButton}>
        <Button
          text="추가하기"
          size="sm"
          color="--primary-color"
          active={true}
          onClick={handleRegister}
        />
      </div>
    </div>
  );
};

export default SettlementModalNew;
