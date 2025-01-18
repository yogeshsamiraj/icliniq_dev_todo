import axios from "axios"

const API_URL = "http://localhost:5000/api/products"
export const getAllProducts = () => {
    return axios.get(API_URL+"/getall")
}

export const updateProduct = (id: String, updateData: any) =>{
    return axios.post(API_URL + `/update/${id}`, updateData)
}

export const deleteProduct = (id: String) => {
    return axios.post(API_URL + `/remove/${id}`)
}

export const addProduct = (saveProduct: any) => {
    return axios.post(API_URL, saveProduct)
}