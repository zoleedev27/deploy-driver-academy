export interface MockUser{
    id : number,
    username : string,
    email : string,
    password : string
}

export interface ResetToken {
    token : string,
    userId : number,
    email : string,
    createdAt: number,
    expiresAt: number,
}

export function initMockData(){
    if(!localStorage.getItem("mockUsers")){
        const mockUsers = [
            {
                id : 1,
                username: "test_user_1",
                email: "user1@gmail.com",
                password: "password123"
            },
            {
                id : 2,
                username: "test_user_2",
                email: "user2@gmail.com",
                password: "password123"
            },
            {
                id : 3,
                username: "test_user_3",
                email: "user3@gmail.com",
                password: "password123"
            }
        ];
        localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
    }
    if(!localStorage.getItem("mockResetTokens")){
        localStorage.setItem("mockResetTokens", JSON.stringify([]));
    }
    clearExpiredTokens();
}

export function findMockUserByEmail(email : string) : MockUser | null{
    const users : MockUser[] = JSON.parse(localStorage.getItem("mockUsers") || "[]");
    return users.find(user => user.email === email) || null;
}

export function findMockUserById(id : number) : MockUser | null{
    const users : MockUser[] = JSON.parse(localStorage.getItem("mockUsers") || "[]");
    return users.find(user => user.id === id) || null;
}

export function generateResetToken(userId : number, email : string) : string{
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetToken : ResetToken = {
        token,
        userId,
        email,
        createdAt: Date.now(),
        expiresAt: Date.now() + 1000 * 60 * 60};

    const tokens: ResetToken[] = JSON.parse(localStorage.getItem("mockResetTokens") || "[]");
    const remainTokens = tokens.filter(token => token.userId !== userId);
    remainTokens.push(resetToken);
    localStorage.setItem("mockResetTokens", JSON.stringify(remainTokens));
    return token;
}


export function validateResetToken(token : string) : ResetToken | null{
    const tokens: ResetToken[] = JSON.parse(localStorage.getItem("mockResetTokens") || "[]");
    const tokenFound =  tokens.find(t => t.token === token) || null;
    if(tokenFound && tokenFound.expiresAt > Date.now()){
        return tokenFound;
    }else{
        return null;
    }
}

export function resetUserPassword(userId: number, newPassword: string) : boolean{
    const users : MockUser[] = JSON.parse(localStorage.getItem("mockUsers") || "[]");
    const userIndex = users.findIndex(user => user.id === userId);
    if(userIndex !== -1){
        users[userIndex].password = newPassword;
        localStorage.setItem("mockUsers", JSON.stringify(users));

        const tokens : ResetToken[] = JSON.parse(localStorage.getItem("mockResetTokens") || "[]");
        const remainTokens = tokens.filter(token => token.userId !== userId);
        localStorage.setItem("mockResetTokens", JSON.stringify(remainTokens));
        return true;

    }
    return false;
}


export function sendMockEmail(email: string, token : string): Promise<boolean> {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Reset password link sent to: " + email);
            console.log("Reset Token: " + token);
            console.log("Access with: reset-password?token=" + token);
            resolve(true);
        }, 2000);
    });
}    

export function clearExpiredTokens(): void {
    const tokens: ResetToken[] = JSON.parse(localStorage.getItem("mockResetTokens") || "[]");
    const validTokens = tokens.filter((t) => t.expiresAt > Date.now());
    localStorage.setItem("mockResetTokens", JSON.stringify(validTokens));
}