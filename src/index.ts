import SPA from './spa';

const app = new SPA({
  root: '#app',
  state: {
    count: 0
  }
});

app.render(() =>
  app.createElement('div', null, [
    app.createElement('b', null, 'Counter'),
    app.createElement('h1', { style: 'margin: 10px 0' }, '{count}'),
    app.createElement(
      'button',
      {
        click: () => {
          app.update({
            count: app.state.count + 1
          });
        }
      },
      'Increment'
    )
  ])
);
