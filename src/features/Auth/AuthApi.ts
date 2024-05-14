import AxiosClient from "@/apis/AxiosClient"

interface PayloadLogin {
  password: string
  phone_number: string
}

export const requestLogin = (payload: PayloadLogin) =>
  AxiosClient.post('/admin/session', payload)
export const requestLogout = () => AxiosClient.put('/users/logout')
export const requestGetUserInfo = () => AxiosClient.get('/users/me')
