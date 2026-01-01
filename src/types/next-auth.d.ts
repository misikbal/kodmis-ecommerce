declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    role: 'ADMIN' | 'VENDOR' | 'CUSTOMER'
  }

  interface Session {
    user: User & {
      role: 'ADMIN' | 'VENDOR' | 'CUSTOMER'
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: 'ADMIN' | 'VENDOR' | 'CUSTOMER'
  }
}
