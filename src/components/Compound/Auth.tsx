import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Anchor,
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  Divider,
  Group,
  Loader,
  LoadingOverlay,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  createStyles,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';

import {
  DiscordButton,
  GithubButton,
  GoogleButton,
  SpotifyButton,
} from '@kasif/components/Primitive/SocialButtons';
import { BackendError, backend } from '@kasif/config/backend';
import { environment } from '@kasif/util/environment';
import { animations } from '@kasif/util/misc';

import { Transition } from '../Transition/TransitionWrapper';

interface AuthProvider {
  authUrl: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  codeVerifier: string;
  name: 'github' | 'google' | 'discord' | 'spotify';
  state: string;
}

const globalAuthMethods = {
  github: (props: Parameters<typeof GithubButton>[0]) => <GithubButton {...props} />,
  google: (props: Parameters<typeof GoogleButton>[0]) => <GoogleButton {...props} />,
  discord: (props: Parameters<typeof DiscordButton>[0]) => <DiscordButton {...props} />,
  spotify: (props: Parameters<typeof SpotifyButton>[0]) => <SpotifyButton {...props} />,
};

export function SignInLogin(props: PaperProps) {
  const theme = useMantineTheme();
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: false,
    },

    validate: {
      email: val => (val.length <= 2 ? 'Email or username should at least be 2 characters' : null),
      password: val => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const [subscriptionChannel, setSubscriptionChannel] = useState<string | null>(null);
  const [authProviders, setAuthProviders] = useState<AuthProvider[]>([]);
  const redirectUrl = `${import.meta.env.VITE_REACT_API_URL}/api/users/auth-redirect`;
  const [loading, setLoading] = useState(false);
  const [oauth2Loading, setOauth2Loading] = useState(true);
  const { t } = useTranslation();

  const handleOAuthLogin = useCallback(async (provider: AuthProvider) => {
    const record = await backend.collection('auth_table').create({
      state: provider.state,
    });

    if (record) {
      const channel = `auth_table/${provider.state}`;
      setSubscriptionChannel(channel);

      backend.realtime.subscribe(channel, event => {
        if (event.code) {
          backend
            .collection('users')
            .authWithOAuth2(provider.name, event.code, provider.codeVerifier, redirectUrl)
            .then(async () => {
              setLoading(false);
            });
        }
      });

      if (environment.currentEnvironment === 'desktop') {
        environment.invoke('launch_auth', {
          path: provider.authUrl + redirectUrl,
        });
      } else {
        window.open(provider.authUrl + redirectUrl, '_blank', 'noopener,noreferrer');
      }

      setLoading(true);
    }
  }, []);

  useEffect(() => {
    backend
      .collection('users')
      .listAuthMethods()
      .then(authMethods => {
        setAuthProviders(authMethods.authProviders as AuthProvider[]);
        setOauth2Loading(false);
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
      sx={{ maxWidth: 570, margin: 'auto', height: '100%', display: 'flex', alignItems: 'center' }}>
      <Paper radius={theme.defaultRadius} p="xl" withBorder sx={{ width: '100%' }} {...props}>
        <LoadingOverlay loaderProps={{ variant: 'dots' }} visible={loading} />
        <Text size="lg" weight={500}>
          {t('profile.welcome')}
        </Text>

        <Group sx={{ minHeight: 36 }} grow mb="md" mt="md" spacing="xs">
          {oauth2Loading && (
            <Center>
              <Loader sx={{ maxWidth: 30 }} variant="dots" />
            </Center>
          )}
          {authProviders.map(provider => (
            <Transition transition={animations.scale}>
              {React.createElement(
                globalAuthMethods[provider.name],
                { onClick: () => handleOAuthLogin(provider), radius: 'xl' },
                `${upperFirst(provider.name)}`
              )}
            </Transition>
          ))}
        </Group>

        <Divider label={t('profile.or-continue-with-email')} labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit(handleLogin)}>
          <Stack>
            {type === 'register' && (
              <TextInput
                label={t('profile.name')}
                placeholder={t('profile.name')!}
                value={form.values.name}
                onChange={event => form.setFieldValue('name', event.currentTarget.value)}
              />
            )}

            <TextInput
              required
              label={type === 'login' ? t('profile.email-or-username') : t('profile.email')}
              placeholder="hello@kasif.app"
              value={form.values.email}
              onChange={event => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email}
            />

            <PasswordInput
              required
              label={t('profile.password')}
              placeholder={t('profile.password')!}
              value={form.values.password}
              onChange={event => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password should include at least 6 characters'}
            />

            {type === 'register' && (
              <Checkbox
                label={t('profile.terms-and-conditions')}
                checked={form.values.terms}
                onChange={event => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            )}
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => toggle()}
              size="xs">
              {type === 'register'
                ? t('profile.already-have-account')
                : t('profile.dont-have-account')}
            </Anchor>
            <Button type="submit" radius="xl">
              {t(`profile.${type}`)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Box>
  );
}

const useStyles = createStyles(theme => ({
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
  const { t } = useTranslation();

  return (
    <Card radius={theme.defaultRadius} className={classes.card}>
      <Card.Section
        sx={{
          backgroundImage: 'url(/splashes/splash_24.webp)',
          backgroundSize: 'cover',
          height: 200,
        }}
      />

      <Card.Section p="md" pt={0} sx={{ height: '100%' }}>
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
              mt="xl"
              size="sm"
              color={theme.colorScheme === 'dark' ? undefined : 'dark'}
              onClick={() => backend.authStore.clear()}>
              {t('profile.logout')}
            </Button>
            <Button
              sx={{ flex: 1 }}
              mt="xl"
              size="sm"
              color={theme.colorScheme === 'dark' ? undefined : 'dark'}>
              {t('profile.upload-app')}
            </Button>
          </Group>
        </Stack>
      </Card.Section>
    </Card>
  );
}
