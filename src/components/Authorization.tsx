import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthFormSchema, { schema } from "./forms/Authorization/Authorization";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setCookie } from "nookies";
import HeaderLayout from "./HeaderLayout";
import styles from "./styles/Auth.module.scss";

const Authorization = () => {
  const history = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  const onSubmit = async (submitData: any) => {
    try {
      const { data } = await axios.post(
        "http://localhost:4444/auth/login",
        submitData
      );

      setCookie(null, "token", data.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      history("/people");
    } catch (err) {
      console.log("Ошибка при отправке формы аутентификации", err);
    }
  };

  return (
    <HeaderLayout>
      <div
        className={`d-flex justify-content-center align-items-center ${styles.auth}`}
      >
        <Form
          className="w-25 d-flex flex-column"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="d-flex">
            <div className="fs-2 mb-4 mt-3 fw-bolder">Войти</div>
          </div>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{AuthFormSchema.email.label}</Form.Label>
            <Form.Control
              type={AuthFormSchema.email.type}
              placeholder={AuthFormSchema.email.placeholder}
              {...register(AuthFormSchema.email.register)}
            />
            <div className="text-danger ms-2 mt-1">
              {errors.email?.message && String(errors.email?.message)}
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>{AuthFormSchema.password.label}</Form.Label>
            <Form.Control
              type={AuthFormSchema.password.type}
              placeholder={AuthFormSchema.password.placeholder}
              {...register(AuthFormSchema.password.register)}
            />
            <div className="text-danger ms-2 mt-1">
              {errors.password?.message && String(errors.password?.message)}
            </div>
          </Form.Group>

          <div className="d-flex justify-content-center">
            <Button
              className="mb-3 w-50"
              variant="primary"
              type="button"
              size="sm"
              onClick={() => history("/")}
            >
              Перейти к регистрации
            </Button>
          </div>
          <Button variant="primary" type="submit">
            Войти
          </Button>
        </Form>
      </div>
    </HeaderLayout>
  );
};

export default Authorization;
