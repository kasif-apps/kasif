import { Transition } from '@kasif/components/Transition/TransitionWrapper';
import { app } from '@kasif/config/app';
import { useSlice } from '@kasif/util/cinq-react';
import { animations } from '@kasif/util/misc';
import {
  Box,
  Button,
  Card,
  Center,
  CloseButton,
  createStyles,
  Divider,
  Group,
  MultiSelect,
  MultiSelectValueProps,
  Stack,
  Text,
} from '@mantine/core';
import { permissionDescriptions, permissions, PermissionType } from '@kasif/config/permission';
import { forwardRef } from 'react';
import { PluginImport } from '@kasif/managers/plugin';
import { prebuiltViews } from '@kasif/config/view';
import { IconShoppingBag } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xl,
  },

  title: {
    lineHeight: 1,
    marginTop: 4,
  },
}));

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps & { selected: boolean }>(
  ({ label, description, selected, ...others }: ItemProps & { selected: boolean }, ref) => (
    <div style={{ marginBottom: 2 }} ref={ref} {...others}>
      <Group noWrap position="apart">
        <div>
          <Text>{label}</Text>
          <Text size="xs" color={!selected ? 'dimmed' : undefined}>
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

function ValueComponent({
  value,
  label,
  onRemove,
  plugin,
  classNames,
  ...others
}: MultiSelectValueProps & { value: string; plugin: PluginImport }) {
  const [appPermissions] = useSlice(app.permissionManager.store);
  const pluginPermissions = appPermissions[plugin.meta.identifier] || [];
  const index = pluginPermissions.indexOf(value as PermissionType);
  const limit = 4;

  if (pluginPermissions.length > limit && index > limit) {
    if (index === limit + 1) {
      return (
        <div {...others}>
          <Box
            px="xs"
            py={4}
            sx={(theme) => ({
              display: 'flex',
              cursor: 'default',
              alignItems: 'center',
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
              border: `1px solid ${
                theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[4]
              }`,
              borderRadius: theme.radius.sm,
            })}
          >
            <Box sx={{ lineHeight: 1, fontSize: 12 }}>
              {pluginPermissions.length - limit} more items
            </Box>
          </Box>
        </div>
      );
    }
    return null;
  }

  return (
    <div {...others}>
      <Box
        sx={(theme) => ({
          display: 'flex',
          cursor: 'default',
          alignItems: 'center',
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          border: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[4]
          }`,
          paddingLeft: theme.spacing.xs,
          borderRadius: theme.radius.sm,
        })}
      >
        <Box sx={{ lineHeight: 1, fontSize: 12 }}>{label}</Box>
        <CloseButton
          onMouseDown={onRemove}
          variant="transparent"
          size={22}
          ml={2}
          color="dark"
          iconSize={12}
          tabIndex={-1}
        />
      </Box>
    </div>
  );
}
export function PermissionsPage() {
  const { classes } = useStyles();
  const [plugins] = useSlice(app.pluginManager.plugins);
  const [appPermissions] = useSlice(app.permissionManager.store);

  const handleChange = (id: string, values: PermissionType[]) => {
    app.permissionManager.store.setKey(id, values);
  };

  return (
    <Transition transition={animations.scale}>
      <Box p="sm" sx={{ maxWidth: 1200, margin: 'auto' }}>
        <Card data-non-capture-source radius="md" p="xl" className={classes.card}>
          <Text size="xl" className={classes.title} weight={800}>
            Edit Permissions
          </Text>
          {plugins.length === 0 && (
            <Center>
              <Stack>
                <Text size="sm" sx={{ textTransform: 'uppercase' }} color="dimmed">
                  You don&apos;t have any plugins installed
                </Text>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <Button
                    size="xs"
                    onClick={() => app.viewManager.pushView({ view: prebuiltViews.store })}
                    leftIcon={<IconShoppingBag size={16} />}
                  >
                    Go To The Store
                  </Button>
                </Box>
              </Stack>
            </Center>
          )}
          {plugins.map((plugin) => (
            <Group key={plugin.meta.identifier} position="apart">
              <Stack spacing={0}>
                <Text>{plugin.meta.name}</Text>
                <Text size="sm" color="dimmed">
                  {plugin.meta.identifier}
                </Text>
              </Stack>
              <MultiSelect
                sx={{ maxWidth: 400 }}
                withinPortal
                disableSelectedItemFiltering
                nothingFound="Nothing found"
                placeholder="Pick all that you like"
                valueComponent={(props) => <ValueComponent plugin={plugin} {...props} />}
                itemComponent={SelectItem}
                searchable
                value={appPermissions[plugin.meta.identifier]}
                onChange={(values) =>
                  handleChange(plugin.meta.identifier, values as PermissionType[])
                }
                data={permissions.map((item) => ({
                  label: permissionDescriptions[item].label,
                  description: permissionDescriptions[item].description,
                  value: item,
                }))}
              />
              <Divider sx={{ width: '100%' }} />
            </Group>
          ))}
        </Card>
      </Box>
    </Transition>
  );
}
