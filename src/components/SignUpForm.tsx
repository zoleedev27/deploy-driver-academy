// src/components/SignUpForm.tsx
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "next-i18next";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useRouter } from "next/router";
import {findMockUserByEmail, generateVerificationToken, initMockDataVerified, registerMockUser, sendMockVerificationEmail} from "@/constants/MockUsersVerified"

export default function SignUpForm() {
    const { t } = useTranslation('signUp');
    const router = useRouter();

    // Create the schema with translations
    const formSchema = useMemo(() => z.object({
        name: z.string().min(2, {
            message: t('signup.validation.name.length')
        }),
        email: z.string().email({
            message: t('signup.validation.invalid.email')
        }),
        password: z.string()
            .min(8, { message: t('signup.validation.password.length') })
            .regex(/[A-Z]/, { message: t('signup.validation.password.uppercase') })
            .regex(/[a-z]/, { message: t('signup.validation.password.lowercase') })
            .regex(/[0-9]/, { message: t('signup.validation.password.digit') })
            .regex(/[^A-Za-z0-9]/, { message: t('signup.validation.password.special') }),
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: t('signup.validation.passwords.match'),
        path: ["confirmPassword"]
    }), [t]);

    type SignUpSchema = z.infer<typeof formSchema>;

    const form = useForm<SignUpSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        digit: false,
        special: false
    });

    // Watch the password field and update requirements
    const passwordValue = form.watch("password");

    useEffect(() => {
        const updatedRequirements = {
            length: passwordValue.length >= 8,
            uppercase: /[A-Z]/.test(passwordValue),
            lowercase: /[a-z]/.test(passwordValue),
            digit: /[0-9]/.test(passwordValue),
            special: /[^A-Za-z0-9]/.test(passwordValue)
        };
        setPasswordRequirements(updatedRequirements);
    }, [passwordValue]);

 

  


useEffect(() => {
    initMockDataVerified();
  }, []);

  

  const onSubmit = async (data: SignUpSchema) => {
  
    try {
      if (findMockUserByEmail(data.email)) {
        return;
      }

      const newUser = registerMockUser(data.name, data.email, data.password);
      const token = generateVerificationToken(newUser.id, newUser.email);

      if (!token) {
        return;
      }

      await sendMockVerificationEmail(newUser.email, token);
      router.push(`/signup/instructions-email?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      console.error(err);
    } finally {
    }
  };



    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 bg-white dark:bg-gray-800 shadow-md rounded-xl p-8 w-sm mx-auto mt-20"
            >
                <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
                    {t('signup.create.account')}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {t('signup.description')}
                </p>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">{t('signup.name.label')}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={t('signup.name.placeholder')}
                                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">{t('signup.email.label')}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={t('signup.email.placeholder')}
                                    type="email"
                                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">{t('signup.password.label')}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder={t('signup.password.placeholder')}
                                        type={showPassword ? "text" : "password"}
                                        className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                            <div className="text-xs mt-2">
                                <p className="mb-1 text-gray-600 dark:text-gray-400">{t('signup.password.requirements')}</p>
                                <ul className="space-y-1">
                                    <li className="flex items-center space-x-2">
                                        <span className={`flex-shrink-0 ${passwordRequirements.length ? 'text-green-500' : 'text-red-500'}`}>
                                            {passwordRequirements.length ? <Check size={16} /> : <X size={16} />}
                                        </span>
                                        <span className={passwordRequirements.length ? 'text-green-700 dark:text-green-500' : 'text-gray-600 dark:text-gray-400'}>
                                            {t('signup.password.requirement.length')}
                                        </span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className={`flex-shrink-0 ${passwordRequirements.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                                            {passwordRequirements.uppercase ? <Check size={16} /> : <X size={16} />}
                                        </span>
                                        <span className={passwordRequirements.uppercase ? 'text-green-700 dark:text-green-500' : 'text-gray-600 dark:text-gray-400'}>
                                            {t('signup.password.requirement.uppercase')}
                                        </span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className={`flex-shrink-0 ${passwordRequirements.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                                            {passwordRequirements.lowercase ? <Check size={16} /> : <X size={16} />}
                                        </span>
                                        <span className={passwordRequirements.lowercase ? 'text-green-700 dark:text-green-500' : 'text-gray-600 dark:text-gray-400'}>
                                            {t('signup.password.requirement.lowercase')}
                                        </span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className={`flex-shrink-0 ${passwordRequirements.digit ? 'text-green-500' : 'text-red-500'}`}>
                                            {passwordRequirements.digit ? <Check size={16} /> : <X size={16} />}
                                        </span>
                                        <span className={passwordRequirements.digit ? 'text-green-700 dark:text-green-500' : 'text-gray-600 dark:text-gray-400'}>
                                            {t('signup.password.requirement.digit')}
                                        </span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className={`flex-shrink-0 ${passwordRequirements.special ? 'text-green-500' : 'text-red-500'}`}>
                                            {passwordRequirements.special ? <Check size={16} /> : <X size={16} />}
                                        </span>
                                        <span className={passwordRequirements.special ? 'text-green-700 dark:text-green-500' : 'text-gray-600 dark:text-gray-400'}>
                                            {t('signup.password.requirement.special')}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-300">{t('signup.confirm.password.label')}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder={t('signup.confirm.password.placeholder')}
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    {t('signup.submit.button')}
                </Button>

                <div className="pt-2 text-center">
                    <Button variant="link" onClick={() => router.push('/')}>
                        {t('signup.back.to.home')}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
