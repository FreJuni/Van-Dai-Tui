'use client'

import { FcGoogle } from "react-icons/fc";
import React from 'react'
import { Button } from '../ui/button'
import { signIn } from "next-auth/react"

const Provider = () => {
    return (
        <div className=" w-full">
            <Button
                className="w-full cursor-pointer "
                variant={'outline'}
                onClick={async () => {
                    await signIn('google', {
                        redirect: true,
                        callbackUrl: '/'
                    })
                }}>
                <FcGoogle />   Google
            </Button>
        </div>
    )
}

export default Provider