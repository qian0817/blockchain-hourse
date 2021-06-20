import axios, {AxiosResponse} from "axios";

export interface Response<T> {
    code: number
    msg: string
    data: T
}

export interface Account {
    accountId: string
    balance: number
    password: string
    userName: string
}

export const queryAccountList: () => Promise<AxiosResponse<Response<Account[]>>> = async () => {
    return await axios.post<Response<Account[]>>('/api/v1/queryAccountList')
}

export const queryAccount = async (accountId: string) => {
    return await axios.post<Response<Account[]>>('/api/v1/queryAccountList', {
        args: [{accountId}]
    })
}

export interface RealEstate {
    encumbrance: boolean            // 担保状态
    proprietor: string              // 业主ID:
    realEstateId: string            // 房产ID
    totalArea: number               // 总空间:
    place: string                   // 地址
    roomType: string                // 房型
    photos: string[]                // 照片
}

export const queryRealEstateList = async (accountId: string) => {
    return await axios.post<Response<RealEstate[]>>('/api/v1/queryRealEstateList', {proprietor: accountId})
}

export interface Selling {
    buyer: string                   // 购买者ID
    createTime: string              // 创建时间
    objectOfSale: string            // 房产ID
    price: number                   // 价格
    salePeriod: number              // 有效期
    seller: string                  // 销售者ID
    sellingStatus: string           // 销售状态
    totalArea: number               // 总空间:
    place: string                   // 地址
    roomType: string                // 房型
    photos: string[]                // 照片
}

export const querySellingList = async (accountId?: string) => {
    return await axios.post<Response<Selling[]>>('/api/v1/querySellingList', {seller: accountId})
}

export interface SellingBuy {
    buyer: string
    createTime: string
    selling: Selling
}

export const querySellingListByBuyer = async (accountId: string) => {
    return await axios.post<Response<SellingBuy[]>>('/api/v1/querySellingListByBuyer', {buyer: accountId})
}

export const createSelling = async (objectOfSale: string, price: number, salePeriod: number, seller: string) => {
    return await axios.post<Response<Selling>>('/api/v1/createSelling', {
        objectOfSale, price, salePeriod, seller
    })
}

export const updateSelling = async (buyer: string, objectOfSale: string, seller: string, status: string) => {
    return await axios.post<Response<Selling>>('/api/v1/updateSelling', {
        buyer, objectOfSale, seller, status
    })
}

export const createSellingByBuy = async (buyer: string, objectOfSale: string, seller: string) => {
    return await axios.post<Response<SellingBuy>>('/api/v1/createSellingByBuy', {
        buyer, objectOfSale, seller
    })
}

export const login = async (username: string, password: string) => {
    return await axios.post<Response<Account>>('/api/v1/login', {username, password})
}

export const register = async (username: string, password: string) => {
    return await axios.post('/api/v1/register', {username, password})
}

export const createRealEstate = async (accountId: string, totalArea: string, proprietor: string, place: string, roomType: string, photos: string[]) => {
    return await axios.post('/api/v1/createRealEstate', {accountId, totalArea, proprietor, place, roomType, photos})
}

export const changeBalance = async (accountId: string, balance: number) => {
    return await axios.post('/api/v1/changeBalance', {accountId, balance})
}