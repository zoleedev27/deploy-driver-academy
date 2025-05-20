export interface RegisterRequest{
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    password_confirmation: string
}

export interface RegisterResponse{
    success : boolean,
    user : {
        first_name: string,
        last_name: string,
        email: string,
    };
    token_type : string;
}