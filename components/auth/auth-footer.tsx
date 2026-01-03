import { Link } from '@/src/i18n/navigation';

import React from 'react'

type AuthFooterProps = {
    href: string,
    label: string,
    btnText: string
}

const AuthFooter = ({ href, label, btnText }: AuthFooterProps) => {
    return (
        <div>
            <span>{label}</span>
            <Link className=' underline' href={href}>{btnText}</Link>
        </div>
    )
}

export default AuthFooter