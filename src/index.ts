interface Options {
  root: string;
  state?: any;
  app: ElementProps;
}

interface ElementProps {
  tagName: string;
  props?: Record<string, any>;
  children: ElementProps | string | Array<ElementProps | string>;
}

class SPA<TState extends Record<string, unknown>> {
  public root: HTMLElement | null;
  public state: TState;
  private app: ElementProps;

  constructor(options: Options) {
    this.root = document.querySelector(options.root);

    if (!this.root) {
      throw Error('Root element not found');
    }

    this.state = options.state;
    this.app = options.app;

    this.render();
  }

  createElement(
    {
      tagName,
      props,
      children
    }: ElementProps
  ): HTMLElement {
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
  
    const appendChild = (value: HTMLElement | string): void => {
      if (value instanceof HTMLElement) {
        elem.appendChild(value);
      }
      if (typeof value === 'string') {
        let text = value;
        text = text.replace(/{(.+?)}/gi, match => {
          const key = match.replace(/\{|\}|\s/g, '');
          return this.state && Object.prototype.hasOwnProperty.call(this.state, key)
            ? this.state[key] as string
            : match;
        });
        elem.innerText = text;
      }
    };

    const appendStringOrElement = (child: string | ElementProps): void => {
      if (typeof child === 'string') {
        appendChild(child);
      } else {
        appendChild(this.createElement(child));
      }
    };
  
    if (children) {
      if (Array.isArray(children)) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          appendStringOrElement(child);
        }
      } else {
        appendStringOrElement(children);
      }
    }
  
    return elem;
  }

  update(callback: (newState: TState) => TState): void {
    if (
      this.state &&
      this.state instanceof Object &&
      callback &&
      callback instanceof Function &&
      this.root
    ) {
      const newState = callback(this.state);
      this.state = Object.assign(this.state, newState);
      this.render();
    }
  }

  render(): void {
    if (this.root) {
      const htmlElem = this.createElement(this.app);
      this.root.innerHTML = '';
      this.root.appendChild(htmlElem);
    } else {
      throw Error('Root element not found');
    }
  }
}

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
