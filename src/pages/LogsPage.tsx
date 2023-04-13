import { Transition } from '@kasif/components/Transition/TransitionWrapper';
import { app } from '@kasif/config/app';
import { NotificationType } from '@kasif/managers/notification';
import { useSlice } from '@kasif/util/cinq-react';
import { animations, getRelativeTime } from '@kasif/util/misc';
import { Box, Card, Center, createStyles, Group, Notification, Stack, Text } from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconInfoCircle, IconX } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xl,
  },

  notification: {
    border: 'none',
    borderRadius: 0,
    backgroundColor: 'transparent',

    '&:not(:last-child)': {
      borderBottom: '1px solid',
      borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
    },
  },

  title: {
    lineHeight: 1,
    marginTop: 4,
    marginBottom: 4,
  },

  emptyMessage: {
    textTransform: 'uppercase',
    fontWeight: 300,
    marginTop: theme.spacing.xl,
  },

  pluginLink: {
    cursor: 'pointer',

    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const getColor = (type: NotificationType) => {
  switch (type) {
    case 'error':
      return 'red';
    case 'success':
      return 'green';
    case 'warn':
      return 'orange';
    default:
      return 'blue';
  }
};

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'error':
      return <IconX size={20} />;
    case 'success':
      return <IconCheck size={20} />;
    case 'warn':
      return <IconAlertTriangle size={20} />;
    default:
      return <IconInfoCircle size={20} />;
  }
};

export function LogsPage() {
  const { classes } = useStyles();
  const [logs] = useSlice(app.notificationManager.logs);

  // const items = logs.reverse();

  return (
    <Transition duration={200} transition={animations.scale}>
      <Box p="sm" sx={{ maxWidth: 1200, margin: 'auto' }}>
        <Card data-non-capture-source radius="md" p="xl" className={classes.card}>
          <Text size="xl" className={classes.title} weight={800}>
            Logs
          </Text>
          {logs.length === 0 && (
            <Center>
              <Text className={classes.emptyMessage} color="dimmed" size="xl">
                No Logs Yet
              </Text>
            </Center>
          )}
          <Stack spacing={4}>
            {logs.map((log, i) => (
              <Transition key={i} delay={200} transition={animations.fallDown(i, logs.length)}>
                <Notification
                  className={classes.notification}
                  sx={{ boxShadow: 'none' }}
                  key={i}
                  color={getColor(log.type)}
                  title={
                    <Group position="apart">
                      <span>{log.title}</span>
                      <Group spacing="xs">
                        <Group spacing={0}>
                          <Text
                            role="link"
                            // onClick={() => {
                            //   console.log(log.source.id);
                            // }}
                            size="xs"
                            className={classes.pluginLink}
                          >
                            {log.source.name}
                          </Text>
                          <Text size="xs" color="dimmed">
                            :{log.source.id}
                          </Text>
                        </Group>
                        <Text size="xs" color="dimmed">
                          {getRelativeTime(log.time)}
                        </Text>
                      </Group>
                    </Group>
                  }
                  withCloseButton={false}
                  icon={getIcon(log.type)}
                >
                  {log.message}
                </Notification>
              </Transition>
            ))}
          </Stack>
        </Card>
      </Box>
    </Transition>
  );
}
