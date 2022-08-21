import { useState } from "react";
import {
  Button,
  CloseButton,
  OverlayTrigger,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import uploadImage from "../utils/uploadImage";
import styles from "./styles/DragAndDrop.module.scss";

const DragAndDrop = ({
  setIsNotValid,
  setIsFileLoading,
  setIsFileLoaded,
  setUserImg,
  isFileLoaded,
  isFileLoading,
  fileIsNotValid,
  userImg,
  setNameImg,
}: any) => {
  const [drag, setDrag] = useState(false);

  const dragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(true);
  };

  const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
  };

  const onDropHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
    setNameImg(e.dataTransfer.files[0].name);

    uploadImage(
      true,
      e,
      setIsNotValid,
      setIsFileLoading,
      setIsFileLoaded,
      setUserImg
    );
  };

  const handleCloseBtn = () => {
    setIsFileLoaded(false);
    setUserImg("");
  };

  const clearWarning = () => {
    setIsNotValid(false);
  };

  return (
    <div className="d-flex flex-column align-items-center mb-3">
      {!isFileLoaded && (
        <div className="w-100">
          {drag ? (
            <div
              className={`w-100 text-black-50 rounded mb-3 text-center ${styles.file} d-flex justify-content-center align-items-center  border border-primary`}
              onDragStart={(e) => dragStartHandler(e)}
              onDragLeave={(e) => dragLeaveHandler(e)}
              onDragOver={(e) => dragStartHandler(e)}
              onDrop={(e) => onDropHandler(e)}
            >
              {" "}
              Отпустите файл, чтобы загрузить его
            </div>
          ) : (
            <>
              <div
                onDragStart={(e) => dragStartHandler(e)}
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragOver={(e) => dragStartHandler(e)}
                className={`w-100 text-black-50 rounded mb-3 text-center ${styles.file} d-flex justify-content-center align-items-center`}
              >
                {isFileLoading && (
                  <>
                    <div className={"d-flex flex-column align-items-center"}>
                      <div className="mb-2">Файл загружается...</div>
                      <Spinner animation="border" variant="secondary" />
                    </div>
                  </>
                )}

                {!isFileLoading && (
                  <div>
                    {fileIsNotValid && (
                      <>
                        <div>
                          Можно загрузить файл не более 18 Мб с расширениями
                          jpg, jpeg, png. Размер минимум 100х100, максимум
                          8000х8000.
                        </div>
                        <Button
                          className="mt-2"
                          variant="info"
                          onClick={clearWarning}
                        >
                          Понятно
                        </Button>
                      </>
                    )}

                    {!fileIsNotValid && <div>Можно перетащить файл сюда</div>}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
      {isFileLoaded && (
        <div className="position-relative">
          <OverlayTrigger
            placement={"top"}
            overlay={<Tooltip>Удалить файл</Tooltip>}
          >
            <CloseButton
              className={`position-absolute ${styles.close__btn}`}
              onClick={handleCloseBtn}
              aria-label="Hide"
              variant="white"
            />
          </OverlayTrigger>

          <div>
            <img src={userImg} alt="user" width={"200"} height={"200"} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DragAndDrop;
