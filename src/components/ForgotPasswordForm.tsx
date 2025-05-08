import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription} from "./ui/alert";
import { KeyRound, ArrowRight, AtSign} from "lucide-react"
import {getSchema} from "@/types/SchemaEmailForgotPassword"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { findMockUserByEmail, generateResetToken, initMockData, sendMockEmail } from "@/constants/MockUsers";
import { useRouter } from "next/navigation";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useTranslation } from "next-i18next";
import {z} from "zod";

const ForgotPasswordForm = () => {
    const router = useRouter();

    const {t} = useTranslation("auth");
    const schema = getSchema(t);

    const [error, setError] = useState<string | null>(null);;
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data:  z.infer<typeof schema>) => {
        setIsLoading(true);
        setError(null);
        try{
            const user = findMockUserByEmail(data.email);
            if(!user){
                setError(t("forgot.password.email.reset.errors.user.not.found"));
                setIsLoading(false);
                return;
            }
            const token = generateResetToken(user.id, user.email);
            
            if(!token){
                setError(t("forgot.password.email.reset.errors.token.generation.failed"));
                setIsLoading(false);
                return;
            }

            await sendMockEmail(user.email, token);
            setIsLoading(false);
            
            router.push(`/forgot-password/check-email?email=${encodeURIComponent(data.email)}`);
        }catch(err){
            console.error(err);
            setError(t("forgot.password.email.reset.errors.email.send.failed"));
            setIsLoading(false);
            return;
        }finally{
            setIsLoading(false);
        }
    };

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
        },
    });

    useEffect(() => {
        initMockData();
    },[]);

    return (
        <div className="container flex items-center justify-center min-h-screen px-4 py-10">
            <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-background border-2 border-black dark:border-white">
                            <KeyRound className="h-10 w-10 text-black dark:text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-body text-center">{t("forgot.password.email.reset.form.title")}</CardTitle>
                    <CardDescription className="font-body text-center">{t("forgot.password.email.reset.form.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("forgot.password.email.reset.form.email.label")}</FormLabel>
                                    <FormControl>
                                    <div className="flex items-center relative">
                                        <AtSign className="absolute left-3 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder={t("forgot.password.email.reset.form.email.placeholder")} {...field} className="pl-9"/>
                                    </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>)}/>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                                    {t("forgot.password.email.reset.form.submit.processing")}
                                </span>
                                ):(
                                <span className="flex items-center justify-center">
                                    {t("forgot.password.email.reset.form.submit.send")}<ArrowRight className="ml-2 h-4 w-4"/>
                                </span>
                                )}
                            </Button>
                        </form>
                    </Form>
                        <div className="mt-8 p-4 bg-yellow-300 rounded-lg font-body text-black">
                            <h3 className="mb-2 text-sm ">{t("forgot.password.email.reset.test.users.title")}</h3>
                            <ul className="text-xs space-y-1">
                            <li>
                                Email:{" "}<span>user1@gmail.com</span>
                            </li>
                            <li>
                                Email:{" "}<span>user2@gmail.com</span>
                            </li>
                            <li>
                                Email:{" "}<span>user3@gmail.com</span>
                            </li>
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center items-center font-body">
                        <Button variant = "link"
                        onClick = {() => `${router.push('/')}`} className="hover:text-green-400">
                            <span>{t("forgot.password.email.reset.back.home")}</span>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            );
}

export default ForgotPasswordForm;