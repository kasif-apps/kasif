import { useForm } from '@mantine/form';
import { useToggle, upperFirst } from '@mantine/hooks';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Box,
  Avatar,
  Card,
  createStyles,
  LoadingOverlay,
} from '@mantine/core';
import {
  GoogleButton,
  TwitterButton,
  GithubButton,
} from '@kasif/components/Primitive/SocialButtons';
import React, { useCallback, useEffect, useState } from 'react';
import { backend, BackendError } from '@kasif/config/backend';
import { invoke } from '@tauri-apps/api';

interface AuthProvider {
  authUrl: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  codeVerifier: string;
  name: 'github' | 'google' | 'twitter';
  state: string;
}

const globalAuthMethods = {
  github: (props: any) => <GithubButton {...props} />,
  google: (props: any) => <GoogleButton {...props} />,
  twitter: (props: any) => <TwitterButton {...props} />,
};

export function SignInLogin(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: false,
    },

    validate: {
      email: (val) =>
        val.length <= 2 ? 'Email or username should at least be 2 characters' : null,
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const [subscriptionChannel, setSubscriptionChannel] = useState<string | null>(null);
  const [authProviders, setAuthProviders] = useState<AuthProvider[]>([]);
  const redirectUrl = `${import.meta.env.VITE_REACT_API_URL}/api/users/auth-redirect`;
  const [loading, setLoading] = useState(false);

  const handleOAuthLogin = useCallback(async (provider: AuthProvider) => {
    const record = await backend.collection('auth_table').create({
      state: provider.state,
    });

    if (record) {
      const channel = `auth_table/${provider.state}`;
      setSubscriptionChannel(channel);

      backend.realtime.subscribe(channel, (event) => {
        if (event.code) {
          backend
            .collection('users')
            .authWithOAuth2(provider.name, event.code, provider.codeVerifier, redirectUrl)
            .then(async () => {
              setLoading(false);
            });
        }
      });

      invoke('launch_auth', {
        path: provider.authUrl + redirectUrl,
      });
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    backend
      .collection('users')
      .listAuthMethods()
      .then((authMethods) => {
        setAuthProviders(authMethods.authProviders as AuthProvider[]);
      });

    return () => {
      if (subscriptionChannel) {
        backend.realtime.unsubscribe(subscriptionChannel);
      }
    };
  }, []);

  const handleLogin = async () => {
    if (type === 'login') {
      setLoading(true);
      try {
        await backend.collection('users').authWithPassword(form.values.email, form.values.password);
      } catch (error) {
        const { message } = (error as BackendError).response;

        form.setFieldError('password', message);
      }
      setLoading(false);
    }
  };

  return (
    <Box
      p="sm"
      pt={0}
      sx={{ maxWidth: 550, margin: 'auto', height: '100%', display: 'flex', alignItems: 'center' }}
    >
      <Paper radius="md" p="xl" withBorder sx={{ width: '100%' }} {...props}>
        <LoadingOverlay loaderProps={{ variant: 'dots' }} visible={loading} />
        <Text size="lg" weight={500}>
          Welcome to Kâşif, {type} with
        </Text>

        <Group sx={{ minHeight: 36 }} grow mb="md" mt="md">
          {authProviders.map((provider) =>
            React.createElement(
              globalAuthMethods[provider.name],
              { onClick: () => handleOAuthLogin(provider), radius: 'xl' },
              `Login with ${upperFirst(provider.name)}`
            )
          )}
        </Group>

        <Divider label="Or continue with email" labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit(handleLogin)}>
          <Stack>
            {type === 'register' && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                radius="md"
              />
            )}

            <TextInput
              required
              label="Email or username"
              placeholder="hello@kasif.app"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password should include at least 6 characters'}
              radius="md"
            />

            {type === 'register' && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            )}
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Box>
  );
}

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    maxWidth: 400,
    height: '100%',
    width: '100%',
  },

  content: {
    justifyContent: 'space-between',
    height: 'calc(100% - 170px)',
  },

  avatar: {
    border: `2px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
  },
}));

interface UserCardProps {
  avatar: string;
  name: string;
  title: string;
}

export function UserCard({ avatar, name, title }: UserCardProps) {
  const { classes, theme } = useStyles();

  return (
    <Card p="xl" radius="md" className={classes.card}>
      <Card.Section
        sx={{
          backgroundImage: 'url(/splashes/splash_24.webp)',
          backgroundSize: 'cover',
          height: 200,
        }}
      />
      <Stack spacing={0} className={classes.content}>
        <Stack spacing={0}>
          <Avatar
            src={avatar}
            size={80}
            radius={80}
            mx="auto"
            mt={-30}
            className={classes.avatar}
          />
          <Text ta="center" fz="lg" fw={500} mt="sm">
            {name}
          </Text>
          <Text ta="center" fz="sm" c="dimmed">
            {title}
          </Text>
        </Stack>
        <Group>
          <Button
            sx={{ flex: 1 }}
            variant="light"
            radius="md"
            mt="xl"
            size="sm"
            color={theme.colorScheme === 'dark' ? undefined : 'dark'}
            onClick={() => backend.authStore.clear()}
          >
            Logout
          </Button>
          <Button
            sx={{ flex: 1 }}
            radius="md"
            mt="xl"
            size="sm"
            color={theme.colorScheme === 'dark' ? undefined : 'dark'}
          >
            Upload An App
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
