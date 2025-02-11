import { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import Button from "@/components/button/Button";
import styles from "./../SettlementDetail/SettlementDetail.module.scss";
import { banks } from "../../const/banks";
import { SettlementDto } from "@/application/usecases/appointment/dto/SettlementDto";


type ModalContentProps = {
  initialData: SettlementDto;
  onSuccess?: () => void;
};

const SettlementModalContent = ({
  initialData,
  onSuccess,
}: 
ModalContentProps) => {

  const [totalPrice, setTotalPrice] = useState(0); // 총액
  const [memberCount, setMemberCount] = useState(initialData.memberCount); // 인원 수
  const [dividedPrice, setDividedPrice] = useState(0); // 인당 금액
  const [accountNumber, setAccountNumber] = useState(initialData.accountNumber); // 계좌번호 상태 추가
  const [selectedBank, setSelectedBank] = useState(
    banks.find(
      (bank) => bank.replace(/\s/g, "") === initialData.bank.replace(/\s/g, "")
    ) || banks[0]
  ); // 은행사 상태 추가
  const [accountHolderName, setAccountHolderName] = useState(
    initialData.accountHolderName
  ); // 예금주 상태 추가

  // 장소&금액 input
  const [inputSets, setInputSets] = useState(
    initialData.details.map((item) => ({
      descript: item.descript,
      amount: item.amount,
    }))
  );

  // 인원 수가 변경될 때마다 인당 금액을 계산
  useEffect(() => {
    if (memberCount > 0) {
      setDividedPrice(Math.floor(totalPrice / memberCount)); // 소수점 제거
    }
  }, [totalPrice, memberCount]);

  // inputSets의 price가 변경될 때마다 totalPrice를 업데이트
  useEffect(() => {
    const updatedTotalPrice = inputSets.reduce(
      (acc, set) => acc + set.amount,
      0
    );
    setTotalPrice(updatedTotalPrice);
  }, [inputSets]); // inputSets가 변경될 때마다 실행

  // 새로운 장소&금액 세트 추가
  const addNewSet = () => {
    setInputSets((prevInputSets) => {
      const newSet = { descript: "", amount: 0 };
      return [...prevInputSets, newSet]; // 새로운 세트를 추가
    });
  };

  // 가격을 입력할 때마다 totalPrice를 갱신하는 코드
  const handlePriceChange = (index: number, newPrice: number) => {
    const updatedSets = [...inputSets];
    updatedSets[index].amount = newPrice;
    setInputSets(updatedSets); // inputSets 상태 업데이트
  };

  // 마지막 장소&금액 세트 삭제
  const removeLastSet = () => {
    setInputSets((prevInputSets) => prevInputSets.slice(0, -1)); // 마지막 세트 삭제
  };

  // 수정 완료
  const handleRegister = async () => {
    try {
      const response = await fetch(
        `/api/user/appointments/${initialData.appointmentId}/settlement`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appointmentId: initialData.appointmentId,
            accountNumber: accountNumber,
            accountHolderName: accountHolderName,
            bank: selectedBank,
            memberCount: memberCount,
            details: inputSets,
          }),
        }
      );

      if (!response.ok) throw new Error("정산 등록 실패");

      alert("등록되었습니다");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.log(error);
      alert("정산 등록에 실패했습니다.");
    }
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
                  <input
                    className={styles.price}
                    type="text" // type을 text로 변경하여 숫자 외 입력을 막음
                    placeholder="금액"
                    value={set.amount.toString().replace(/^0+/, "")} // 숫자 앞의 0을 제거
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

              <div className={styles.buttonContainer}>
                {/* + 버튼과 - 버튼을 나란히 배치 */}
                <button className={styles.inputPlusButton} onClick={addNewSet}>
                  <FaPlus className={styles.icon} />
                </button>
                <button
                  className={styles.inputMinusButton}
                  onClick={removeLastSet}
                >
                  <FaMinus className={styles.icon} />
                </button>
              </div>
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
                    value={memberCount.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      // 마이너스 기호가 포함되면 무시
                      if (value.includes("-")) return;
                      setMemberCount(Number(value));
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
                onChange={(e) => setSelectedBank(e.target.value)}
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
                value={accountHolderName} // 예금주 상태 값 사용
                onChange={(e) => setAccountHolderName(e.target.value)} // 예금주 값 업데이트
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

