import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", videos });
};

export const getUpload = (req, res) => {
  return res.render("videos/upload", { pageTitle: "Upload" });
};

export const postUpload = async (req, res) => {
  const { title, summary } = req.body;
  await Video.create({
    title,
    summary,
  });

  return res.redirect("/");
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  return res.render("videos/watch", { pageTitle: "Watch", video });
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  return res.render("videos/edit", { pageTitle: "Edit", video });
};

export const postEdit = async (req, res) => {
  const {
    params: { id },
    body: { title, summary },
  } = req;
  console.log(title, summary);
  const newvideo = await Video.findByIdAndUpdate(id, {
    title,
    summary,
  });
  console.log(newvideo);
  return res.redirect(`/videos/${id}`);
};
