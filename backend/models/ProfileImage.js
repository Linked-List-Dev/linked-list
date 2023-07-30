import mongoose from "mongoose"
import fs from "fs"

const profileImageSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
})

export async function saveProfilePhotoFile(photo) {
    return new Promise(function (resolve, reject) {
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "ProfilePhotos" })

        const metadata = {
            contentType: photo.contentType,
        }

        const uploadStream = bucket.openUploadStream(photo.filename, {
            metadata: metadata,
        })
        
        fs.createReadStream(photo.path)
            .pipe(uploadStream)
            .on("error", function (err) {
                reject(err)
            })
            .on("finish", function (result) {
                resolve(result._id)
            })
    })
}

export async function getProfilePhotoDownloadStreamById(photoid) {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "ProfilePhotos" })
    if (mongoose.Types.ObjectId.isValid(photoid)) {
        return bucket.openDownloadStream(new mongoose.Types.ObjectId(photoid))
    }
    return null
}

export async function deleteProfilePhotoById(photoid) {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "ProfilePhotos" })
    if (mongoose.Types.ObjectId.isValid(photoid)) {
        await bucket.delete(new mongoose.Types.ObjectId(photoid))
        return true
    }
    return false
}
