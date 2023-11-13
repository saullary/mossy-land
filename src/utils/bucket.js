// const axios = require("axios");
import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getFileSize, limitTask } from "./helper";
const { VITE_BUCKET_ENDPOINT } = import.meta.env;

const bucket = {
  client: null,
  defBucket: null,
  listParams: null,
  getFileSize,
  limitTask,
  setClient(credentials) {
    this.client = new S3({
      endpoint: VITE_BUCKET_ENDPOINT,
      region: "eu-west-2",
      credentials,
    });
  },
  checkClient() {
    if (!this.client) throw new Error("Please login first");
  },
  getPrefixByPath(path, segFrom = 2) {
    let prefix = path.split("/").slice(segFrom).join("/");
    if (prefix) prefix += "/";
    return prefix;
  },
  uploadFile(params, opts = {}) {
    if (!params.Bucket) {
      const { Bucket, Prefix } = this.listParams;
      Object.assign(params, {
        Bucket,
        Key: Prefix + params.Key,
      });
    }
    // console.log(params);
    const task = new Upload({
      client: this.client,
      queueSize: 3,
      params,
    });
    task.on("httpUploadProgress", (e) => {
      e.perc = ((e.loaded / e.total) * 100) | 0;
      // console.log(e.perc);
      const fn = opts.onProgress;
      fn && fn(e);
    });
    return task;
  },
  async listBuckets() {
    const res = await this.client.listBuckets({});
    // console.log(res.Buckets); // [{Name, CreationDate}]
    return res.Buckets;
  },
  createBucket(Bucket) {
    return this.client.createBucket({
      Bucket,
    });
  },
  listObjects(params) {
    if (!params.Bucket) {
      params.Bucket = this.defBucket;
    }
    let prefix = params.Prefix;
    if ("folder" in params) {
      prefix = params.folder;
      delete params.folder;
    }
    return this.client
      .listObjectsV2({
        ...params,
      })
      .then((res) => {
        // console.log(res);
        return {
          nextToken: res.NextContinuationToken,
          rows: [
            ...(res.CommonPrefixes || []).map((it) => ({
              key: it.Prefix,
              name: it.Prefix.replace(prefix, "").replace("/", ""),
              prefix: true,
              type: "folder",
            })),
            ...(res.Contents || []).map((it) => {
              const name = it.Key.replace(prefix, "");
              const extMat = /\.(\w+)$/.exec(name) || [];
              const ext = extMat[1];
              let type = "other";
              if (["png", "jpg", "jpeg", "gif", "svg", "ico", "webp"].includes(ext)) {
                type = "image";
              } else if (["mp3", "wav", "ogg"].includes(ext)) {
                type = "audio";
              } else if (["mp4", "mov", "webm", "mpg", "mpeg"].includes(ext)) {
                type = "video";
              }
              // else if (/txt|js|htm|css|java|kotlin|vue|json|sh|swift|md|go/.test(ext)) {
              //   type = "text";
              // }
              return {
                url: `https://${params.Bucket}.4everland.store/${it.Key}`,
                key: it.Key,
                name,
                type,
                size: it.Size,
                sizeUnit: getFileSize(it.Size),
                lastModified: it.LastModified,
                updatedAt: it.LastModified.format("date"),
                etag: it.ETag,
              };
            }),
          ],
          params,
        };
        //
      });
  },
  deleteObjects(params) {
    if (!params.Bucket) {
      params.Bucket = this.listParams.Bucket;
    }
    return this.client.deleteObjects(params);
  },
  async moveObject(srcKey, Key) {
    const { Bucket } = this.listParams;
    await this.client.copyObject({
      CopySource: encodeURIComponent(Bucket + "/" + srcKey),
      Bucket,
      Key,
    });
    await this.client.deleteObject({
      Bucket,
      Key: srcKey,
    });
  },
  putObject(params) {
    if (!params.Bucket) {
      const { Bucket, Prefix } = this.listParams;
      Object.assign(params, {
        Bucket,
        Key: Prefix + params.Key,
      });
    }
    return this.client.putObject(params);
  },
};

export default bucket;

// bucket.listBuckets();
