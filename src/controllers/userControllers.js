import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
export const profile = (req, res) => {
  return res.render("users/profile", { pageTitle: "Profile" });
};

export const getJoin = (req, res) => {
  return res.render("users/join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { username, name, email, password } = req.body;
  await User.create({
    username,
    name,
    email,
    password,
  });
  return res.redirect("/");
};

export const getLogin = (req, res) => {
  return res.render("users/login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  if (!user) {
    return res.render("users/login", {
      pageTitle,
      errorMessage: "this username does not exist",
    });
  }

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    return res.render("users/login", {
      pageTitle,
      errorMessage: "Wrong password ",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  console.log(req.session);
  return res.redirect("/");
};
//

export const startWithGitHub = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: "53c0eb88f32959af37ac",
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishWithGitHub = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: "53c0eb88f32959af37ac",
    client_secret: "393af576da5d90e573415625fe646b90a707751f",
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalURL = `${baseUrl}?${params}`;

  const tokenRequest = await (
    await fetch(finalURL, {
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
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
      });
    }

    req.session.loggedIn = true;
    req.session.user = user;
    console.log(user);
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
