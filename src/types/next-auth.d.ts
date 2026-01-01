declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    role: 'ADMIN' | 'VENDOR' | 'CUSTOMER'
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: 'ADMIN' | 'VENDOR' | 'CUSTOMER'
  }
}
