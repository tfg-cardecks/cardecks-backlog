// name, lastName, email, username, password, role
export const user = {
  name: "John",
  lastName: "Doe",
  email: "john@gmail.com",
  username: "johndoe",
  password: "@16Febrero",
  role: "authenticated",
};

export const badUsers = [
  // missing name
  {
    lastName: "Doe",
    email: "john@gmail.com",
    username: "johndoe",
    password: "@16Febrero",
    role: "authenticated",
  },
  // name to short
  {
    name: "J",
    lastName: "Doe",
    email: "john@gmail.com",
    username: "johndoe",
    password: "@16Febrero",
    role: "authenticated",
  },
  // name to long
  {
    name: "Este es un nombre muy largo que no debería ser permitido por el sistema",
    lastName: "Doe",
    email: "john@gmail.com",
    username: "johndoe",
    password: "@16Febrero",
    role: "authenticated",
  },
  // missing lastName
  {
    name: "John",
    email: "john@gmail.com",
    username: "johndoe",
    password: "@16Febrero",
    role: "authenticated",
  },
  // lastName to short
  {
    name: "John",
    lastName: "D",
    email: "john@gmail.com",
    username: "johndoe",
    password: "@16Febrero",
    role: "authenticated",
  },
  // lastName to long
  {
    name: "John",
    lastName:
      "Este es un apellido muy largo que no debería ser permitido por el sistema",
    email: "john@gmail.com",
    username: "johndoe",
    password: "@16Febrero",
    role: "authenticated",
  },
  // missing email
  {
    name: "John",
    lastName: "Doe",
    username: "johndoe",
    password: "@16Febrero",
    role: "authenticated",
  },
  // validate gmail/hotmail/outlook email
  {
    name: "John",
    lastName: "Doe",
    email: "udjejdkj@dkekjdk",
    username: "johndoe",
    password: "@16Febrero",
    role: "authenticated",
  },
  // missing username
  {
    name: "John",
    lastName: "Doe",
    email: "r@gmail.com",
    password: "@16Febrero",
    role: "authenticated",
  },
  // username to short
  {
    name: "John",
    lastName: "Doe",
    email: "r@gmail.com",
    username: "j",
    password: "@16Febrero",
    role: "authenticated",
  },
  // username to long
  {
    name: "John",
    lastName: "Doe",
    email: "r@gmail.com",
    username: "Este es un nombre de usuario muy largo",
    password: "@16Febrero",
    role: "authenticated",
  },
  // missing password
  {
    name: "John",
    lastName: "Doe",
    email: "r@gmail.com",
    username: "johndoe",
    role: "authenticated",
  },
  // password to short (but correctly formatted)
  {
    name: "John",
    lastName: "Doe",
    email: "r@gmail.com",
    username: "johndoe",
    password: "aA@1",
    role: "authenticated",
  },
  // password invalid format
  {
    name: "John",
    lastName: "Doe",
    email: "r@gmail.com",
    username: "johndoe",
    password: "123456",
    role: "authenticated",
  },
  // validate unique user
  {
    name: "John",
    lastName: "Doe",
    email: "john@gmail.com",
    username: "johndoe",
    password: "@16Febrero",
    role: "authenticated",
  },
];
