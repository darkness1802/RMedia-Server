import express from 'express'
import ytdl from 'ytdl-core'

import fs from 'fs'
import yts from 'yt-search'

export const API = express.Router()

API.get("/", async (req, res) => {
    res.status(200).json("You can use API to get data from youtube")
})

/** @method get : video info */
API.get("/info", async (req, res) => {
    // example: http://localhost:8888/api/info?id=dQw4w9WgXcQ
    let { id, type } = req.query
    try {
        if (type === "single") {
            const result = await yts({ videoId: id })
            res.status(200).json(result)
        } else if (type === "playlist") {
            const result = await yts({ listId: id })
            res.status(200).json(result)
        }
    } catch (err) {
        console.log(err)
    }
})

/** @method post : tìm kiếm video */
API.post("/search", async (req, res) => {
    let { keyword, quantity, type } = req.body
    console.log("Search by keyword: ", keyword)
    try {
        const results = await yts(keyword)
        const videos = results.videos.slice(0, quantity)
        res.status(200).json(videos)
    } catch (err) {
        console.log(err)
    }
})

/** @method get : tải file về server rồi truyền về client (beta) */
API.get("/download", async (req, res) => {
    // example: localhost:8888/api/download?id=N-MeunQr8gk
    let { id } = req.query
    ytdl(id).pipe(fs.createWriteStream('temp.mp4'))
        .on("finish", () => {
            res.status(200).download("temp.mp4")
        })
})

/** @method get : client gửi đến 1 playlist id, sever xử lý và gửi về 1 mảng các stream src */
API.get("/tracklist", async (req, res) => {
    let id = req.query.id
    const { videos } = await yts({ listId: id })
    Promise.all(videos.map(item => {
        return ytdl.getInfo(item.videoId)
    })).then(result => {
        let src = result.map(item => {
            return item.formats.find(i => i.itag === 251).url
        })
        res.status(200).json(src)
    })
})

/** @method get : nhận id và type, trả về 1 media stream src */
API.get("/stream", async (req, res) => {
    let { id, type } = req.query // example: localhost:8888/api/stream?id=N-MeunQr8gk&type=audio
    console.log(`Get media stream url: ${id}, type: ${type}`)
    try {
        if (type === "audio") {
            let { formats } = await ytdl.getInfo(id)
            let { url } = formats.find(item => item.itag === 251)
            res.status(200).json(url)
        } if (type === "video") {
            // let { formats } = await ytdl.getInfo(id)
            // let { url } = formats.find(item => item.itag === 251)
            res.status(500).json("Tinh nang dang thu nghiem")
        }
    } catch (err) {
        console.log("Video ID not found")
        res.status(500).json("Not found")
    }
})

export default API