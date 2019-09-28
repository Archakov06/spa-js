interface Options {
  root: string;
  state?: any;
}

class SPA {
  public root: HTMLElement | null;
  public state: any;
  public cacheApp: HTMLElement | null;

  constructor(options: Options) {
    this.root = document.querySelector(options.root);
    this.state = options.state;
    this.cacheApp = null;
    if (!this.root) {
      throw Error('Root element not found');
    }
  }

  createElement(
    tagName: string,
    props: any,
    children: HTMLElement | string | Array<HTMLElement | string>,
  ) {
    if (!this.root) {
      throw Error('Root element not found');
    }

    const elem = document.createElement(tagName);

    if (props) {
      for (const key in props) {
        const value = props[key];
        if (props.hasOwnProperty(key) && typeof value === 'string') {
          elem.setAttribute(key, value);
        } else if (typeof value === 'function') {
          elem.addEventListener(key, value);
        }
      }
    }

    const appendChild = (value: HTMLElement | string) => {
      if (value instanceof HTMLElement) {
        elem.appendChild(value);
      }
      if (typeof value === 'string') {
        let text = value;
        text = text.replace(/{(.+?)}/gi, match => {
          const key = match.replace(/\{|\}|\s/g, '');
          return this.state && Object.prototype.hasOwnProperty.call(this.state, key)
            ? this.state[key]
            : match;
        });
        elem.innerText = text;
      }
    };

    if (children) {
      if (Array.isArray(children)) {
        for (let i = 0; i < children.length; i++) {
          appendChild(children[i]);
        }
      } else {
        appendChild(children);
      }
    }

    return elem;
  }

  update(newState: any) {
    if (
      this.state &&
      this.state instanceof Object &&
      newState &&
      newState instanceof Object &&
      this.cacheApp
    ) {
      this.state = Object.assign(this.state, newState);
      this.render(this.cacheApp);
    }
  }

  render(app: HTMLElement) {
    if (this.root) {
      this.root.innerHTML = '';
      this.root.appendChild(app);
      this.cacheApp = app;
    } else {
      throw Error('Root element not found');
    }
  }
}

const app = new SPA({
  root: '#app',
  state: {
    name: 'World!',
  },
});

app.render(
  app.createElement('div', { style: 'color: red', class: 'app' }, [
    app.createElement('p', null, 'Hello, {name}'),
    app.createElement(
      'button',
      {
        click: () => {
          app.update({
            name: 'Archakov!',
          });
          alert('Updated');
        },
      },
      'Update name',
    ),
  ]),
);
