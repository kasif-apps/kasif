import _icons from './icons.json';

interface Icons {
  iconDefinitions: Record<string, { iconPath: string }>;
  folderNames: Record<string, string>;
  folderNamesExpanded: Record<string, string>;
  fileExtensions: Record<string, string>;
  fileNames: Record<string, string>;
}

const icons: Icons = _icons;

export function getIconPathForFile(filename: string) {
  let result: string;

  if (icons.fileNames[filename]) {
    result = icons.iconDefinitions[icons.fileNames[filename]].iconPath;
  } else {
    const index = filename.indexOf('.');
    const extension = filename.slice(index + 1);
    if (extension && icons.fileExtensions[extension]) {
      result = icons.iconDefinitions[icons.fileExtensions[extension]].iconPath;
    } else {
      result = icons.iconDefinitions.document.iconPath;
    }
  }

  return `../assets/${result}`;
}

export function getIconPathForFolder(name: string) {
  let result: string;

  if (icons.folderNames[name]) {
    result = icons.iconDefinitions[icons.folderNames[name]].iconPath;
  } else {
    result = icons.iconDefinitions.folder.iconPath;
  }

  return `../assets/${result}`;
}

export async function getIcon(path: string, type: 'file' | 'folder') {
  const getter = type === 'file' ? getIconPathForFile : getIconPathForFolder;
  const realPath = getter(path);
  const icon = await import(/* @vite-ignore */ realPath);

  return icon.ReactComponent as React.FC<React.SVGProps<SVGSVGElement>>;
}
