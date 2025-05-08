export interface MockUserVerified {
    id: string
    name: string
    email: string
    password: string
    verified: boolean
}

export interface VerificationToken {
    userId: string
    email: string
    token: string
    createdAt: string
}

export const initMockDataVerified = () => {
    if (!localStorage.getItem("mockUsersVerified")) {
      localStorage.setItem(
        "mockUsersVerified",
        JSON.stringify([
          { id: "user1", name: "Test User 1", email: "user1@example.com", password: "password123", verified: true },
          { id: "user2", name: "Test User 2", email: "user2@example.com", password: "password123", verified: true },
          { id: "user3", name: "Test User 3", email: "user3@example.com", password: "password123", verified: true },
        ]),
      )
    }
  
    if (!localStorage.getItem("mockVerificationTokens")) {
      localStorage.setItem("mockVerificationTokens", JSON.stringify([]))
    }
}

export const findMockUserByEmail = (email: string): MockUserVerified | undefined => {
    const users = JSON.parse(localStorage.getItem("mockUsersVerified") || "[]")
    return users.find((user: MockUserVerified) => user.email === email)
}


export const registerMockUser = (name: string, email: string, password: string): MockUserVerified => {
    const users = JSON.parse(localStorage.getItem("mockUsersVerified") || "[]")
    const newUser = {id: `user-${Date.now()}`,name,email,password, verified: false,}
    users.push(newUser)
    localStorage.setItem("mockUsersVerified", JSON.stringify(users))
    return newUser
  }

  export const generateVerificationToken = (userId: string, email: string): string => {
    const token = `verify-${userId}-${Date.now()}`
    const tokens = JSON.parse(localStorage.getItem("mockVerificationTokens") || "[]")
    tokens.push({userId,email,token,createdAt: new Date().toISOString()})
    localStorage.setItem("mockVerificationTokens", JSON.stringify(tokens))
    return token
  }
  
  export const sendMockVerificationEmail = async (email: string, token: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(`Email: ${email}, token: ${token}`)
    return true
  }
  
  export const verifyMockToken = (token: string): { success: boolean; email?: string } => {
    const tokens = JSON.parse(localStorage.getItem("mockVerificationTokens") || "[]")
    const tokenFound = tokens.find((t: VerificationToken) => t.token === token)
  
    if (!tokenFound) {
      return { success: false }
    }
  
    const users = JSON.parse(localStorage.getItem("mockUsersVerified") || "[]")
    const userIndex = users.findIndex((u: MockUserVerified) => u.id === tokenFound.userId);
    if (userIndex === -1) {
      return { success: false }
    }
    users[userIndex].verified = true
    localStorage.setItem("mockUsersVerified", JSON.stringify(users))
    const updatedTokens = tokens.filter((t: VerificationToken) => t.token !== token)
    localStorage.setItem("mockVerificationTokens", JSON.stringify(updatedTokens))
  
    return { success: true, email: users[userIndex].email }
  }
  