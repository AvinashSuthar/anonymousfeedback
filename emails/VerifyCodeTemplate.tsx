

import * as React from 'react';

interface EmailTemplateProps {
    username: string;
    verifyCode: string;
}

export function VerifyCodeTemplate({ username, verifyCode }: EmailTemplateProps) {
    return (
        <div>
            <h1>Welcome, {username}!</h1>
            <p>Your verification code is: <strong>{verifyCode}</strong></p>
            <p>Please use this code to verify your account.</p>
        </div>
    );
}