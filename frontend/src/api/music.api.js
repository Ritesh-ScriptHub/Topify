import request from "./base"

export const getAllMusics = (page = 1, limit = 10) =>
  request(`/music?page=${page}&limit=${limit}`)

export const getAllAlbums = () =>
  request("/music/albums")

export const getAlbumById = (albumId) =>
  request(`/music/albums/${albumId}`)

export const getArtistProfile = (username) =>
  request(`/music/artist/${username}`)

export const uploadMusic = (formData) =>
  request("/music/upload", {
    method: "POST",
    body: formData,
  })

export const createAlbum = (body) =>
  request("/music/album", {
    method: "POST",
    body: JSON.stringify(body),
  })