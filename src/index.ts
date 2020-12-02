import { ElementProps, SPA } from "./spa";

const app: ElementProps = {
  tagName: 'div',
  children: [
    { tagName: 'h2', children: 'Счетчик'},
    { tagName: 'h2', children: '{count}'},
    {
      tagName: 'button',
      props: {
        click: () => {
          spa.update(prev => ({
            count: prev.count + 1,
          }));
        },
      },
      children: 'Increment'
    },
  ]
};

const spa = new SPA<{ count: number }>({
  root: '#app',
  state: {
    count: 0,
  },
  app: app
});