import * as yup from 'yup'

export const SignupSchema = yup.object().shape({
    name: yup.string().min(3, "Debe tener mas de 3 caracteres").required("Campo obligatorio"),
    token: yup.string().min(3, "Debe tener mas de 3 caracteres").required("Campo obligatorio"),
    url: yup.string().url().required("Campo obligatorio"),
    isAdmin: yup.boolean()

  })