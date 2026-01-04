import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import Provider from './provider'
import AuthFooter from './auth-footer'

type AuthFormProps = {
    children: React.ReactNode
    title: string
    description: string
    href: string,
    label: string,
    btnText: string,
    isProvider: boolean
}

const AuthForm = ({ children, title, description, href, label, btnText, isProvider }: AuthFormProps) => {
    return (
        <Card className='w-full max-w-[500px] border-none shadow-none md:border md:shadow-sm'>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            <CardFooter className=' flex flex-col gap-2'>
                {isProvider && (
                    <>
                        {/* TODO: we will activate in the future */}
                        {/* <Provider /> */}
                        <AuthFooter href={href} label={label} btnText={btnText} />
                    </>
                )}
            </CardFooter>
        </Card>
    )
}

export default AuthForm