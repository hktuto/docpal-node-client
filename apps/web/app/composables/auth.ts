import {apiClient} from 'api'

export const useIsAuthenticated = () => useState('isAuthenticated', () => false)

export async function loginApi(email: string, password: string) {
  const isAuthenticated = useIsAuthenticated()
  const response = await apiClient.auth.postAuthLogin({
    email,
    password
  })
  if(response.success){
    isAuthenticated.value = true
  }
  return response
}


