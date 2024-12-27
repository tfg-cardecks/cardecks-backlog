// Datos válidos para un usuario
export const user = {
  email: "john@gmail.com",
  username: "johndoe",
  password: "@16Febrero",
  role: "authenticated",
};

export const user2 = {
  email: "johnY2@gmail.com",
  username: "johndoeY2",
  password: "@16Febrero",
  role: "authenticated",
};

// Datos inválidos para usuarios
export const badUsers = [
  // Falta el email
  {
    username: "johndoe",
    password: "@16Febrero",
    role: "authenticated",
  },
  // Email no válido (debe ser gmail/hotmail/outlook)
  {
    email: "udjejdkj@dkekjdk",
    username: "johndoe",
    password: "@16Febrero",
    role: "authenticated",
  },
  // Falta el nombre de usuario
  {
    email: "r@gmail.com",
    password: "@16Febrero",
    role: "authenticated",
  },
  // Nombre de usuario demasiado corto
  {
    email: "r@gmail.com",
    username: "j",
    password: "@16Febrero",
    role: "authenticated",
  },
  // Nombre de usuario demasiado largo
  {
    email: "r@gmail.com",
    username: "Este es un nombre de usuario muy largo",
    password: "@16Febrero",
    role: "authenticated",
  },
  // Falta la contraseña
  {
    email: "r@gmail.com",
    username: "johndoe",
    role: "authenticated",
  },
  // Contraseña demasiado corta (pero con formato correcto)
  {
    email: "r@gmail.com",
    username: "johndoe",
    password: "aA@1",
    role: "authenticated",
  },
  // Contraseña con formato no válido
  {
    email: "r@gmail.com",
    username: "johndoe",
    password: "123456",
    role: "authenticated",
  },
  // Validar usuario único
  {
    email: "john@gmail.com",
    username: "johndoe",
    password: "@16Febrero",
    role: "authenticated",
  },
];
