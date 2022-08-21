import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import MyPageFormSchema, { schema } from "./forms/MyPage/MyPage";
import HeaderLayout from "./HeaderLayout";
import { useForm } from "react-hook-form";
import uploadImage from "../utils/uploadImage";
import DragAndDrop from "./DragAndDrop";

const MyPage = () => {
  const [me, setMe] = useState<any>({});
  const [isChange, setIsChange] = useState<boolean>(false);

  const [nameImg, setNameImg] = useState<string>("");
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);
  const [isFileLoaded, setIsFileLoaded] = useState<boolean>(false);
  const [fileIsNotValid, setIsNotValid] = useState<boolean>(false);
  const [withDrug, setWithDrug] = useState<boolean>(false);
  const [userImg, setUserImg] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  const onSubmit = async (submitData: any) => {
    console.log("submitData", submitData);
    const cookies = parseCookies();

    const headers = {
      Authorization: `${cookies.token}`,
    };

    submitData["avatarUrl"] = userImg;

    try {
      const { data } = await axios.patch(
        `http://localhost:4444/users/${me["name"]}`,
        submitData,
        {
          headers: headers,
        }
      );

      //   setCookie(null, "token", data.token, {
      //     maxAge: 30 * 24 * 60 * 60,
      //     path: "/",
      //   });
      //   history("/people");
    } catch (err) {
      console.log("Ошибка при отправке формы", err);
    }
  };

  useEffect(() => {
    const cookies = parseCookies();

    const headers = {
      Authorization: `${cookies.token}`,
    };

    const getMe = async () => {
      try {
        const { data } = await axios.get("http://localhost:4444/auth/me", {
          headers: headers,
        });

        console.log("data", data);
        setMe(data);
      } catch (err) {
        console.log("Ошибка при запросе", err);
      }
    };

    getMe();
  }, []);

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
    <HeaderLayout>
      <div className="d-flex justify-content-center align-items-center h-75">
        <Card className="w-25 mt-5" style={{ width: "18rem" }}>
          <Card.Img variant="top" src={me.avatarUrl} />
          <Card.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              {!isChange && <Card.Title>Имя: {me.name}</Card.Title>}
              {isChange && (
                <>
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>{MyPageFormSchema.name.label}</Form.Label>
                    <Form.Control
                      type={MyPageFormSchema.name.type}
                      placeholder={MyPageFormSchema.name.placeholder}
                      {...register(MyPageFormSchema.name.register)}
                    />
                    <div className="text-danger ms-2 mt-1">
                      {errors.name?.message && String(errors.name?.message)}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>{MyPageFormSchema.password.label}</Form.Label>
                    <Form.Control
                      type={MyPageFormSchema.password.type}
                      placeholder={MyPageFormSchema.password.placeholder}
                      {...register(MyPageFormSchema.password.register)}
                    />
                    <div className="text-danger ms-2 mt-1">
                      {errors.password?.message &&
                        String(errors.password?.message)}
                    </div>
                  </Form.Group>

                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>
                      {MyPageFormSchema.profilePhoto.label}
                    </Form.Label>
                    <Form.Control
                      type={MyPageFormSchema.profilePhoto.type}
                      accept="image/png, image/gif, image/jpeg"
                      defaultValue={""}
                      onInput={(e) => handleFile(e)}
                      {...register(MyPageFormSchema.profilePhoto.register)}
                    />
                    <div className="text-danger ms-2 mt-1">
                      {errors.profilePhoto?.message &&
                        String(errors.profilePhoto?.message)}
                    </div>
                  </Form.Group>

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
                </>
              )}
              {!isChange && <Card.Text>Пароль: (скрыто)</Card.Text>}

              {isChange ? (
                <Button type="submit" variant="primary">
                  Сохранить
                </Button>
              ) : (
                <>
                  <Button variant="primary" onClick={() => setIsChange(true)}>
                    Изменить
                  </Button>
                </>
              )}
            </Form>
          </Card.Body>
        </Card>
      </div>
    </HeaderLayout>
  );
};

export default MyPage;
