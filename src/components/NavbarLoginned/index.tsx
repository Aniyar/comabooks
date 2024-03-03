import "./index.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "assets/comabooks-white.svg";
import {
  AnswerEntityDto,
  QuestionTemplateDto,
  TempalteResponceDto,
} from "generated";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { thunkSetPage } from "slicers/page_slicer";

type Photo = {
  id: string;
  title: string;
  date: string;
};

const mockPhotos: Photo[] = [
  { id: "photo1", title: "Sunset at the beach", date: "2021-07-01" },
  { id: "photo2", title: "A day in the mountains", date: "2021-08-15" },
  { id: "photo3", title: "Family picnic", date: "2021-09-05" },
  { id: "photo4", title: "Sunset at the beach", date: "2021-07-01" },
  { id: "photo5", title: "A day in the mountains", date: "2021-08-15" },
  { id: "photo6", title: "Family picnic", date: "2021-09-05" },
  { id: "photo7", title: "Sunset at the beach", date: "2021-07-01" },
  { id: "photo8", title: "A day in the mountains", date: "2021-08-15" },
  { id: "photo9", title: "Family picnic", date: "2021-09-05" },
  { id: "photo10", title: "Sunset at the beach", date: "2021-07-01" },
  { id: "photo11", title: "A day in the mountains", date: "2021-08-15" },
  { id: "photo12", title: "Family picnic", date: "2021-09-05" },
];

const NavbarLoginned = ({
  templateId,

  onEditCover,
  onToggleView,
}: {
  templateId: string;
  onEditCover: () => void;
  onToggleView: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const templateDto = useSelector<RootState, TempalteResponceDto | undefined>(
    (state) => state.templates.templates.find((val) => val._id == templateId)
  );

  const answerMap = useSelector<RootState, Record<string, AnswerEntityDto>>(
    (state) => state.activeAnswers.answers
  );
  const currentPage = useSelector<RootState, number>(
    (state) => state.page.value
  );

  const [isCoverButtonClicked, setIsCoverButtonClicked] = useState(false);
  const [isViewingPhotos, setIsViewingPhotos] = useState(false);

  const handleTogglePhotos = () => {
    setIsViewingPhotos(!isViewingPhotos);
    onToggleView();
  };

  const handleEditCoverClick = () => {
    onEditCover();
    setIsCoverButtonClicked(true);
  };

  const wrappedSetCurrentPage = (pageIndex: number) => {
    dispatch(thunkSetPage(pageIndex));
    setIsCoverButtonClicked(false);
  };

  const pageFilled = Object.values(answerMap).filter((val) =>
    val.answer.replaceAll(" ", "")
  ).length;
  if (templateDto == null) return <></>;

  return (
    <aside className="sidebar">
      <div className="forms-info-container">
        <div className="forms">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <div className="forms-info">
            <progress value={pageFilled} max={templateDto.questions.length} />
            <div className="page-numbers">
              {pageFilled}
              {pageFilled <= templateDto.questions.length
                ? `/${templateDto.questions.length} страниц заполнено`
                : " страниц заполнено"}
            </div>
          </div>
        </div>
      </div>
      {isViewingPhotos ? (
        <>
          <ul className="photo-list">
            {mockPhotos.map((photo) => (
              <li key={photo.id}>
                <div className="photo-list-one">{photo.title}</div>
              </li>
            ))}
          </ul>
          <div className="sidebar-bottom-fixed-add-photo">
            <button>+ Добавить фото </button>
          </div>
        </>
      ) : (
        <ul className="questions-list">
          {templateDto.questions.map((templateQuestion, index) => {
            const isCurrent = index + 1 === currentPage;
            const isAnswered =
              answerMap[templateQuestion._id]?.answer?.replaceAll(" ", "") ??
              "";

            let bgColor = "transparent";
            if (isCurrent) {
              bgColor = "#845B99";
            }
            if (isAnswered && !isCurrent) {
              bgColor = "#45334E";
            }
            if (isAnswered && isCurrent) {
              bgColor = "#845B99";
            }

            return (
              <li key={index}>
                <button
                  onClick={() => wrappedSetCurrentPage(index + 1)}
                  style={{
                    backgroundColor: bgColor,
                    borderRadius: "4px",
                  }}
                >
                  {index + 1}. {templateQuestion.question}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <div className="sidebar-bottom-fixed">
        <button
          className="sidebar-bottom-fixed-cover"
          onClick={handleTogglePhotos}
        >
          {isViewingPhotos ? "Перейти к вопросам" : "Перейти к фото"}
        </button>
        <button
          className={`sidebar-bottom-fixed-cover ${
            isCoverButtonClicked ? "clicked" : ""
          }`}
          onClick={handleEditCoverClick}
        >
          Изменить обложку
        </button>
      </div>
    </aside>
  );
};

export default NavbarLoginned;
