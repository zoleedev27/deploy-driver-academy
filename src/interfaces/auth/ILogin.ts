export interface LogInRequest{
    email : string,
    password : string,
}

export interface LogInResponse{
    success : boolean,
    token : string,
    user : {
        first_name : string,
        last_name : string,
        email: string,
    },
    token_type : string,
}