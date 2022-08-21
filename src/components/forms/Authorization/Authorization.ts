import * as yup from "yup";

const AuthFormSchema = {
  email: {
    register: "email",
    type: "email",
    label: "Почта",
    placeholder: "Введите почту",
    validation: yup
      .string()
      .email("Неверная почта")
      .required("Обязательно для заполнения"),
  },
  password: {
    register: "password",
    type: "password",
    label: "Пароль",
    placeholder: "Введите пароль",
    validation: yup
      .string()
      .min(6, "Длина пароля должна быть не менее 6 симоволов")
      .required("Обязательно для заполнения"),
  },
};

export const schema = yup
  .object({
    email: AuthFormSchema.email.validation,
    password: AuthFormSchema.password.validation,
  })
  .required("Поле обязательно для заполнения");

export default AuthFormSchema;
