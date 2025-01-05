import { Button, Heading, Html, Text } from '@react-email/components';
import * as React from 'react';

interface EmailResetPasswordProps {
  confirmationUrl: string;
}

export function EmailResetPassword({ confirmationUrl }: EmailResetPasswordProps) {
  return (
    <Html>
      <Heading as="h1">ResetPassword</Heading>
      <Text>Click the link below to confirm your email:</Text>
      <Button href={confirmationUrl}>Click me</Button>
    </Html>
  );
}
