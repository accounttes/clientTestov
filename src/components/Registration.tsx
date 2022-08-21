import { useEffect, useState } from "react";
import { Button, Form, Alert, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import uploadImage from "../utils/uploadImage";
import DragAndDrop from "./DragAndDrop";
import styles from "./styles/Auth.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import RegisterFormSchema, {
  schema,
} from "./forms/Register/RegisterFormSchema";
import axios from "axios";
import nookies from "nookies";
import { parseCookies } from "nookies";
import { setCookie } from "nookies";
import { useNavigate } from "react-router-dom";
import HeaderLayout from "./HeaderLayout";

const Registration = () => {
  const history = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  const [userImg, setUserImg] = useState<string>("");
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);
  const [isFileLoaded, setIsFileLoaded] = useState<boolean>(false);
  const [fileIsNotValid, setIsNotValid] = useState<boolean>(false);
  const [withDrug, setWithDrug] = useState<boolean>(false);
  const [nameImg, setNameImg] = useState<string>("");
  const [inputKey, setInputKey] = useState<string>("");
  const [regError, setRegError] = useState<string>("");

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setRegError("");
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (regError.length > 0) {
      handleShow();
    } else {
      handleClose();
    }
  }, [regError]);

  const onSubmit = async (submitData: any) => {
    const newObj = JSON.parse(JSON.stringify(submitData));

    newObj["birthDate"] = submitData["birthDate"].toISOString().slice(0, 10);
    newObj["avatarUrl"] = userImg;

    console.log(newObj);

    try {
      const { data } = await axios.post(
        "http://localhost:4444/auth/register",
        newObj
      );
      setRegError("");

      setCookie(null, "token", data.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      history("/people");
    } catch (err: any) {
      console.log("Ошибка при отправке формы регистрации", err);
      setRegError(err.response.data.message);
    }

    const cookies = parseCookies();

    const headers = {
      Authorization: `${cookies.token}`,
    };

    const formData = new FormData();
    const file = submitData["profilePhoto"][0];
    formData.append("image", file);

    if (cookies["token"].length > 0 && !(regError.length > 0)) {
      try {
        const { data } = await axios.post(
          "http://localhost:4444/upload",
          formData,
          {
            headers: headers,
          }
        );

        console.log("url", data.url);
      } catch (err) {
        console.log("Ошибка при отправке аватарки на сервер", err);
      }
    }
  };

  const handleFile = (e: any) => {
    setNameImg(e.target.files[0].name);

    uploadImage(
      false,
      e,
      setIsNotValid,
      setIsFileLoading,
      setIsFileLoaded,
      setUserImg
    );
  };

  return (
    <>
      <HeaderLayout>
        <div
          className={`d-flex justify-content-center align-items-center ${styles.auth}`}
        >
          <Form
            className="w-25 d-flex flex-column"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="d-flex justify-content-center">
              <div className={"fs-2 mb-4 mt-3 fw-bolder"}>
                Зарегистрироваться
              </div>
            </div>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>{RegisterFormSchema.name.label}</Form.Label>
              <Form.Control
                type={RegisterFormSchema.name.type}
                placeholder={RegisterFormSchema.name.placeholder}
                {...register(RegisterFormSchema.name.register)}
              />
              <div className="text-danger ms-2 mt-1">
                {errors.name?.message && String(errors.name?.message)}
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>{RegisterFormSchema.email.label}</Form.Label>
              <Form.Control
                type={RegisterFormSchema.email.type}
                placeholder={RegisterFormSchema.email.placeholder}
                {...register(RegisterFormSchema.email.register)}
              />
              <div className="text-danger ms-2 mt-1">
                {errors.email?.message && String(errors.email?.message)}
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>{RegisterFormSchema.password.label}</Form.Label>
              <Form.Control
                type={RegisterFormSchema.password.type}
                placeholder={RegisterFormSchema.password.placeholder}
                {...register(RegisterFormSchema.password.register)}
              />
              <div className="text-danger ms-2 mt-1">
                {errors.password?.message && String(errors.password?.message)}
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicBirthDate">
              <Form.Label>{RegisterFormSchema.birthDate.label}</Form.Label>
              <Form.Control
                type={RegisterFormSchema.birthDate.type}
                {...register(RegisterFormSchema.birthDate.register)}
              />
              <div className="text-danger ms-2 mt-1">
                {errors.birthDate?.message && String(errors.birthDate?.message)}
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicGender">
              <Form.Label>{RegisterFormSchema.gender.label}</Form.Label>
              <Form.Select {...register(RegisterFormSchema.gender.register)}>
                <>
                  <option>{RegisterFormSchema.gender.firstValue}</option>
                  {RegisterFormSchema.gender.options.map(
                    (o: any, index: number) => (
                      <option key={index} value={o.value}>
                        {o.label}
                      </option>
                    )
                  )}
                </>
              </Form.Select>
              <div className="text-danger ms-2 mt-1">
                {errors.gender?.message && String(errors.gender?.message)}
              </div>
            </Form.Group>

            {isFileLoaded && (
              <>
                <div className="text-center">
                  <div>Фото профиля</div>
                  <div className={`mb-3 ${styles.nameImg}`}>{nameImg}</div>
                </div>
              </>
            )}

            {!isFileLoaded && (
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>{RegisterFormSchema.profilePhoto.label}</Form.Label>
                <Form.Control
                  key={inputKey}
                  type={RegisterFormSchema.profilePhoto.type}
                  accept="image/png, image/gif, image/jpeg"
                  defaultValue={""}
                  onInput={(e) => handleFile(e)}
                  {...register(RegisterFormSchema.profilePhoto.register)}
                />
                <div className="text-danger ms-2 mt-1">
                  {errors.profilePhoto?.message &&
                    String(errors.profilePhoto?.message)}
                </div>
              </Form.Group>
            )}

            <DragAndDrop
              setIsNotValid={setIsNotValid}
              setIsFileLoading={setIsFileLoading}
              setIsFileLoaded={setIsFileLoaded}
              setUserImg={setUserImg}
              isFileLoaded={isFileLoaded}
              isFileLoading={isFileLoading}
              fileIsNotValid={fileIsNotValid}
              userImg={userImg}
              withDrug={withDrug}
              setWithDrug={setWithDrug}
              setNameImg={setNameImg}
            />
            <div className="d-flex justify-content-center">
              <Button
                className="mb-3 w-50"
                variant="primary"
                type="button"
                size="sm"
                onClick={() => history("/auth")}
              >
                Перейти к авторизации
              </Button>
            </div>

            {regError.length > 0 && (
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title className="text-danger">
                    Ошибка при регистрации
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-danger">
                  {" "}
                  {regError}. Попробуйте еще раз. Возможно введенный email уже
                  используется.
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={handleClose}>
                    Понятно
                  </Button>
                </Modal.Footer>
              </Modal>
            )}

            <Button variant="primary" type="submit">
              Зарегистрироваться
            </Button>
          </Form>
        </div>
      </HeaderLayout>
    </>
  );
};

export default Registration;
