// Allow scss files to be imported.
declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}
