import { Button, Heading, Html, Text } from '@react-email/components';
import * as React from 'react';

interface EmailConfirmationProps {
  confirmationUrl: string;
}

export function EmailConfirmation({ confirmationUrl }: EmailConfirmationProps) {
  return (
    <Html>
      <Heading as="h1">Email Confirmation</Heading>
      <Text>Click the link below to confirm your email:</Text>
      <Button href={confirmationUrl}>Click me</Button>
    </Html>
  );
}
