import InformationDetail from "../../_components/InformationDetail/InformationDetail";
import NoticeDetail from "../../_components/NoticeDetail/NoticeDetail";
import TabMenu from "../../_components/TabMenu/TabMenu";

const InformationPage = () => {
  return (
    <div>
      <TabMenu />
      <InformationDetail />
      <NoticeDetail />
    </div>
  );
};

export default InformationPage;
