import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    getAlbum,
    mountStampToAlbum,
    updateAlbumNotes,
    unmountFromAlbum
} from "../controllers/album.controller.js";

const albumRouter = express.Router();

albumRouter.get("/", protect, getAlbum);
albumRouter.post("/mount", protect, mountStampToAlbum);
albumRouter.patch("/notes/:stampId", protect, updateAlbumNotes);
albumRouter.delete("/unmount/:stampId", protect, unmountFromAlbum);

export default albumRouter;
