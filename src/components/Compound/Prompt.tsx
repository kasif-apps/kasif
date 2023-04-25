import { useState } from 'react';

import { Button, TextInput } from '@mantine/core';

import { DisplayRenderableNode, RenderableNode } from '@kasif/util/node-renderer';

export function InputPrompt({
  title,
  onSubmit,
}: {
  title: string;
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        value={value}
        onChange={e => setValue(e.target.value)}
        label={title}
        placeholder={title}
        data-autofocus
      />
      <Button fullWidth type="submit" mt="md">
        Submit
      </Button>
    </form>
  );
}

export function AlertPrompt({ content }: { content: RenderableNode }) {
  return <DisplayRenderableNode node={content} />;
}
