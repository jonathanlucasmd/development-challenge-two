"use strict";

const AWS = require("aws-sdk");
const sharp = require("sharp");
const { basename, extname } = require("path");

const S3 = new AWS.S3();

async function optimizeImage({file, key}){
  const optimized = await sharp(file.Body)
          .resize(1280, 720, { fit: "inside", withoutEnlargement: true })
          .toFormat("jpeg", { progressive: true, quality: 50 })
          .toBuffer();

        await S3.putObject({
          Body: optimized,
          Bucket: process.env.bucket,
          ContentType: "image/jpeg",
          Key: `compressed/${basename(key, extname(key))}.jpg`
        }).promise();

        await S3.deleteObject({
          Bucket: process.env.bucket,
          Key: key
        }).promise();
}


module.exports.optimize = async ({ Records: records }, context) => {
  try {
    await Promise.all(
      records.map(async record => {
        const { key } = record.s3.object;

        const file = await S3.getObject({
          Bucket: process.env.bucket,
          Key: key
        }).promise();

    

        if(extname(key) === '.jpg' || extname(key) === '.jpeg' || extname(key) === '.png'  ) {
          await optimizeImage({file, key})
        }else {
          console.log('Arquivo não permitido! Deletando arquivo...')
          await S3.deleteObject({
            Bucket: process.env.bucket,
            Key: key
          }).promise()
        }
      })
    );

    return {
      statusCode: 301,
      body: { ok: true }
    };
  } catch (err) {
    console.log(err)
    return err;
  }
};