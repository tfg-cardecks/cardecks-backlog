// email, username, password, role
export const user = {
  email: "john@gmail.com",
  username: "johndoe",
  password: "@16Febrero",
  role: "authenticated",
};

export const badUsers = [
  // missing email
  {
    username: "johndoe",
    password: "@16Febrero",
    role: "authenticated",
  },
  // validate gmail/hotmail/outlook email
  {
    email: "udjejdkj@dkekjdk",
    username: "johndoe",
    password: "@16Febrero",
    role: "authenticated",
  },
  // missing username
  {
    email: "r@gmail.com",
    password: "@16Febrero",
    role: "authenticated",
  },
  // username to short
  {
    email: "r@gmail.com",
    username: "j",
    password: "@16Febrero",
    role: "authenticated",
  },
  // username to long
  {
    email: "r@gmail.com",
    username: "Este es un nombre de usuario muy largo",
    password: "@16Febrero",
    role: "authenticated",
  },
  // missing password
  {
    email: "r@gmail.com",
    username: "johndoe",
    role: "authenticated",
  },
  // password to short (but correctly formatted)
  {
    email: "r@gmail.com",
    username: "johndoe",
    password: "aA@1",
    role: "authenticated",
  },
  // password invalid format
  {
    email: "r@gmail.com",
    username: "johndoe",
    password: "123456",
    role: "authenticated",
  },
  // validate unique user
  {
    email: "john@gmail.com",
    username: "johndoe",
    password: "@16Febrero",
    role: "authenticated",
  },
];
