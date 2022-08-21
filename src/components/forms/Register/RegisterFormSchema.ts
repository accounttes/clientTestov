import * as yup from "yup";

const RegisterFormSchema = {
  name: {
    register: "name",
    type: "text",
    label: "Имя",
    placeholder: "Введите имя",
    validation: yup.string().required("Поле обязательно для заполнения"),
  },
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
  birthDate: {
    register: "birthDate",
    type: "date",
    label: "Дата рождения",
    validation: yup
      .date("Дата должна быть указана в правильном формате")
      .nullable()
      .typeError("Дата должна быть указана в правильном формате")
      .required("Обязательно для заполнения"),
  },
  gender: {
    register: "gender",
    label: "Пол",
    firstValue: "Выбрать пол",
    validation: yup
      .number()
      .required("Обязательно для заполнения")
      .test(
        "Is positive?",
        "Пол не выбран",
        (value: number) => Number(value) > 0
      )
      .typeError("Пол не выбран"),

    options: [
      { value: 1, label: "Мужской" },
      { value: 2, label: "Женский" },
      { value: 3, label: "Другой" },
    ],
  },
  profilePhoto: {
    register: "profilePhoto",
    type: "file",
    label: "Фото профиля",
  },
};

export const schema = yup
  .object({
    name: RegisterFormSchema.name.validation,
    email: RegisterFormSchema.email.validation,
    password: RegisterFormSchema.password.validation,
    birthDate: RegisterFormSchema.birthDate.validation,
    gender: RegisterFormSchema.gender.validation,
  })
  .required("Поле обязательно для заполнения");

export default RegisterFormSchema;
