import * as yup from "yup";

const MyPageFormSchema = {
  name: {
    register: "name",
    type: "text",
    label: "Имя",
    placeholder: "Введите имя",
    validation: yup.string().required("Поле обязательно для заполнения"),
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
  profilePhoto: {
    register: "profilePhoto",
    type: "file",
    label: "Фото профиля",
  },
};

export const schema = yup
  .object({
    name: MyPageFormSchema.name.validation,
    password: MyPageFormSchema.password.validation,
  })
  .required("Поле обязательно для заполнения");

export default MyPageFormSchema;
