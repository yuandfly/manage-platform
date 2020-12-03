import {
  post
} from "@/http/http"

export const formUpload = (params = {}) => {
  return post("/web/dataUpload/upload", params, {
    headers: {
      'custom-code': '12133'
    },
  })
}
