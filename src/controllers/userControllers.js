import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) => {
  return res.render("users/join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { username, name, email, password, password2 } = req.body;
  if (password !== password2) {
    return res.render("users/join", {
      pageTitle: "Join",
      errorMessage: "password does not match",
    });
  }
  const exist = await User.exists({ username });
  if (exist) {
    return res.render("users/join", {
      pageTitle: "Join",
      errorMessage: "This Username alreay exist.",
    });
  }
  try {
    await User.create({
      username,
      name,
      email,
      password,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.send(error);
  }
};

export const getLogin = (req, res) => {
  return res.render("users/login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.render("users/login", {
      pageTitle: "Login",
      errorMessage: "This username does not exists",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.render("users/login", {
      pageTitle: "Login",
      errorMessage: "Wrong Password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

//git
export const start = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: "53c0eb88f32959af37ac",
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finish = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: "53c0eb88f32959af37ac",
    client_secret: "fbe0ee2235942ac11bc6893cee039e8c26769409",
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "post",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";

    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    console.log(userData, emailObj);
  }

  return res.redirect("/");
};

export const getProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  return res.render("users/profile", { pageTitle: user.username });
};

export const getEdit = (req, res) => {
  return res.render("users/edit", { pageTitle: "Edit Your Profile" });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { username, name } = req.body;
  const updateUser = await User.findByIdAndUpdate(
    id,
    { username, name },
    { new: true }
  );
  req.session.user = updateUser;
  return res.redirect(`/users/${id}`);
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
